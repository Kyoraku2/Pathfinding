import { sleep, random } from "./function.utils.js";

class MazeAlgorithm {
  constructor(name = "Maze Algorithm", board) {
    this.name = name;
    this.board = board;
    this.adjacencyMatrix = board.toAdjacencyMatrix();
    this.adjacencyList = board.toAdjacencyList();
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

class Sidewinder extends MazeAlgorithm {
  constructor(board) {
    super("Sidewinder", board);
    this.height = board.graph.length;
    this.width = board.graph[0].length;
    this.initiationSpeed = 1;
  }

  initializeBoard() {
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        this.board.markCellAsWall(i, j);
      }
    }
  }

  async run(speed) {
    this.speed = speed;
    this.initializeBoard();
    await this.generateMaze();
  }

  async generateMaze() {
    for (let y = 0; y < this.height; y += 2) {
      let run = [];
      for (let x = 0; x < this.width; x += 2) {
        run.push([y, x]);
        if (x + 2 < this.width && (Math.random() < 0.5 || y === 0)) {
          run = await this.carveEast(run);
        } else if (y > 0) {
          run = await this.carveNorth(run);
        }
      }
    }
  }

  async carveEast(run) {
    const [i, j] = run[run.length - 1];
    this.board.markCellAsEmpty(i, j);
    this.board.markCellAsEmpty(i, j + 1);
    this.board.markCellAsEmpty(i, j + 2);
    await sleep(this.speed);
    run.push([i, j + 2]);

    return run;
  }

  async carveNorth(run) {
    const [i, j] = run[Math.floor(Math.random() * run.length)];
    this.board.markCellAsEmpty(i, j);
    this.board.markCellAsEmpty(i - 1, j);
    this.board.markCellAsEmpty(i - 2, j);
    await sleep(this.speed);
    return [];
  }
}

class MazeAlgorithmFactory {
  static create(name, board) {
    switch (name) {
      case "Sidewinder":
        return new Sidewinder(board);
      case "Recursive Division":
        return new RecursiveDivision(board);
      default:
        throw new Error("Invalid Maze Algorithm");
    }
  }
}

export { MazeAlgorithmFactory };
