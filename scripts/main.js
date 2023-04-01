import { Board } from "./board.js";

document.addEventListener("DOMContentLoaded",function(){
    var nav = document.getElementsByTagName("NAV")[0];

    nav.addEventListener('click',function(e){
        console.log(e.target)
        var lastActive = document.getElementsByClassName('navActive')[0];
        var newActive = e.target.closest('li');
        if(lastActive != undefined){
            lastActive.classList.remove('navActive');
        }
        if(newActive != undefined && newActive != null && newActive.id != 'item0' && newActive.id != 'item5'){
            newActive.classList.add('navActive');
        }
    })
    var width = document.getElementsByClassName('board')[0].clientWidth;
    var height = document.getElementsByClassName('board')[0].clientHeight;
    
    var rows = Math.floor(height / 25);
    var cols = Math.floor(width / 25);
    var board = new Board(rows,cols);
    board.createGride();
});