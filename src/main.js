export class DiGraph{
    constructor(type) {
        this.adjList = [];
        this.vertexes = [];
        this.componentOffset = 2;
        this.vertexOffset = 1;
        this.size = 0;
        this.dummyVertexIndex = this.size;
        this.dummyVertexCount = 0;
        this.objectType = type;
    }


    addEdge(from, to) {
      const fromIndex = this.vertexes.indexOf(from);
      const toIndex = this.vertexes.indexOf(to);

      if (!this.adjList[fromIndex]) {
        this.adjList[fromIndex] = [];
      }

      this.adjList[fromIndex].push(toIndex);

    }

   addNode(vertex) {
        if(this.objectType.type !== vertex.type) {
            return "Incorrect type";
        }
        if(this.vertexes.indexOf(vertex) !== -1) {
            return "Vertex already exists";
        }
        this.vertexes.push(vertex);
        this.adjList[vertex] = [];
        this.size = vertex.length;
        this.dummyVertexIndex++;
    }

    #calculateLongestPath(vertex) {
        let count = 0;
        const marked = new Array(this.adjList.length).fill(false);
        function dfs(vertex, curCount, adjList) {
            if(adjList[vertex].length === 0 || marked[vertex]) {
                count = Math.max(count, curCount);
                return;
            }
            marked[vertex] = true;
            adjList[vertex].forEach(neighbour => {
                curCount++;
                dfs(neighbour, curCount, adjList);
            })
        }
        this.adjList[vertex].forEach(neighbour => {
            if(!marked[neighbour]) {
                dfs(vertex, count, this.adjList);
            }
        })
        return count;
    }

    #setVertexesYPosCoffmanGrahamAlgorithm(connectedComponent, width) {
        let sortedGraph = this.#reverseTopologicalSort(connectedComponent);

        const vertexLayerMap = new Map();
        while(sortedGraph.length > 0) {
          const vertex = sortedGraph.shift();
          const predecessors = [];
          Object.keys(this.adjList).forEach(currentVertex => {
            if(this.adjList[currentVertex].includes(vertex)) {
              predecessors.push(parseInt(currentVertex, 10));
            }
          });
          if(predecessors.length === 0) {
              vertexLayerMap.set(vertex, 0);
              continue;
          }
          const layers = [];
          for(let i = 0; i < predecessors.length; i++) {
              if(vertexLayerMap.get(predecessors[i]) !== undefined) {
                  layers.push(vertexLayerMap.get(predecessors[i]));
              }
          }

          const highestLayer = layers.length > 0 ? Math.max(...layers) : 0;

          const elementsOnHighestLayer = Array.from(vertexLayerMap.values()).filter(layer => layer === highestLayer).length;

          if(elementsOnHighestLayer >= width) {
              vertexLayerMap.set(vertex, highestLayer + 2);
          } else {
              vertexLayerMap.set(vertex, highestLayer + 1);
          }
        }
        return vertexLayerMap;
    }



    #reverseTopologicalSort(connectedComponent) {
        const visited = [];
        connectedComponent.nodes.forEach(node => {
            visited.push({
                "node": node,
                "visited": false
            });
        });
        const stack = [];
        function dfs(vertex, adjList, visited) {
            const visitedObj = visited.find(visitedNode => visitedNode.node === vertex);
            if(visitedObj.visited) return;
            visitedObj.visited = true;

            const neighbours = (adjList[vertex] || []).slice().sort((a, b) => {
              return a < b ? -1 : 1;
            });
            for(let i = 0; i < neighbours.length; i++) {
              const neighbour = neighbours[i];
              const neighbourObj = visited.find(visitedNode => visitedNode.node === neighbour);
              if(!neighbourObj.visited) {
                  dfs(neighbour, adjList, visited);
              }
            }
            stack.push(vertex);
        }
        connectedComponent.nodes.sort().forEach(node => {
          const nodeObj = visited.find(visitedNode => visitedNode.node === node);
            if(!nodeObj.visited) {
                dfs(node, this.adjList, visited);
            }
        })

        return stack.reverse();
    }



    #baryCenterHeuristic(connectedComponent, width, layerMap, adjList) {
        let forgivenessNumber = 1000;
        let lowestGlobalCrossing = Number.MAX_SAFE_INTEGER;
        const layersCount = (layerMap) =>
            [...layerMap.values()]
            .reduce((uniqueValues, value) => uniqueValues.add(value), new Set())
            .size;
        const layerGrid = Array.from({ length: layersCount(layerMap) }, () => []);
        const bestLayerGrid = Array.from({ length: layersCount(layerMap) }, () => []);
        for(const[key, value] of layerMap.entries()) {
          layerGrid[value].push(parseInt(key, 10));
        }
        while(forgivenessNumber > 0) {
            for(let l = 1; l < layerGrid.length; l++) {
                this.#baryCentricHeuristicHelper(l, adjList, layerGrid, true);
            }
            for(let l = layerGrid.length - 2; l >= 0; l--) {
                this.#baryCentricHeuristicHelper(l, adjList, layerGrid, false)
            }
            let currentGlobalCrossing = this.#calculateGlobalEdgeCrossings(layerGrid, adjList,connectedComponent);
            if(lowestGlobalCrossing <= currentGlobalCrossing) {
                forgivenessNumber--;
                continue;
            }
            lowestGlobalCrossing = currentGlobalCrossing;
            for(let l = 0; l < layerGrid.length; l++) {
              bestLayerGrid[l] = [...layerGrid[l]];
            }
        }
        bestLayerGrid.forEach(row => console.log("row: ", row));
        return bestLayerGrid;
    }

    #baryCentricHeuristicHelper(layer, adjList, layerGrid, fromTop) {
      const parentLayer = fromTop ? layer - 1 : layer + 1;
      const parentVertexes = layerGrid[parentLayer];
      const currentVertexes = layerGrid[layer];
      const barycentricValues = new Map();
      currentVertexes.forEach(vertex=> {
          const vertexParents = parentVertexes.filter(parentVertex => adjList[parentVertex].includes(vertex));
          if(vertexParents.length === 0) {
              barycentricValues.set(vertex, Number.MAX_SAFE_INTEGER);
              return;
          }
          let barycentricValue = 0;
          for(let i = 0; i < vertexParents.length; i++) {
              const parentPosition = layerGrid[parentLayer].indexOf(vertex[i]);
              barycentricValue += parentPosition;
          }
          barycentricValue /= vertexParents.length;
          barycentricValues.set(vertex, barycentricValue);
      });
      currentVertexes.sort((a, b) => {
          return barycentricValues.get(a) - barycentricValues.get(b);
      });
    }

    #calculateGlobalEdgeCrossings(layerGrid, adjList, connectedComponent) {
        let totalCrossings = 0;
        for(let i = 0; i < layerGrid.length - 1; i++) {
            const curLayer = i;
            const nextLayer = i + 1;
            for(let k = 0; k < layerGrid[i].length; k++) {
              const u1 = layerGrid[i][k];
                for(let j = k + 1; j < layerGrid[i].length; j++) {
                  const u2 = layerGrid[i][j];
                  const u1Neighbors = adjList[u1];
                  const u2Neighbors = adjList[u2];

                  u1Neighbors.forEach(v1 => {
                      u2Neighbors.forEach(v2 => {
                          if(layerGrid[nextLayer].indexOf(v1) > layerGrid[nextLayer].indexOf(v2)) totalCrossings++;
                      })
                  })
                }
            }
        }
        return totalCrossings;
    }

    #addDummyVertexes(adjList, layerMap, component) {
        console.log("adjList before: ", adjList);
        adjList.forEach((neighbours, index) => {
            if(!component.nodes.includes(index)) return;
            neighbours.forEach(neighbour => {
                if(layerMap.get(neighbour) > layerMap.get(index) + 1) {
                    const dif = layerMap.get(neighbour) - layerMap.get(index);
                    let curNode = index;
                    for(let i = 1; i < dif; i++) {
                        const newDummyIndex = this.dummyVertexIndex + this.dummyVertexCount++;
                        const newDummyLayer = layerMap.get(index) + i;
                        adjList[curNode].push(newDummyIndex);
                        adjList.push([]);
                        curNode = newDummyIndex;
                        layerMap.set(newDummyIndex, newDummyLayer);
                    }
                    adjList[curNode].push(neighbour);
                    const indexToRemove = parseInt(adjList[index].indexOf(neighbour), 10);
                    adjList[index].splice(indexToRemove, 1);
                }
            });
        });
        console.log("adjList after: ", adjList);
        return layerMap;
    }

    #isDummyVertex(vertex, firstDummyIndex) {
        return vertex >= firstDummyIndex;
    }

   #assignCoordinates(connectedComponent) {


    }


   getLayeredDiGraphLayout(width) {
        const connectedComponents = this.#extractConnectedComponents();
        const grids = [];
        connectedComponents.forEach(connectedComponent => {
            const layerMap = this.#setVertexesYPosCoffmanGrahamAlgorithm(connectedComponent, width);
            this.#addDummyVertexes(this.adjList, layerMap, connectedComponent);
            const grid = this.#baryCenterHeuristic(connectedComponent, width, layerMap, this.adjList);
            grids.push(grid);
            return;
            this.#assignCoordinates(connectedComponent);
        });
        return grids;
    }

   #extractConnectedComponents() {
        const connectedComponents = [];
        const visited = new Array(this.vertexes.length).fill(false);
        function dfs(ver, component, adjList) {
            const stack = [ver];
            while(stack.length > 0) {
              const cur = stack.pop();
              if (!visited[cur]) {
                visited[cur] = true;
                component.size++;
                component.nodes.push(cur);
                adjList[cur].forEach(neighbour => {
                  if (!visited[neighbour]) {
                    stack.push(neighbour);
                  }
                });
                adjList.forEach((neighbourList, index) => {
                    if(neighbourList.includes(cur) && !visited[index]) stack.push(index);
                });

              }
            }
        }
        for(let i = 0; i < this.adjList.length; i++) {
            if(!visited[i]) {
              const component = {
                id: connectedComponents.length,
                size: 0,
                nodes: [],
                dummyNodes: [],
                maxWidth: -1,
                depth: -1
              }
              dfs(i, component, this.adjList);
              connectedComponents.push(component);
            }
        }

        return connectedComponents;
    }

    #functionMer

   #mapComponentsToObjects(components) {


    }


   getSize() { return this.size;}

   getObjectType() { return typeof this.objectType; }

   getVertex() { return this.vertexes[this.vertexes.length - 1]; }

   getNeighbours(vertex) { return this.vertexes.findIndex(ver => ver === vertex);}
}
