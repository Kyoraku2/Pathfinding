import { PathfindingAlgorithmFactory } from "./pathfinding-algorithm.js";
import { MazeAlgorithmFactory } from "./maze-algorithm.js";
import { Board } from "./board.js";
import { CELLS_SIZE, SPEED_LIST } from "./consts.js";
import { sleep } from "./function.utils.js";
import { ALERT_TYPES, createAlert } from "./alert.js";
import { CELLS_TYPES } from "./cell.js";

document.addEventListener("DOMContentLoaded", function () {
  const sideMenu = document.getElementsByTagName("aside")[0];
  const WIDTH = document.getElementsByClassName("board")[0].clientWidth;
  const HEIGHT = document.getElementsByClassName("board")[0].clientHeight;
  const ROWS = Math.floor(HEIGHT / CELLS_SIZE) - 1;
  const COLUMNS = Math.floor(WIDTH / CELLS_SIZE) - 1;
  const board = new Board(ROWS, COLUMNS);

  let mouseDown = false;
  let mouseButton = -1;
  let algoIsRunning = false;
  let selectedCellType = CELLS_TYPES.WALL;
  let currentSpeed = 1;
  let selectedAlgorithm = {
    name: "Dijkstra",
    isPathfinding: true,
  };

  document.addEventListener("mousedown", function (event) {
    if (algoIsRunning) {
      return;
    }
    mouseDown = true;
    mouseButton = event.button;
  });

  document.addEventListener("mouseup", function () {
    if (algoIsRunning) {
      return;
    }
    mouseDown = false;
    mouseButton = -1;
  });

  document.addEventListener("mouseover", function (event) {
    if (algoIsRunning) {
      return;
    }
    if (mouseDown) {
      if (event.target.tagName == "TD") {
        clickOnBoardHandler(event);
      }
    }
  });

  document.addEventListener("contextmenu", function (event) {
    event.preventDefault();
    if (event.target.dataset.cell === "") {
      mouseButton = event.button;
      clickOnBoardHandler(event);
    }
  });

  document.addEventListener("click", function (event) {
    if (event.target.classList.contains("toggle")) {
      clickOnSideMenuToggleHandler(event);
    }

    if (algoIsRunning) {
      return;
    }

    if (event.target.dataset.pathfinding) {
      selectedAlgorithm = {
        name: event.target.dataset.pathfinding,
        isPathfinding: true,
      };
      createAlert(
        ALERT_TYPES.INFO,
        "Changed algorithm:",
        `You have selected ${selectedAlgorithm.name} pathfinding algorithm.`
      );
      return;
    }

    if (event.target.dataset.maze) {
      selectedAlgorithm = {
        name: event.target.dataset.maze,
        isPathfinding: false,
      };
      createAlert(
        ALERT_TYPES.INFO,
        "Changed algorithm:",
        `You have selected ${selectedAlgorithm.name} maze generation algorithm.`
      );
      return;
    }

    if (event.target.closest("nav")) {
      clickOnNavHandler(event);
    }

    if (event.target.dataset.cell === "") {
      mouseButton = event.button;
      clickOnBoardHandler(event);
    }
  });

  const clickOnBoardHandler = (event) => {
    const [x, y] = event.target.id.split(";");
    board.clearCell(x, y);
    if (mouseButton === 2) {
      return;
    }
    switch (selectedCellType) {
      case CELLS_TYPES.EMPTY:
        board.markCellAsEmpty(x, y);
        return;
      case CELLS_TYPES.WALL:
        board.markCellAsWall(x, y);
        break;
      case CELLS_TYPES.START:
        board.markCellAsStart(x, y);
        break;
      case CELLS_TYPES.END:
        board.markCellAsEnd(x, y);
        break;
      case CELLS_TYPES.CHECKPOINT:
        board.markCellAsCheckpoint(x, y);
        break;
      default:
        return;
    }
  };

  const clickOnNavHandler = async (event) => {
    if (
      event.target.classList.contains("label-wall") ||
      event.target.classList.contains("label-start") ||
      event.target.classList.contains("label-end") ||
      event.target.classList.contains("label-checkpoint")
    ) {
      selectedCellType = parseInt(event.target.value);
      return;
    }

    if (
      event.target.tagName == "A" ||
      event.target.tagName == "BUTTON" ||
      event.target.tagName == "SPAN"
    ) {
      const item = event.target.closest("li");
      if (!item) {
        return;
      }
      switch (item.id) {
        case "speed":
          currentSpeed = currentSpeed * 2;
          if (currentSpeed > 8) {
            currentSpeed = 1;
          }
          item.getElementsByTagName("span")[0].innerText = `x${currentSpeed}`;
          break;
        case "clear":
          board.clear();
          break;
        case "run":
          if (selectedAlgorithm.isPathfinding) {
            await runPathfindingAlgorithm();
          } else {
            await runMazeGenerationAlgorithm();
          }
          break;
        default:
          return;
      }
    }
  };

  const runMazeGenerationAlgorithm = async () => {
    board.clearVisited();
    board.clearPath();
    algoIsRunning = true;
    createAlert(
      ALERT_TYPES.INFO,
      "Algorithm is running:",
      `${selectedAlgorithm.name} algorithm is running, wait for the result.`
    );
    await MazeAlgorithmFactory.create(selectedAlgorithm.name, board).run(
      SPEED_LIST[currentSpeed]
    );
    algoIsRunning = false;
    createAlert(
      ALERT_TYPES.SUCCESS,
      "Maze generated:",
      `${selectedAlgorithm.name} maze has been generated.
      You can now run a pathfinding algorithm.`
    );
  };

  const runPathfindingAlgorithm = async () => {
    if (!board.startPointIsDefined() || !board.endPointIsDefined()) {
      createAlert(
        ALERT_TYPES.ERROR,
        "Missing start or end point:",
        "Please define start and end points."
      );
      return;
    }
    board.clearVisited();
    board.clearPath();
    algoIsRunning = true;
    createAlert(
      ALERT_TYPES.INFO,
      "Algorithm is running:",
      `${selectedAlgorithm.name} algorithm is running, wait for the result.`
    );
    const path = await PathfindingAlgorithmFactory.create(
      selectedAlgorithm.name,
      board
    ).run(SPEED_LIST[currentSpeed]);
    algoIsRunning = false;
    if (!path || path.length === 0) {
      createAlert(
        ALERT_TYPES.WARNING,
        "No path found:",
        "There is no path between start and end points (passing through all checkpoints)."
      );
      return;
    }

    createAlert(
      ALERT_TYPES.SUCCESS,
      "Path found:",
      `A path of length ${path.length} between start and end points has been found.`
    );

    for (const cell of path) {
      const [x, y] = cell.split(";");
      if (
        !board.getCell(x, y).isVisited() &&
        !board.getCell(x, y).isEmpty() &&
        !board.getCell(x, y).isPath()
      ) {
        continue;
      }
      if (board.getCell(x, y).isVisited() || board.getCell(x, y).isEmpty()) {
        board.clearCell(x, y);
      }
      board.markCellAsPath(x, y);
      await sleep(SPEED_LIST[currentSpeed]);
    }
  };

  const clickOnSideMenuToggleHandler = (e) => {
    if (sideMenu.classList.contains("hidden")) {
      sideMenu.classList.remove("hidden");
      e.target.classList.add("toggle--rotated");
    } else {
      sideMenu.classList.add("hidden");
      e.target.classList.remove("toggle--rotated");
    }
  };
});
