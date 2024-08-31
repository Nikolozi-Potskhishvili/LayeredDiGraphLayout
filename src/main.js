
export class DiGraph{
    constructor(type) {
        this.adjList = [];
        this.vertexes = [];
        this.componentOffset = 2;
        this.vertexOffset = 1;
        this.size = 0;
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
        console.log(sortedGraph);

        const vertexLayerMap = new Map();
        /*connectedComponent.nodes.forEach(node => {
          vertexLayerMap.set(node, -1);
        });*/
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
          console.log("predesesors: ", predecessors);
          console.log("map", vertexLayerMap);

          /*const layers = predecessors.map(predecessor => {
            const layer = vertexLayerMap[predecessor];
            if (layer === undefined) {
              console.warn(`Predecessor ${predecessor} has no layer assigned yet.`);
              return -1;
            }
            return layer;
          }).filter(layer => layer !== undefined);*/
          const layers = [];
          for(let i = 0; i < predecessors.length; i++) {
              if(vertexLayerMap.get(predecessors[i]) !== undefined) {
                  layers.push(vertexLayerMap.get(predecessors[i]));
              }
          }
          console.log("layers: ", layers);

          const highestLayer = layers.length > 0 ? Math.max(...layers) : 0;
          console.log("highestLayer: ", highestLayer);

          const elementsOnHighestLayer = Array.from(vertexLayerMap.values()).filter(layer => layer === highestLayer).length;
          console.log("elements on heigest: ", elementsOnHighestLayer);

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

   #setVertexesXPos(connectedComponent, layerMap, width) {
        const grid = new Array(layerMap.size).fill(new Array(width));
        layerMap.forEach(v => {
            const layer = layerMap.get(v);
            grid[layer].push(v);
        });

        return grid;
    }

    #constructEdgeGrid(connectedComponent, layerMap,width) {
        const map = new Map();

        return ;
    }

    #addDummyVertexes(connectedComponent, layerMap, width) {

    }

   #assignCoordinates(connectedComponent) {


    }

   getLayeredDiGraphLayout(width) {
        const connectedComponents = this.#extractConnectedComponents();
        const maps = [];
        connectedComponents.forEach(connectedComponent => {
            const layerMap = this.#setVertexesYPosCoffmanGrahamAlgorithm(connectedComponent, width);
            maps.push(layerMap);
            return;
            const grid = this.#setVertexesXPos(connectedComponent, width);
            this.#assignCoordinates(connectedComponent);
        });
        return maps;
    }

   #extractConnectedComponents() {
        const connectedComponents = [];
        const visited = new Array(this.vertexes.length).fill(false);
        function dfs(ver, component, adjList) {
            const stack = [ver];
            while (stack.length > 0) {
                const cur = stack.pop();
                if(!visited[cur]) {
                    visited[cur] = true;
                    component.size++;
                    component.nodes.push(cur);
                    if(adjList[cur].length !== 0) {
                      adjList[cur].forEach(neighbour => {
                        if(!visited[neighbour]) {
                          stack.push(neighbour);
                        }
                      });
                    }
                }
            }
        }
        for(let i = 0; i < this.adjList.length; i++) {
            if(!visited[i]) {
              const component = {
                id: connectedComponents.length,
                size: 0,
                nodes: [],
                maxWidth: -1,
                depth: -1
              }
              dfs(i, component, this.adjList);
              connectedComponents.push(component);
            }
        }

        return connectedComponents;
    }

   #mapComponentsToObjects(components) {


    }


   getSize() { return this.size;}

   getObjectType() { return typeof this.objectType; }

   getVertex() { return this.vertexes[this.vertexes.length - 1]; }

   getNeighbours(vertex) { return this.vertexes.findIndex(ver => ver === vertex);}
}
