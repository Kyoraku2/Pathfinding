export const CELLS_TYPES = {
  EMPTY: 0,
  WALL: 1,
  START: 2,
  END: 3,
  CHECKPOINT: 4,
  VISITED: 5,
  PATH: 6,
};

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
    /** @type {number[][]} */
    this.graph = [];
    /** @type {{x: number, y: number}} */
    this.startPoint = { x: 0, y: 0 };
    /** @type {{x: number, y: number}[]} */
    this.endPointList = [];
    /** @type {{x: number, y: number}[]} */
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
        this.graph[row][column] = CELLS_TYPES.EMPTY;
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
      this.startPoint.x == x &&
      this.startPoint.y == y &&
      this.graph[x][y] == CELLS_TYPES.START
    ) {
      return;
    }
    if (this.startPoint.x != undefined && this.startPoint.y != undefined) {
      this.clearCell(this.startPoint.x, this.startPoint.y);
    }
    this.graph[x][y] = CELLS_TYPES.START;
    this.startPoint.x = x;
    this.startPoint.y = y;
    const cell = document.getElementById(x + ";" + y);
    if (!cell.classList.contains("start")) {
      cell.classList.add("start");
    }
  }

  /**
   * @param {number} x
   * @param {number} y
   * @returns {void}
   * @description Mark the cell as end point
   */
  markCellAsEnd(x, y) {
    if (this.endPointList.some((end) => end.x == x && end.y == y)) {
      return;
    }
    if (this.graph[x][y] == CELLS_TYPES.END) {
      return;
    }
    this.graph[x][y] = CELLS_TYPES.END;
    this.endPointList.push({ x: x, y: y });
    const cell = document.getElementById(x + ";" + y);
    if (!cell.classList.contains("end")) {
      cell.classList.add("end");
    }
  }

  /**
   * @param {number} x
   * @param {number} y
   * @description Mark the cell as empty
   * @returns {void}
   */
  markCellAsEmpty(x, y) {
    this.graph[x][y] = CELLS_TYPES.EMPTY;
    const cell = document.getElementById(x + ";" + y);
    cell.classList = [];
    cell.textContent = "";
    cell.style.opacity = "1";
  }

  /**
   * @param {number} x
   * @param {number} y
   * @description Mark the cell as wall
   * @returns {void}
   */
  markCellAsWall(x, y) {
    if (this.graph[x][y] == CELLS_TYPES.WALL) {
      return;
    }
    this.graph[x][y] = CELLS_TYPES.WALL;
    const cell = document.getElementById(x + ";" + y);
    if (!cell.classList.contains("wall")) {
      cell.classList.add("wall");
    }
  }

  /**
   * @param {number} x
   * @param {number} y
   * @description Mark the cell as visited
   * @returns {void}
   */
  markCellAsVisited(x, y) {
    const cell = document.getElementById(x + ";" + y);
    this.graph[x][y] = CELLS_TYPES.VISITED;
    if (!cell.classList.contains("visited")) {
      cell.classList.add("visited");
      cell.style.opacity = "0.4";
    } else {
      let opacity = parseFloat(cell.style.opacity);
      opacity += 0.2;
      cell.style.opacity = opacity;
    }
  }

  /**
   * @param {number} x
   * @param {number} y
   * @description Mark the cell as a checkpoint
   * @returns {void}
   */
  markCellAsCheckpoint(x, y) {
    if (
      this.checkpointList.some(
        (checkpoint) => checkpoint.x == x && checkpoint.y == y
      )
    ) {
      return;
    }
    if (this.graph[x][y] == CELLS_TYPES.CHECKPOINT) {
      return;
    }
    this.graph[x][y] = CELLS_TYPES.CHECKPOINT;
    this.checkpointList.push({ x: x, y: y });
    const cell = document.getElementById(x + ";" + y);
    cell.textContent = this.checkpointList.length;
    if (!cell.classList.contains("checkpoint")) {
      cell.classList.add("checkpoint");
    }
  }

  markCellAsPath(x, y) {
    this.graph[x][y] = CELLS_TYPES.PATH;
    const cell = document.getElementById(x + ";" + y);
    if (!cell.classList.contains("path")) {
      cell.classList.add("path");
      cell.style.opacity = "0.4";
    } else {
      let opacity = parseFloat(cell.style.opacity);
      opacity += 0.2;
      cell.style.opacity = opacity;
    }
  }

  /**
   * @param {number} x
   * @param {number} y
   * @description Clear the cell (remove the content and the class)
   * @returns {void}
   */
  clearCell(x, y) {
    const cell = document.getElementById(x + ";" + y);
    if (this.graph[x][y] == CELLS_TYPES.START) {
      this.startPoint = {};
    }
    if (this.graph[x][y] == CELLS_TYPES.END) {
      this.endPointList = this.endPointList.filter(
        (end) => end.x != x && end.y != y
      );
    }
    if (this.graph[x][y] == CELLS_TYPES.CHECKPOINT) {
      this.checkpointList = this.checkpointList.filter(
        (checkpoint) => checkpoint.x != x && checkpoint.y != y
      );
      this.checkpointList.forEach((checkpoint, index) => {
        document.getElementById(checkpoint.x + ";" + checkpoint.y).textContent =
          index + 1;
      });
    }
    this.graph[x][y] = CELLS_TYPES.EMPTY;
    cell.classList = [];
    cell.textContent = "";
    cell.dataset.cell = "";
    cell.style.opacity = "1";
  }

  /**
   * @description Clear the grid
   * @returns {void}
   */
  clear() {
    this.graph.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        this.clearCell(rowIndex, columnIndex);
      });
    });
    this.startPoint = {};
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
        if (cell == CELLS_TYPES.PATH) {
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
        if (cell == CELLS_TYPES.VISITED) {
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
        adjacencyMatrix[row][column] =
          this.graph[row][column] == CELLS_TYPES.WALL ? 0 : 1;
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
        if (this.graph[row][column] == CELLS_TYPES.WALL) {
          continue;
        }

        let key = row + ";" + column;
        adjacencyList[key] = [];
        if (row > 0 && this.graph[row - 1][column] != CELLS_TYPES.WALL) {
          adjacencyList[key].push(row - 1 + ";" + column);
        }
        if (column > 0 && this.graph[row][column - 1] != CELLS_TYPES.WALL) {
          adjacencyList[key].push(row + ";" + (column - 1));
        }
        if (
          row < this.rows - 1 &&
          this.graph[row + 1][column] != CELLS_TYPES.WALL
        ) {
          adjacencyList[key].push(row + 1 + ";" + column);
        }
        if (
          column < this.columns - 1 &&
          this.graph[row][column + 1] != CELLS_TYPES.WALL
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
   * @returns {number}
   * @description Get the cell type
   */
  getCellType(x, y) {
    return this.graph[x][y];
  }

  /**
   * @description Check if the start point is defined
   * @returns {boolean}
   */
  startPointIsDefined() {
    return this.startPoint.x != undefined && this.startPoint.y != undefined;
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
