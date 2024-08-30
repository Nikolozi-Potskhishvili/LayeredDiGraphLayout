import {c} from "vite/dist/node/types.d-aGj9QkWt.js";

const adjList = [];
const vertexes = [];
const componentOffset = 2;
const vertexOffset = 1;
let size;
let objectType;

export function DiGraph(type) {
    objectType = type;
    size = vertexes.length;
}

export function addEdge(from, to) {
    if(!adjList[from].neighbours) {
        adjList[from].neighbours = [];
    }
    adjList[vertexes.indexOf(from)].push(vertexes.indexOf(to));
}

export function addNode(vertex) {
    if(objectType.type !== vertex.type) {
        return "Incorrect type";
    }
    if(vertexes.indexOf(vertex) !== -1) {
        return "Vertex already exists";
    }
    vertexes.push(vertex);
    size = vertex.length;
}

function calculateLongestPath(vertex) {
    let count = 0;
    const marked = new Array(adjList.length).fill(false);
    function dfs(vertex, curCount) {
        if(adjList[vertex].neighbours.length === 0 || marked[vertex]) {
            count = Math.max(count, curCount);
            return;
        }
        marked[vertex] = true;
        adjList[vertex].neighbours.forEach(neighbour => {
            curCount++;
            dfs(neighbour, curCount);
        })
    }
    adjList[vertex].neighbours.forEach(neighbour => {
        if(!marked[neighbour]) {
            dfs(vertex, count);
        }
    })
    return count;
}

function setVertexesYPosCoffmanGrahamAlgorithm(connectedComponent, width) {
    let sortedGraph = reverseTopologicalSort(connectedComponent);
    const lables = [];
    sortedGraph.forEach(vertex => {
        const longestPath = calculateLongestPath(vertex);
        const curLabel = {
            v: vertex,
            longestPath: longestPath,
            index: sortedGraph.indexOf(vertex)
        }
        lables.push(curLabel);
    });
    lables.sort((a, b) => {
        if (a.longestPath !== b.longestPath) {
            return b.longestPath - a.longestPath;
        } else {
            return a.index - b.index;
        }
    });

    const graph = [];
    let curLayer = 0;
    let vertexesOnCurLayer = 0;

    const vertexLayerMap = new Map();
    while(lables.length > 0) {
        const cur = lables.pop();
        const parents = connectedComponent.filter(node => {
            return adjList[node].neighbours.indexOf(cur.v);
        });
        parents.forEach(parent => {
            if(parent.layer === curLayer) {
                curLayer++;
            }
        });

        let highestParentLayer = -1;
        parents.forEach(parent => {
            if (vertexLayerMap.has(parent)) {
                highestParentLayer = Math.max(highestParentLayer, vertexLayerMap.get(parent));
            }
        });

        if (highestParentLayer >= curLayer) {
            curLayer = highestParentLayer + 1;
        }

        graph.push({
            v: cur.v,
            layer: curLayer,
            children: adjList[cur.v].neighbours || []
        });

        vertexLayerMap.set(cur.v, curLayer);

        vertexesOnCurLayer++;
        if(vertexesOnCurLayer >= width) {
            vertexesOnCurLayer = 0;
            curLayer++;
        }
    }
    return graph;
}

function reverseTopologicalSort(connectedComponent) {
    const visited = new Array(connectedComponent.size).fill(false);
    const stack = [];
    function dfs(vertex) {
        visited[vertex] = true;
        adjList[vertex].neighbours.forEach(neighbour => {
            if(!visited[neighbour]) {
                dfs(neighbour);
            }
        });
        stack.push(vertex);
    }
    connectedComponent.nodes.forEach(node => {
        if(!visited[node]) {
            dfs(node);
        }
    })

    return stack;
}

function setVertexesXPos(connectedComponent) {
    
}

function assignCoordinates(connectedComponent) {
    
}

export function getLayeredDiGraphLayout(width) {
    const connectedComponents = extractConnectedComponents();
    connectedComponents.forEach(connectedComponent => {
        const graphWithLayers = setVertexesYPosCoffmanGrahamAlgorithm(connectedComponent, width);
        const graphWithXYPositions = setVertexesXPos(connectedComponent);
        assignCoordinates(connectedComponent);
    });
}

function extractConnectedComponents() {
    const connectedComponents = [];
    const visited = new Array[vertexes.length].fill(false);
    function dfs(ver, component) {
        const stack = [ver];
        while (stack.length > 0) {
            const cur = stack.pop();
            if(!visited[cur]) {
                visited[cur] = true;
                component.size++;
                component.nodes.push(cur);
                adjList[cur].neighbours.forEach(neighbour => {
                if(!visited[neighbour]) {
                    stack.push(neighbour);
                }
                })
            }
        }
    }
    adjList.forEach((index) => {
        if(visited[index]) {
            const component = {
                id: connectedComponents.length,
                size: 0,
                nodes: [],
                maxWidth: -1,
                depth: -1
        }
        dfs(index, component);
        connectedComponents.push(component);
      }
    });
    return connectedComponents;
}

function mapComponentsToObjects(components) {


}


export function getSize() { return size;}

export function getObjectType() { return typeof objectType; }

export function getVertex() { return vertexes[vertexes.length - 1]; }

export function getNeighbours(vertex) { return vertexes.findIndex(ver => ver === vertex);}
