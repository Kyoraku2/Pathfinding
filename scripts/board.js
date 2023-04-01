export class Board{
    constructor(rows,cols){
        this.cols = cols;
        this.rows = rows;
        this.graph = [];
    }

    initialise(){
        this.createGride();
    }

    createGride(){
        var table = '';
        for(var r = 0; r < this.rows; ++r){
            table += `<tr id="${'row'+r}">`;
            for(var c = 0; c < this.cols; ++c){
                table += `<td id="${'row'+r+'cell'+c}"></td>`;
            }
        }
        document.getElementsByClassName('board')[0].innerHTML = table;
    }
}