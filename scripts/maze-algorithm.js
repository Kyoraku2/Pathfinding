import { sleep, random } from "./function.utils.js";

class MazeAlgorithm {
  constructor(name = "Maze Algorithm", board) {
    this.name = name;
    this.board = board;
    this.adjacencyMatrix = board.toAdjacencyMatrix();
    this.adjacencyList = board.toAdjacencyList();
  }
}

class MazeDFS extends MazeAlgorithm {
  constructor(board) {
    super("DFS", board);
  }

  async run() {
    // TODO
  }
}

class Prim extends MazeAlgorithm {
  constructor(board) {
    super("Prim", board);
  }

  async run(speed) {
    throw new Error("Method not implemented.");
  }
}

class Kruskal extends MazeAlgorithm {
  constructor(board) {
    super("Kruskal", board);
  }

  async run(speed) {
    throw new Error("Method not implemented.");
  }
}

class RecursiveDivision extends MazeAlgorithm {
  constructor(board) {
    super("Recursive Division", board);
    this.height = board.graph.length;
    this.width = board.graph[0].length;
    this.HORIZONTAL = 0;
    this.VERTICAL = 1;
  }

  async run(speed) {
    this.board.clear();
    this.speed = speed;
    await this.divide(0, 0, this.height, this.width);
  }

  chooseOrientation(width, height) {
    if (width < height) {
      return this.HORIZONTAL;
    } else if (width > height) {
      return this.VERTICAL;
    } else {
      return Math.random() < 0.5 ? this.HORIZONTAL : this.VERTICAL;
    }
  }

  async divide(y, x, height, width) {
    const orientation = this.chooseOrientation(width, height);
    if (orientation === this.HORIZONTAL) {
      await this.divideHorizontal(y, x, height, width);
    } else {
      await this.divideVertical(y, x, height, width);
    }
  }

  async divideHorizontal(y, x, height, width) {
    if (height < 5) return;

    const newWall = y + Math.floor(random(2, height - 3) / 2) * 2;
    const newHole = x + Math.floor(random(1, width - 2) / 2) * 2 + 1;

    for (let i = x; i < x + width; i++) {
      if (i !== newHole) {
        this.board.markCellAsWall(newWall, i);
        await sleep(this.speed);
      }
    }

    await this.divide(y, x, newWall - y + 1, width);
    await this.divide(newWall, x, y + height - newWall, width);
  }

  async divideVertical(y, x, height, width) {
    if (width < 5) return;

    const newWall = x + Math.floor(random(2, width - 3) / 2) * 2;
    const newHole = y + Math.floor(random(1, height - 2) / 2) * 2 + 1;

    for (let i = y; i < y + height; i++) {
      if (i !== newHole) {
        this.board.markCellAsWall(i, newWall);
        await sleep(this.speed);
      }
    }

    await this.divide(y, x, height, newWall - x + 1);
    await this.divide(y, newWall, height, x + width - newWall);
  }
}

class MazeAlgorithmFactory {
  static create(name, board) {
    switch (name) {
      case "DFS":
        return new MazeDFS(board);
      case "Prim":
        return new Prim(board);
      case "Kruskal":
        return new Kruskal(board);
      case "Recursive Division":
        return new RecursiveDivision(board);
      default:
        throw new Error("Invalid Maze Algorithm");
    }
  }
}

export { MazeAlgorithmFactory };
