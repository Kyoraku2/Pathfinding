import { PriorityQueue } from "./pathfinding-algorithm.utils.js";
import { sleep } from "./function.utils.js";

class PathFindingAlgorithm {
  constructor(name = "Pathfinding Algorithm", board) {
    this.name = name;
    this.board = board;
    this.adjacencyMatrix = board.toAdjacencyMatrix();
    this.adjacencyList = board.toAdjacencyList();
    this.start = board.startPoint.x + ";" + board.startPoint.y;
    this.endPointList = board.endPointList.map((end) => end.x + ";" + end.y);
    this.checkpoints = board.checkpointList.map(
      (checkpoint) => checkpoint.x + ";" + checkpoint.y
    );
  }

  async run(speed) {
    if (this.checkpoints.length > 0) {
      return this.runWithCheckpoints(speed);
    } else {
      return this.runUtils(this.start, this.endPointList, speed);
    }
  }

  async runWithCheckpoints(speed) {
    let path = [];
    for (let i = 0; i < this.checkpoints.length; i++) {
      const start = i == 0 ? this.start : this.checkpoints[i - 1];
      const end = this.checkpoints[i];
      const subPath = await this.runUtils(start, [end], speed);
      if (subPath?.length > 0) {
        path = path.concat(subPath);
      } else {
        return [];
      }
    }
    const lastCheckpoint = this.checkpoints[this.checkpoints.length - 1];
    const subPath = await this.runUtils(
      lastCheckpoint,
      this.endPointList,
      speed
    );
    if (subPath?.length > 0) {
      path = path.concat(subPath);
    } else {
      return [];
    }
    return path;
  }

  async runUtils() {
    throw new Error(
      "Method not implemented. Shouldn't use instance of Agorithm. Use specific instance instead"
    );
  }
}

class BFS extends PathFindingAlgorithm {
  constructor(board) {
    super("BFS", board);
  }

  async runUtils(start, endPointList, speed) {
    const queue = [];
    const visited = {};

    visited[start] = true;
    queue.push(start);

    while (queue.length) {
      const current = queue.shift();

      if (endPointList.includes(current)) {
        let path = [current];
        let node = current;
        while (node !== start) {
          node = visited[node];
          path.push(node);
        }
        return path.reverse();
      }

      for (const neighbor of this.adjacencyList[current]) {
        if (!visited[neighbor]) {
          visited[neighbor] = current;
          queue.push(neighbor);
          const [x, y] = neighbor.split(";").map((n) => parseInt(n));
          if (
            this.board.getCell(x, y).isEmpty() ||
            this.board.getCell(x, y).isVisited()
          ) {
            await sleep(speed);
            this.board.markCellAsVisited(x, y);
          }
        }
      }
    }
    return [];
  }
}

class DFS extends PathFindingAlgorithm {
  constructor(board) {
    super("DFS", board);
  }

  async runUtils(start, endPointList, speed) {
    const visited = {};
    const dfsUtils = async (current, visited, speed) => {
      visited[current] = true;
      const [x, y] = current.split(";").map((n) => parseInt(n));
      if (
        this.board.getCell(x, y).isEmpty() ||
        this.board.getCell(x, y).isVisited()
      ) {
        await sleep(speed);
        this.board.markCellAsVisited(x, y);
      }
      if (endPointList.includes(current)) {
        return current;
      }

      for (const neighbor of this.adjacencyList[current]) {
        if (!visited[neighbor]) {
          const result = await dfsUtils(neighbor, visited, speed);
          if (result) {
            return [current].concat(result);
          }
        }
      }
    };
    return dfsUtils(start, visited, speed);
  }
}

class Dijkstra extends PathFindingAlgorithm {
  constructor(board) {
    super("Dijkstra", board);
  }

  async runUtils(start, ends, speed) {
    const nodes = new PriorityQueue();
    const distances = {};
    const previous = {};
    let path = [];
    let smallest;

    for (let vertex in this.adjacencyList) {
      if (vertex === start) {
        distances[vertex] = 0;
        nodes.enqueue(vertex, 0);
      } else {
        distances[vertex] = Infinity;
        nodes.enqueue(vertex, Infinity);
      }
      previous[vertex] = null;
    }

    while (nodes.values.length) {
      smallest = nodes.dequeue().val;

      if (ends.includes(smallest)) {
        while (previous[smallest]) {
          path.push(smallest);
          smallest = previous[smallest];
        }
        break;
      }
      if (smallest || distances[smallest] !== Infinity) {
        for (let neighbor in this.adjacencyList[smallest]) {
          let nextNode = this.adjacencyList[smallest][neighbor];
          const [x, y] = nextNode.split(";").map((n) => parseInt(n));
          let candidate = distances[smallest] + 1;
          if (candidate < distances[nextNode]) {
            distances[nextNode] = candidate;
            previous[nextNode] = smallest;
            nodes.enqueue(nextNode, candidate);
            if (
              this.board.getCell(x, y).isEmpty() ||
              this.board.getCell(x, y).isVisited()
            ) {
              await sleep(speed);
              this.board.markCellAsVisited(x, y);
            }
          }
        }
      }
    }

    if (!path.length) {
      return [];
    }

    return path.concat(smallest).reverse();
  }
}

class AStar extends PathFindingAlgorithm {
  constructor(board) {
    super("A*", board);
  }

  run() {
    throw new Error("Method not implemented.");
  }
}

class BellmanFord extends PathFindingAlgorithm {
  constructor(board) {
    super("Bellman-Ford", board);
  }

  async runUtils(start, endPointList) {
    const vectrices = Object.keys(this.adjacencyList);
    const edgeList = this.board.getEdgeList();
    const distances = {};
    const previous = {};
    distances[start] = 0;

    for (let vertex of vectrices) {
      if (vertex !== start) {
        distances[vertex] = Infinity;
      }
    }

    let endPoint;
    for (let i = 0; i < vectrices.length - 1; ++i) {
      for (const edge of edgeList) {
        if (distances[edge.from] + 1 < distances[edge.to]) {
          distances[edge.to] = distances[edge.from] + 1;
          previous[edge.to] = edge.from;
          const [x, y] = edge.to.split(";").map((n) => parseInt(n));
          if (
            this.board.getCell(x, y).isEmpty() ||
            this.board.getCell(x, y).isVisited()
          ) {
            await sleep(speed);
            this.board.markCellAsVisited(x, y);
          }
          if (endPointList.includes(edge.to)) {
            i = vectrices.length;
            endPoint = edge.to;
            break;
          }
        }
      }
    }

    if (!endPoint) {
      return [];
    }

    for (const edge of edgeList) {
      if (
        distances[edge.from] !== Infinity &&
        distances[edge.to] !== Infinity &&
        distances[edge.from] + 1 < distances[edge.to]
      ) {
        return [];
      }
    }

    const buildPath = (current) => {
      if (current === start) {
        return [start];
      }
      return [...buildPath(previous[current]), current];
    };

    return buildPath(endPoint);
  }
}

class PathfindingAlgorithmFactory {
  static create(name, board) {
    switch (name) {
      case "BFS":
        return new BFS(board);
      case "DFS":
        return new DFS(board);
      case "Dijkstra":
        return new Dijkstra(board);
      case "A*":
        return new AStar(board);
      case "Bellman-Ford":
        return new BellmanFord(board);
      default:
        throw new Error("Invalid Pathfinding Algorithm");
    }
  }
}

export { PathfindingAlgorithmFactory };
