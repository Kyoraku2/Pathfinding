import { Cell, CheckpointCell, EmptyCell, EndCell, StartCell } from "./cell.js";

export class Board {
  /**
   * @param {number} rows
   * @param {number} columns
   */
  constructor(rows, columns) {
    /** @type {HTMLElement} */
    this.webElement = null;
    /** @type {number} */
    this.columns = columns;
    /** @type {number} */
    this.rows = rows;
    /** @type {Cell[][]} */
    this.graph = [];
    /** @type {StartCell | undefined} */
    this.startPoint = undefined;
    /** @type {EndCell[]} */
    this.endPointList = [];
    /** @type {CheckpointCell[]} */
    this.checkpointList = [];

    this.createGride();
  }

  /**
   * @description Create the grid (both html and graph)
   */
  createGride() {
    const table = document.createElement("table");
    for (let row = 0; row < this.rows; ++row) {
      const rowElement = document.createElement("tr");
      rowElement.id = "row-" + row;
      this.graph[row] = [];
      for (let column = 0; column < this.columns; ++column) {
        const cell = document.createElement("td");
        cell.id = row + ";" + column;
        cell.dataset.cell = "";
        cell.style.opacity = "1";
        this.graph[row][column] = new EmptyCell(row, column, cell);
        rowElement.appendChild(cell);
      }
      table.appendChild(rowElement);
    }
    this.webElement = table;
    document.getElementsByClassName("board")[0].appendChild(table);
  }

  /**
   * @param {number} x
   * @param {number} y
   * @description Mark the cell as start point
   */
  markCellAsStart(x, y) {
    if (
      this.startPoint?.x === x &&
      this.startPoint?.y === y &&
      this.graph[x][y].isStart()
    ) {
      return;
    }
    if (this.startPointIsDefined()) {
      this.graph[this.startPoint.x][this.startPoint.y] =
        this.graph[this.startPoint.x][this.startPoint.y].toEmpty();
    }
    this.graph[x][y] = this.graph[x][y].toStart();
    this.startPoint = this.graph[x][y];
  }

  /**
   * @param {number} x
   * @param {number} y
   * @returns {void}
   * @description Mark the cell as end point
   */
  markCellAsEnd(x, y) {
    if (this.graph[x][y].isEnd()) {
      return;
    }
    this.graph[x][y] = this.graph[x][y].toEnd();
    this.endPointList.push(this.graph[x][y]);
  }

  /**
   * @param {number} x
   * @param {number} y
   * @description Mark the cell as empty
   * @returns {void}
   */
  markCellAsEmpty(x, y) {
    this.graph[x][y] = this.graph[x][y].toEmpty();
  }

  /**
   * @param {number} x
   * @param {number} y
   * @description Mark the cell as wall
   * @returns {void}
   */
  markCellAsWall(x, y) {
    if (this.graph[x][y].isWall()) {
      return;
    }
    this.graph[x][y] = this.graph[x][y].toWall();
  }

  /**
   * @param {number} x
   * @param {number} y
   * @description Mark the cell as visited
   * @returns {void}
   */
  markCellAsVisited(x, y) {
    if (this.graph[x][y].isVisited()) {
      this.graph[x][y].visit(); // TODO : check this
    } else {
      this.graph[x][y] = this.graph[x][y].toVisited();
    }
  }

  /**
   * @param {number} x
   * @param {number} y
   * @description Mark the cell as a checkpoint
   * @returns {void}
   */
  markCellAsCheckpoint(x, y) {
    if (this.graph[x][y].isCheckpoint()) {
      return;
    }
    this.graph[x][y] = this.graph[x][y].toCheckpoint(
      this.checkpointList.length + 1
    );
    this.checkpointList.push(this.graph[x][y]);
  }

  markCellAsPath(x, y) {
    if (this.graph[x][y].isPath()) {
      this.graph[x][y].visit(); // TODO : check this
    } else {
      this.graph[x][y] = this.graph[x][y].toPath();
    }
  }

  /**
   * @param {number} x
   * @param {number} y
   * @description Clear the cell (remove the content and the class)
   * @returns {void}
   */
  clearCell(x, y) {
    if (this.graph[x][y].isStart()) {
      this.startPoint = undefined;
    }
    if (this.graph[x][y].isEnd()) {
      this.endPointList = this.endPointList.filter(
        (end) => end.x !== Number(x) && end.y !== Number(y)
      );
    }
    if (this.graph[x][y].isCheckpoint()) {
      this.checkpointList = this.checkpointList
        .filter(
          (checkpoint) =>
            checkpoint.x !== Number(x) || checkpoint.y !== Number(y)
        )
        .sort((a, b) => a.id - b.id);
      this.checkpointList.forEach((checkpoint, index) => {
        checkpoint.setId(index + 1);
      });
    }
    this.graph[x][y] = this.graph[x][y].toEmpty();
  }

  /**
   * @description Clear the grid
   * @returns {void}
   */
  clear() {
    this.graph.forEach((row, rowIndex) => {
      row.forEach((_, columnIndex) => {
        this.clearCell(rowIndex, columnIndex);
      });
    });
    this.startPoint = undefined;
    this.endPointList = [];
    this.checkpointList = [];
  }

  /**
   * @description Clear the path
   * @returns {void}
   */
  clearPath() {
    this.graph.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        if (cell.isPath()) {
          this.clearCell(rowIndex, columnIndex);
        }
      });
    });
  }

  /**
   * @description Clear the visited cells
   * @returns {void}
   */
  clearVisited() {
    this.graph.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        if (cell.isVisited()) {
          this.clearCell(rowIndex, columnIndex);
        }
      });
    });
  }

  /**
   * @description Convert the graph to an adjacency matrix
   * @returns {void}
   */
  toAdjacencyMatrix() {
    let adjacencyMatrix = [];
    for (let row = 0; row < this.rows; ++row) {
      adjacencyMatrix[row] = [];
      for (let column = 0; column < this.columns; ++column) {
        adjacencyMatrix[row][column] = this.graph[row][column].isWall() ? 0 : 1;
      }
    }
    return adjacencyMatrix;
  }

  /**
   * @description Convert the graph to an adjacency list
   */
  toAdjacencyList() {
    let adjacencyList = {};
    for (let row = 0; row < this.rows; ++row) {
      for (let column = 0; column < this.columns; ++column) {
        if (this.graph[row][column].isWall()) {
          continue;
        }

        let key = row + ";" + column;
        adjacencyList[key] = [];
        if (row > 0 && !this.graph[row - 1][column].isWall()) {
          adjacencyList[key].push(row - 1 + ";" + column);
        }
        if (column > 0 && !this.graph[row][column - 1].isWall()) {
          adjacencyList[key].push(row + ";" + (column - 1));
        }
        if (row < this.rows - 1 && !this.graph[row + 1][column].isWall()) {
          adjacencyList[key].push(row + 1 + ";" + column);
        }
        if (
          column < this.columns - 1 &&
          !this.graph[row][column + 1].isWall()
        ) {
          adjacencyList[key].push(row + ";" + (column + 1));
        }
      }
    }

    return adjacencyList;
  }

  /**
   * @param {number} x
   * @param {number} y
   * @returns {Cell}
   * @description Get the cell
   */
  getCell(x, y) {
    return this.graph[x][y];
  }

  /**
   * @description Check if the start point is defined
   * @returns {boolean}
   */
  startPointIsDefined() {
    return this.startPoint !== undefined;
  }

  /**
   * Check if at least one end point is defined
   * @returns {boolean}
   */
  endPointIsDefined() {
    return this.endPointList.length > 0;
  }

  /**
   * Check if at least one checkpoint is defined
   * @returns {boolean}
   */
  checkpointIsDefined() {
    return this.checkpointList.length > 0;
  }

  /**
   * @description Get all the edges of the graph
   * Should return {from:string, to:string}[]
   */
  getEdgeList() {
    const edgeList = [];
    const adjacencyList = this.toAdjacencyList();
    Object.keys(adjacencyList).forEach((key) => {
      adjacencyList[key].forEach((neighbor) => {
        edgeList.push({ from: key, to: neighbor });
      });
    });
    return edgeList;
  }
}
