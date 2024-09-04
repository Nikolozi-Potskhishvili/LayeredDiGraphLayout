import { DiGraph } from '../src/main.js';

function testYLayering() {
    let graph = new DiGraph('a');
    graph.addNode('a');
    graph.addNode('b');
    graph.addNode('c');
    graph.addNode('d');

    const width = 3;

    graph.addEdge('a', 'b');
    graph.addEdge('c', 'b');

    const finalGrid = graph.getLayeredDiGraphLayout(width);
    finalGrid.forEach((row, index) => console.log(index + " row", row));

}

testYLayering();