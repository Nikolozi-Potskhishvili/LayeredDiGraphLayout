import { DiGraph } from '../src/main.js';

function testYLayering() {
    let graph = new DiGraph(1);
    graph.addNode(0);
    graph.addNode(1);
    graph.addNode(2);
    graph.addNode(3);
    graph.addNode(4);
    graph.addNode(5);
    graph.addNode(6);
    graph.addNode(7);
    graph.addNode(8);
    graph.addNode(9);

    const width = 3;

    graph.addEdge(0, 1);
    graph.addEdge(0, 2);
    graph.addEdge(1, 3);
    graph.addEdge(2, 4);

    const layerMaps = graph.getLayeredDiGraphLayout(width);
    console.assert(layerMaps !== undefined && layerMaps !== null);
    console.log('Layer Maps:', layerMaps);

}

testYLayering();