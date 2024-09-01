export const CELLS_TYPES = {
  EMPTY: 0,
  WALL: 1,
  START: 2,
  END: 3,
  CHECKPOINT: 4,
  VISITED: 5,
  PATH: 6,
};

const BASE_VISITED_OPACITY = 0.4;

class Cell {
  constructor(x, y, type, htmlElement) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.htmlElement = htmlElement;
  }

  format() {
    return `${this.x};${this.y}`;
  }

  toEmpty() {
    const emptyCell = new EmptyCell(this.x, this.y, this.htmlElement);
    emptyCell.htmlElement.classList = "";
    emptyCell.htmlElement.classList.add("empty");
    emptyCell.htmlElement.style.opacity = "1";
    emptyCell.htmlElement.textContent = "";
    return emptyCell;
  }

  toWall() {
    const wallCell = new WallCell(this.x, this.y, this.htmlElement);
    wallCell.htmlElement.classList = "";
    wallCell.htmlElement.classList.add("wall");
    wallCell.htmlElement.style.opacity = "1";
    wallCell.htmlElement.textContent = "";
    return wallCell;
  }

  toVisited() {
    const visitedCell = new VisitedCell(this.x, this.y, this.htmlElement);
    visitedCell.htmlElement.classList = "";
    visitedCell.htmlElement.classList.add("visited");
    visitedCell.htmlElement.style.opacity = visitedCell.opacity;
    return visitedCell;
  }

  toPath() {
    const pathCell = new PathCell(this.x, this.y, this.htmlElement);
    pathCell.htmlElement.classList = "";
    pathCell.htmlElement.classList.add("path");
    pathCell.htmlElement.style.opacity = pathCell.opacity;
    pathCell.htmlElement.textContent = "";
    return pathCell;
  }

  toStart() {
    const startCell = new StartCell(this.x, this.y, this.htmlElement);
    startCell.htmlElement.classList = "";
    startCell.htmlElement.classList.add("start");
    startCell.htmlElement.style.opacity = "1";
    startCell.htmlElement.textContent = "";
    return startCell;
  }

  toEnd() {
    const endCell = new EndCell(this.x, this.y, this.htmlElement);
    endCell.htmlElement.classList = "";
    endCell.htmlElement.classList.add("end");
    endCell.htmlElement.style.opacity = "1";
    endCell.htmlElement.textContent = "";
    return endCell;
  }

  toCheckpoint(id) {
    const checkpointCell = new CheckpointCell(
      this.x,
      this.y,
      id,
      this.htmlElement
    );
    checkpointCell.htmlElement.classList = "";
    checkpointCell.htmlElement.classList.add("checkpoint");
    checkpointCell.htmlElement.textContent = id;
    checkpointCell.htmlElement.style.opacity = "1";
    return checkpointCell;
  }

  isStart() {
    return this.type === CELLS_TYPES.START;
  }

  isEnd() {
    return this.type === CELLS_TYPES.END;
  }

  isEmpty() {
    return this.type === CELLS_TYPES.EMPTY;
  }

  isWall() {
    return this.type === CELLS_TYPES.WALL;
  }

  isCheckpoint() {
    return this.type === CELLS_TYPES.CHECKPOINT;
  }

  isVisited() {
    return this.type === CELLS_TYPES.VISITED;
  }

  isPath() {
    return this.type === CELLS_TYPES.PATH;
  }
}

class EmptyCell extends Cell {
  constructor(x, y, htmlElement) {
    super(x, y, CELLS_TYPES.EMPTY, htmlElement);
  }
}

class WallCell extends Cell {
  constructor(x, y, htmlElement) {
    super(x, y, CELLS_TYPES.WALL, htmlElement);
  }
}

class VisitedCell extends Cell {
  constructor(x, y, htmlElement) {
    super(x, y, CELLS_TYPES.VISITED, htmlElement);
    this.opacity = BASE_VISITED_OPACITY;
  }

  setOpacity(opacity) {
    this.opacity = opacity;
    this.htmlElement.style.opacity = opacity;
  }

  visit() {
    this.opacity += 0.2;
    this.htmlElement.style.opacity = this.opacity;
  }
}

class PathCell extends Cell {
  constructor(x, y, htmlElement) {
    super(x, y, CELLS_TYPES.PATH, htmlElement);
    this.opacity = BASE_VISITED_OPACITY;
  }

  setOpacity(opacity) {
    this.opacity = opacity;
    this.htmlElement.style.opacity = this.opacity;
  }

  visit() {
    this.opacity += 0.2;
    this.htmlElement.style.opacity = this.opacity;
  }
}

class StartCell extends Cell {
  constructor(x, y, htmlElement) {
    super(x, y, CELLS_TYPES.START, htmlElement);
  }
}

class EndCell extends Cell {
  constructor(x, y, htmlElement) {
    super(x, y, CELLS_TYPES.END, htmlElement);
  }
}

class CheckpointCell extends Cell {
  constructor(x, y, id, htmlElement) {
    super(x, y, CELLS_TYPES.CHECKPOINT, htmlElement);
    this.id = id;
  }

  setId(id) {
    this.id = id;
    this.htmlElement.textContent = id;
  }
}

export {
  Cell,
  EmptyCell,
  WallCell,
  VisitedCell,
  PathCell,
  StartCell,
  EndCell,
  CheckpointCell,
};
