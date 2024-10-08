markdown

# Digraphs Layered Layout

A JavaScript library for creating layered layouts of directed graphs (digraphs). This library helps to organize nodes in a visually appealing manner by extracting weakly connected components from a graph, for each of them running Coffman-Graham algorithm, then adding dummy nods, and running barycentric algorithm for x positioning, after this task grid of grids of nodes is normalized and united in a single grid where -2 represents offset of component, -1 offset of node, n >= nodes size is a dummy vector and a nodes size <= value >= 0 is a vertex

## Features

- Centered node placement within each layer.
- Maximizes distance between nodes in each layer for better visualization.
- Simple and easy-to-use API.

## Installation

### Via npm

To install the package via npm, use the following command:

```bash
npm install digraphs-layered-layout
```
Via GitHub

Alternatively, you can add it directly from the GitHub repository:

```bash

npm install git+https://github.com/Nikolozi-Potskhishvili/digraphs-layered-layout.git
```
## Usage

Here's how you can use the digraphs-layered-layout library in your project:

```javascript

import { DiGraph } from 'digraphs-layered-layout';
//create new Digraph object:
const graph = new DiGraph(1);
// Example input: nodes and their connections:
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

graph.addEdge(0, 1);
graph.addEdge(0, 2);
graph.addEdge(1, 3);
graph.addEdge(2, 4);
graph.addEdge(0, 4);
graph.addEdge(9, 1);
graph.addEdge(9, 3);
graph.addEdge(9, 4);


// choose desired maximal width of a component and call method below
const width = 3;
const finalGrid = graph.getLayeredDiGraphLayout();
```

## API
DiGraph(type)

creates DiGraph object of a desired type

    Parameters: type of an object you will add to the graph.
    Returns: void.

getLayeredDiGraphLayout(width)

returns matrix of a weakly connected components

    Parameters: width, desired maximal width of every component.
    Returns: An array of arrays with values -2 representing component offset, -1 node offset, graph.getSize()>=value>=0 representing nodes and other values - dummy nodes.


## Example

Given the following input:

```javascript
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
graph.addEdge(0, 4);
graph.addEdge(9, 1);
graph.addEdge(9, 3);
graph.addEdge(9, 4);

const finalGrid = graph.getLayeredDiGraphLayout(width);
finalGrid.forEach((row, index) => console.log(index + " row", row));
```

The library will output:
```
0 row [
  -2, 5, -2,  7, -2, -1,
  -1, 9,  0, -1, -2,  8,
  -2, 6, -2
]
1 row [
  -2, -1, -2, -1, -2, 12,
   1,  2, 10, -1, -2, -1,
  -2, -1, -2
]
2 row [
  -2, -1, -2, -1, -2, -1,
  -1,  3,  4, -1, -2, -1,
  -2, -1, -2
]
```
## Development
### Running Tests

To run the test suite, use the following command:

```bash

npm test
```

### Contributing

Contributions are welcome(especially more tests)! Please feel free to submit a pull request or open an issue.
License

This project is licensed under the MIT License - see the LICENSE file for details.
