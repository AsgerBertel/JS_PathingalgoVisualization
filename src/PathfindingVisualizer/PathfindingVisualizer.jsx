import React, {Component} from 'react';
import Node from './Node/Node';

import './PathfindingVisualizer.css';
import './Node/Node.css'
import {dijkstra, getNodesInShortestPathOrder} from './Algorithms/Dijkstra';
import {a_Star} from './Algorithms/A_STAR';

const START_NODE_ROW = 5;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 15;
const FINISH_NODE_COL = 45;
let wallNodes = [];
const GRID_ROW_SIZE = 20;
const GRID_COL_SIZE = 50;
let actionFlag = false;
export default class PathfindingVisualizer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            grid: [],
            mouseIsPressed: false,
            initialState: getInitialGrid()
        };
    }

    componentDidMount() {
        const grid = getInitialGrid();
        this.setState({grid});
    }
    visualizeDijkstra() {
        this.resetAllNodesCSS(false);
        actionFlag = true;
        const {grid} = this.state;
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
        this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
        actionFlag = false;
    }

    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            if(actionFlag = true){
                if (i === visitedNodesInOrder.length) {
                    setTimeout(() => {
                        this.animateShortestPath(nodesInShortestPathOrder);
                    }, 5* i);
                    return;
                }
                const node = visitedNodesInOrder[i];
                if(node.isStart  || node.isFinish || node.isWall){
                    continue;
                }
                setTimeout(() => {
                    document.getElementById(`node-${node.row}-${node.col}`).className =
                        'node node-visited';
                },  5*i);

            } else{return;}
        }

    }
    handleMouseDown(row, col){
        const wallNode = this.state.grid[row][col];
        if(wallNode.isWall){
            const newGrid = getNewGridWithoutWallToggled(this.state.grid, row, col);
            const node = newGrid[row][col];
            document.getElementById(`node-${node.row}-${node.col}`).className =
                'node';
            this.setState({grid: newGrid, mouseIsPressed: true});
        }
        if(!wallNode.isWall){
            const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
            const node = newGrid[row][col];
            document.getElementById(`node-${node.row}-${node.col}`).className =
                'node node-wall';
            this.setState({grid: newGrid, mouseIsPressed: true});
        }
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({grid: newGrid, mouseIsPressed: true});
    }

    handleMouseEnter(row, col){
        if(!this.state.mouseIsPressed) return;
        const wallNode = this.state.grid[row][col];
        if(wallNode.isWall){
            const newGrid = getNewGridWithoutWallToggled(this.state.grid, row, col);
            const node = newGrid[row][col];
            document.getElementById(`node-${node.row}-${node.col}`).className =
                'node';
            this.setState({grid: newGrid});
        }else if(!wallNode.isWall){
            const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
            const node = newGrid[row][col];
            document.getElementById(`node-${node.row}-${node.col}`).className =
                'node node-wall';
            this.setState({grid: newGrid});
        }
    }

    handleMouseUp(row, col){
        this.state.mouseIsPressed = false;
    }



    animateShortestPath(nodesInShortestPathOrder){
        for(let i = 0; i < nodesInShortestPathOrder.length; i++){
            const node = nodesInShortestPathOrder[i];
            if(node.isStart || node.isFinish){
                continue;
            }
            setTimeout(() => {
                document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-shortest-path';
            }, 50*i)
        }
    }

    animateShortestPathA_Star(finishNode){
        const path = [];
        console.log(finishNode);
        debugger;
        while(finishNode.parent !== undefined){
            path.push(finishNode.parent);
            finishNode = finishNode.parent;
        }
        console.log(path);
        for(let i = path.length; i >= 0; i--){
            const node = path[i];
            if(node.isStart || node.isFinish){
                continue;
            }
            setTimeout(() => {
                document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-shortest-path';
            }, 50*i)
        }
    }

    resetGrid(){
        this.resetAllNodesCSS(false);
        const grid = this.state.grid.slice();
        for(let i = 0; i < wallNodes; i++){
            grid[wallNodes[i].row][wallNodes[i].col] = wallNodes[i];
        }
        this.setState({grid: grid});
    }
    resetWallsAndGrid(){
        this.resetAllNodesCSS(true);
        this.state.grid.unshift(GRID_ROW_SIZE*GRID_COL_SIZE);
        let newGrid = getInitialGrid();
        this.setState({grid: newGrid});
        //TODO: Fix when button is pressed, algo ignores walls put
    }

    resetAllNodesCSS(waalBool){
        for (let row = 0; row < GRID_ROW_SIZE; row++) {
            for (let col = 0; col < GRID_COL_SIZE; col++) {
              this.resetCSS(row, col, waalBool);
            }
        }
    }

    resetCSS(row, col, wallBool){
        const node = this.state.grid[row][col];
        if(node.isStart){
            document.getElementById(`node-${node.row}-${node.col}`).className =
                'node node-start';
        }else if(node.isFinish){
            document.getElementById(`node-${node.row}-${node.col}`).className =
                'node node-finish';
        }else if(node.isWall && !wallBool){
            document.getElementById(`node-${node.row}-${node.col}`).className =
                'node node-wall';
        }else{
            document.getElementById(`node-${node.row}-${node.col}`).className =
                'node';
        }

    }
    visualizeA_Star(){
        this.resetAllNodesCSS(false);
        const {grid} = this.state;
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        const visitedNodesInOrder = a_Star(grid, startNode, finishNode);
        this.animateA_Star(visitedNodesInOrder, visitedNodesInOrder);
    }
    animateA_Star(visitedNodesInOrder, finishNode) {
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            const node = visitedNodesInOrder[i];
            if (i === visitedNodesInOrder.length) {
                setTimeout(() => {
                    this.animateShortestPath(finishNode);
                }, 5* i);
                return;
            }
            if(node.isStart  || node.isFinish || node.isWall){
                continue;
            }
            setTimeout(() => {
                document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-visited';
            },  10*i);

        }

    }


    render() {
        const {grid, mouseIsPressed} = this.state;

        return (
            <>
                <button onClick={() => this.visualizeDijkstra()}>
                    Visualize Dijkstra's Algorithm
                </button>
                <button onClick={() => this.resetGrid()}>
                        Reset grid
                </button>
                <button onClick={() => this.resetWallsAndGrid()}>
                    Reset walls
                </button>
                <button onClick={() => this.visualizeA_Star()}>
                    Visualize A* algorithm
                </button>

                <div className="grid">
                    {grid.map((row, rowIdx) => {
                        return (
                            <div key={rowIdx}>
                                {row.map((node, nodeIdx) => {
                                    const {row, col,isFinish, isStart, isVisited} = node;
                                    return (
                                        <Node
                                            key={nodeIdx}
                                            col={col}
                                            row={row}
                                            isFinish={isFinish}
                                            isStart={isStart}
                                            mouseIsPressed={mouseIsPressed}
                                            onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                                            onMouseEnter={(row, col) =>
                                                this.handleMouseEnter(row, col)
                                            }
                                            onMouseUp={() => this.handleMouseUp()}/>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
                </>
        );
    }
}
const getInitialGrid = () => {
    const grid = [];
    for (let row = 0; row < GRID_ROW_SIZE; row++) {
        const currentRow = [];
        for (let col = 0; col < GRID_COL_SIZE; col++) {
            currentRow.push(createNode(col, row));
        }
        grid.push(currentRow);
    }
    return grid;
};

const createNode = (col, row) => {
    return {
        row,
        col,
        isStart: row === START_NODE_ROW && col === START_NODE_COL,
        isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
        distance: Infinity,
        isVisited: false,
        isWall: false,
        previousNode: null,
    };
};
const getNewGridWithWallToggled = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
        ...node,
        isWall:true,
    };
    wallNodes.push(newNode);
    newGrid[row][col] = newNode;
    return newGrid;
};
const getNewGridWithoutWallToggled = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    wallNodes.pop(node);
    const newNode = {
        ...node,
        isWall:false,
    };
    newGrid[row][col] = newNode;
    return newGrid;
}
