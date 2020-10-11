import {getNeighbours, getNodesInShortestPathOrder} from './Dijkstra';

export function a_Star(grid, startNode, finishNode) {

    let openList = [];
    let closedList = [];
    const visitedNodesInOrder = [];
    startNode.f_value = 0;
    startNode.g_value = 0;

    openList.push(startNode);
    visitedNodesInOrder.push(startNode);
    startNode.isVisited = true;
    while(openList.length !== 0){
        sortNodesByF_Val(openList);
        let n = openList.shift();
        closedList.push(n);
        visitedNodesInOrder.push(n);
        if(n === finishNode){
            return visitedNodesInOrder;
        }
        if(n.isWall){
            continue;
        }
        const neighbours = getNeighbours(n, grid);
        for(const node of neighbours){
            if(node.isWall){
                continue;
            }
            visitedNodesInOrder.push(node);
            node.parent = n;
            node.h_value = manhattanDistance(node, finishNode);
            node.g_value = n.g_value+1;
            node.f_value = node.g_value + node.h_value;
            if(openList.includes(node)){
                const n = openList.slice().filter(n => n.f_value < node.f_value);
                if(n.length!== 0){
                    openList.pop(node);
                    continue;
                }
            }
            if(closedList.includes(node)){
                const n = closedList.slice().filter(n => n.f_value < node.f_value);
                if(n.length !== 0){
                    openList.pop(node);
                    continue;
                }
            }
            openList.push(node);
        }
    }
    return visitedNodesInOrder;

}

function findNode(node){
    return node();
}
function sortNodesByF_Val(listOfNodes){
    listOfNodes.sort((node_A, node_B) => node_A.f_value - node_B.f_value);
}

function linearDistance(node, finishNode){
    const rowDistance = Math.max(node.row, finishNode.row) - Math.min(node.row, finishNode.row);
    const colDistance = Math.max(node.col, finishNode.col) - Math.min(node.col, finishNode.col);
    return Math.max(rowDistance, colDistance);
}
function manhattanDistance(node1, node2){
    return Math.abs(node1.row - node2.row) + Math.abs(node1.col-node2.col);
}
function euclideanDistance(node1, node2){

}

