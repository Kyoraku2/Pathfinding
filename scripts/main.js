import { AlgorithmFactory } from "./algorithm.js";
import { Board, CELLS_TYPES } from "./board.js";

document.addEventListener("DOMContentLoaded",function(){
    let nav = document.getElementsByTagName("NAV")[0];
    let sideMenu = document.getElementsByClassName("sideMenu")[0];
    let width = document.getElementsByClassName('board')[0].clientWidth;
    let height = document.getElementsByClassName('board')[0].clientHeight;
    
    let rows = Math.floor(height / 25);
    let cols = Math.floor(width / 25);
    let board = new Board(rows,cols);
    board.createGride();
    
    let mouseDown = false;
    let mouseButton = -1;

    let algoIsRunning = false;
    let cellType = CELLS_TYPES.WALL;

    const SPEEDS = {
        1: 100,
        2: 50,
        4: 25,
        8: 10,
    }

    let currentSpeed = 1;

    document.addEventListener('mousedown',function(e){
        if(algoIsRunning){
            return;
        }
        mouseDown = true;
        mouseButton = e.button;
    });

    document.addEventListener('mouseup',function(e){
        if(algoIsRunning){
            return;
        }
        mouseDown = false;
        mouseButton = -1;
    });

    document.addEventListener('mouseover',function(e){
        if(algoIsRunning){
            return;
        }
        if(mouseDown){
            if(e.target.tagName == 'TD'){
                clickOnBoardHandler(e);
            }
        }
    });

    document.addEventListener('contextmenu', function(e){
        e.preventDefault();
        // Board
        if(e.target.tagName == 'TD'){
            mouseButton = e.button;
            clickOnBoardHandler(e);
        }
    });

    document.addEventListener('click',function(e){
        if(algoIsRunning){
            return;
        }
        // Navbar
        if(e.target.closest('nav')){
            clickOnNavHandler(e);
        }

        // Board
        if(e.target.tagName == 'TD'){
            mouseButton = e.button;
            clickOnBoardHandler(e);
        }

        // Side Menu toggle
        if(e.target.classList.contains('sideMenu__toggle')){
            clickOnSideMenuToggleHandler(e);
        }
    });

    const clickOnBoardHandler = (e) => {
        const [x,y] = e.target.id.split(';');
        if(mouseButton == 0){
            e.target.classList = [];

            switch(cellType){
                case CELLS_TYPES.EMPTY:
                    return;
                case CELLS_TYPES.WALL:
                    e.target.classList.add('wall');
                    break;
                case CELLS_TYPES.START:
                    e.target.classList.add('start');
                    break;
                case CELLS_TYPES.END:
                    e.target.classList.add('end');
                    break;
                case CELLS_TYPES.CHECKPOINT:
                    e.target.classList.add('checkpoint');
                    break;
                default:
                    return;
            }

            board.checkCell(x,y,cellType);
        }else{
            e.target.classList.remove('wall');
            board.uncheckCell(x,y);
        }
    }

    const clickOnNavHandler = async (e) => {
        if(e.target.tagName == 'INPUT'){
            cellType = parseInt(e.target.value);
            return;
        }
        if(e.target.tagName == 'BUTTON'){
            // TODO
        }
        if(e.target.tagName == 'A' || e.target.tagName == 'BUTTON' || e.target.tagName == 'SPAN'){
            let item = e.target.closest('li');
            if(!item){
                return;
            }
            switch(item.id){
                case 'item0':
                    // Nothing to do
                    break;
                case 'item1':
                    // TODO (submenu for algorithm selection)
                    break;
                case 'item2':
                    // TODO (submenu for maze generation)
                    break;
                case 'item3':
                    currentSpeed = currentSpeed * 2;
                    if(currentSpeed > 8){
                        currentSpeed = 1;
                    }
                    item.getElementsByTagName('span')[0].innerText = `x${currentSpeed}`
                    break;
                case 'item4':
                    board.clear();
                    break;
                case 'item5':
                    // TODO : clean alert
                    if(board.startPoint.x == undefined || board.endPoints.length == 0){
                        alert("You must select a start point and at least one end point!");
                        return;
                    }
                    board.clearVisited();
                    board.clearPath();
                    algoIsRunning = true;
                    let path = await AlgorithmFactory.create("Dijkstra", board).run(SPEEDS[currentSpeed]);
                    algoIsRunning = false;
                    if(path && path.length > 1){
                        for(let cell of path){
                            await new Promise(resolve => setTimeout(resolve, SPEEDS[currentSpeed]));

                            if(cell != board.startPoint.x+';'+board.startPoint.y && board.endPoints.map(end => end.x+';'+end.y).indexOf(cell) == -1 && document.getElementById(cell).classList.contains('visited')){
                                document.getElementById(cell).classList = [];
                                document.getElementById(cell).classList.add('path');
                            }
                        }
                    }
                    break;
            }
        }
    }
    
    const clickOnSideMenuToggleHandler = (e) => {
        if(sideMenu.classList.contains('sideMenu--hidden')){
            sideMenu.classList.remove('sideMenu--hidden');
            e.target.classList.add('sideMenu__toggle--rotated');
        }else{
            sideMenu.classList.add('sideMenu--hidden');
            e.target.classList.remove('sideMenu__toggle--rotated');
        }
    }
});