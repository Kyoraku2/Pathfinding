import { PriorityQueue } from "./algorithmUtils.js";

class Algorithm{
    constructor(name, board){
        this.name = "Algorithm";
        this.adjacencyMatrix = board.toAdjacencyMatrix();
        this.adjacencyList = board.toAdjacencyList(); 
        this.start = board.startPoint.x + ";" + board.startPoint.y;
        this.ends = board.endPoints.map(end => end.x + ";" + end.y);
        this.checkpoints = board.checkpoints.map(checkpoint => checkpoint.x + ";" + checkpoint.y);
    }

    run(){
        // TODO : find a random algorithm to implement
        console.log("Not implemented yet!");
    }
}

class BFS extends Algorithm{
    constructor(board){
        super("BFS", board);
    }

    run(){
        console.log("Running BFS");
        // TODO: Implement BFS
    }
}

class DFS extends Algorithm{
    constructor(board){
        super("DFS", board);
    }

    run(){
        console.log("Running DFS");
        // TODO: Implement DFS
    }
}

class Dijkstra extends Algorithm{
    constructor(board){
        super("Dijkstra", board);
    }

    async run(speed){
        console.log(this.checkpoints);
        if(this.checkpoints.length > 0){
            return this.runWithCheckpoints(speed);
        }else{
            return this.runUtils(this.start, this.ends, speed);
        }
    }


    async runWithCheckpoints(speed){
        console.log("Running Dijkstra with checkpoints");
        let path = [];
        for(let i = 0; i < this.checkpoints.length; i++){
            let start = i == 0 ? this.start : this.checkpoints[i-1];
            let end = this.checkpoints[i];
            let subPath = await this.runUtils(start, [end], speed);
            if(subPath.length > 0){
                path = path.concat(subPath);
            }else{
                return [];
            }
        }
        let lastCheckpoint = this.checkpoints[this.checkpoints.length-1];
        let subPath = await this.runUtils(lastCheckpoint, this.ends, speed);
        if(subPath.length > 0){
            path = path.concat(subPath);
        }else{
            return [];
        }
        return path;
    }

    async runUtils(start, ends, speed){
        console.log("Running Dijkstra from " + start + " to " + ends);
        const nodes = new PriorityQueue();
        const distances = {};
        const previous = {};
        let path = [];
        let smallest;

        for(let vertex in this.adjacencyList){
            if(vertex === start){
                distances[vertex] = 0;
                nodes.enqueue(vertex, 0);
            }else{
                distances[vertex] = Infinity;
                nodes.enqueue(vertex, Infinity);
            }
            previous[vertex] = null;
        }

        while(nodes.values.length){
            smallest = nodes.dequeue().val;

            if(ends.includes(smallest)){
                while(previous[smallest]){
                    path.push(smallest);
                    smallest = previous[smallest];
                }
                break;
            }
            if(smallest || distances[smallest] !== Infinity){
                for(let neighbor in this.adjacencyList[smallest]){
                    let nextNode = this.adjacencyList[smallest][neighbor];
                    let candidate = distances[smallest] + 1; 
                    if(candidate < distances[nextNode]){
                        distances[nextNode] = candidate;
                        previous[nextNode] = smallest;
                        nodes.enqueue(nextNode, candidate);
                        if(!ends.includes(nextNode)){
                            await new Promise(resolve => setTimeout(resolve, speed));
                            let cell = document.getElementById(nextNode);
                            if(cell.classList.length == 0){
                                cell.classList.add('visited');
                            }
                        }
                    }
                }
            }
        }

        return path.concat(smallest).reverse();
    }
}

class AStar extends Algorithm{
    constructor(board){
        super("A*", board);
    }

    run(){
        console.log("Running A*");
        // TODO: Implement A*
    }
}

class AlgorithmFactory{
    static create(name, board){
        switch(name){
            case "BFS":
                return new BFS(board);
            case "DFS":
                return new DFS(board);
            case "Dijkstra":
                return new Dijkstra(board);
            case "A*":
                return new AStar(board);
            default:
                return new Algorithm(name, board);
        }
    }
}

export {AlgorithmFactory};