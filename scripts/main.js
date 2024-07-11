import { AlgorithmFactory } from "./algorithm.js";
import { Board, CELLS_TYPES } from "./board.js";
import { CELLS_SIZE, SPEED_LIST } from "./consts.js";
import { sleep } from "./function.utils.js";

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
  let selectedAlgorithm = "Bellman-Ford";

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

    if (event.target.dataset.algorithm) {
      selectedAlgorithm = event.target.dataset.algorithm;
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
          await runAlgorithm();
          break;
        default:
          return;
      }
    }
  };

  const runAlgorithm = async () => {
    if (!board.startPointIsDefined() || !board.endPointIsDefined()) {
      alert("You must select a start point and at least one end point!");
      return;
    }
    board.clearVisited();
    board.clearPath();
    algoIsRunning = true;
    const path = await AlgorithmFactory.create(selectedAlgorithm, board).run(
      SPEED_LIST[currentSpeed]
    );
    algoIsRunning = false;
    if (path?.length === 0) {
      return;
    }

    for (const cell of path) {
      const [x, y] = cell.split(";");
      if (
        board.getCellType(x, y) === CELLS_TYPES.VISITED ||
        board.getCellType(x, y) === CELLS_TYPES.EMPTY
      ) {
        board.clearCell(x, y);
        board.markCellAsPath(x, y);
      }
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
