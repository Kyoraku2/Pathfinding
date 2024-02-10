export const CELLS_TYPES = {
    EMPTY: 0,
    WALL: 1,
    START: 2,
    END: 3,
    CHECKPOINT: 4
}
    

export class Board{
    constructor(rows,cols){
        this.webElement = document.getElementsByClassName('board')[0];
        this.cols = cols;
        this.rows = rows;
        this.graph = [];
        this.startPoint = {x: 0, y: 0};
        this.endPoints = [];
        this.checkpoints = [];
    }

    initialise(){
        this.createGride();
    }

    createGride(){
        var table = '';
        for(var r = 0; r < this.rows; ++r){
            table += `<tr id="${'row'+r}">`;
            this.graph[r] = [];
            for(var c = 0; c < this.cols; ++c){
                this.graph[r][c] = CELLS_TYPES.EMPTY;
                table += `<td id="${r+';'+c}"></td>`;
            }
        }
        this.webElement.innerHTML = table;
    }

    checkCell(x,y, type){
        if(type == CELLS_TYPES.START){
            if(this.startPoint.x != undefined && this.startPoint.y != undefined){
                this.uncheckCell(this.startPoint.x, this.startPoint.y);
            }
            this.graph[x][y] = type;
            this.startPoint.x = x;
            this.startPoint.y = y;
            return;
        }
        if(type == CELLS_TYPES.END){
            this.graph[x][y] = type;
            this.endPoints.push({x: x, y: y});
            return;
        }
        if(type == CELLS_TYPES.CHECKPOINT){
            if(this.graph[x][y] == CELLS_TYPES.CHECKPOINT){
                return;
            }
            this.graph[x][y] = type;
            this.checkpoints.push({x: x, y: y});
            document.getElementById(x+';'+y).textContent = this.checkpoints.length;
            return;
        }
        
        this.graph[x][y] = type;
    }

    uncheckCell(x,y){
        console.log(x,y);
        if(this.graph[x][y] == CELLS_TYPES.START){
            this.startPoint = {};
        }
        if(this.graph[x][y] == CELLS_TYPES.END){
            this.endPoints = this.endPoints.filter(end => end.x != x || end.y != y);
        }
        if(this.graph[x][y] == CELLS_TYPES.CHECKPOINT){
            this.checkpoints = this.checkpoints.filter(checkpoint => checkpoint.x != x || checkpoint.y != y);
        }
        this.graph[x][y] = CELLS_TYPES.EMPTY;
        document.getElementById(x+';'+y).classList = [];
    }   

    clear(){
        for(var r = 0; r < this.rows; ++r){
            for(var c = 0; c < this.cols; ++c){
                this.graph[r][c] = CELLS_TYPES.EMPTY;
                document.getElementById(r+';'+c).classList = [];
                document.getElementById(r+';'+c).textContent = '';
            }
        }
        this.startPoint = {};
        this.endPoints = [];
        this.checkpoints = [];
    }

    clearPath(){
        for(var r = 0; r < this.rows; ++r){
            for(var c = 0; c < this.cols; ++c){
                document.getElementById(r+';'+c).classList.remove('path');
            }
        }
    }

    clearVisited(){
        for(var r = 0; r < this.rows; ++r){
            for(var c = 0; c < this.cols; ++c){
                document.getElementById(r+';'+c).classList.remove('visited');
            }
        }
    }

    toAdjacencyMatrix(){
        let adjacencyMatrix = [];

        // Convert the graph to an adjacency matrix
        for(var r = 0; r < this.rows; ++r){
            adjacencyMatrix[r] = [];
            for(var c = 0; c < this.cols; ++c){
                adjacencyMatrix[r][c] = this.graph[r][c] == CELLS_TYPES.WALL ? 0 : 1;
            }
        }

        return adjacencyMatrix;
    }

    toAdjacencyList(){
        let adjacencyList = {};

        // Convert the graph to an adjacency list
        for(var r = 0; r < this.rows; ++r){
            for(var c = 0; c < this.cols; ++c){
                if(this.graph[r][c] == CELLS_TYPES.WALL){
                    continue;
                }

                let key = r+';'+c;
                adjacencyList[key] = [];
                if(r > 0 && this.graph[r-1][c] != CELLS_TYPES.WALL){
                    adjacencyList[key].push((r-1)+';'+c);
                }
                if(c > 0 && this.graph[r][c-1] != CELLS_TYPES.WALL){
                    adjacencyList[key].push(r+';'+(c-1));
                }
                if(r < this.rows-1 && this.graph[r+1][c] != CELLS_TYPES.WALL){
                    adjacencyList[key].push((r+1)+';'+c);
                }
                if(c < this.cols-1 && this.graph[r][c+1] != CELLS_TYPES.WALL){
                    adjacencyList[key].push(r+';'+(c+1));
                }
            }
        }

        return adjacencyList;
    }
}