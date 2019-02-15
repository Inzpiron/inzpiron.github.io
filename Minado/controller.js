var visitado;
var flagMap;
var gameOver;
var flagCount;
var app;

function iniciaJogo() {
    app = new Vue({
        el: "#app",
        data: {
            mapa: '',
            iconMap: '',
            teste: 'em-svg em-bomb'
        }
    });
    reset();
    buildMap();

    alert(app.iconMap);
}

function getButtonFlag() {
    var btn = document.getElementById("botaoloco");
    return btn.checked;
}

function reset() {
    flagCount = 0;
    gameOver = false;

    app.mapa = new Array(8);
    app.iconMap = new Array(8);

    visitado = new Array(8);
    flagMap = new Array(8);

    for(let i = 0; i < 8; i++) {
        visitado[i] = new Array(8).fill(false);
        flagMap[i] = new Array(8).fill(false);

        app.mapa[i] = new Array(8).fill('0');
        app.iconMap[i] = new Array(8).fill("em-svg em-black_large_square");
    }

    for(let i = 0; i < 10; i++) {
        let check = false;

        while(check === false) {
            let ii = generateRandomNumber(0, 7);
            let jj = generateRandomNumber(0, 7);

            if(app.mapa[ii][jj] === '0') {
                app.mapa[ii][jj] = 'B';
                check = true;
            }
        }
    }

    for(let i = 0; i < 8; i++) {
        for(let j = 0; j < 8; j++) {
            if(app.mapa[i][j] != 'B') {
                let cont = 0;

                var ii = [-1, -1, -1,  0, 0,  1, 1, 1];
                var jj = [-1,  0,  1, -1, 1, -1, 0, 1];

                for (let k = 0; k < 8; k++) {
                    let y = i + ii[k];
                    let x = j + jj[k];

                    if (y >= 0 && y < 8 && x >= 0 && x < 8) {
                        if (app.mapa[y][x] === 'B')
                            cont++;
                    }
                }

                app.mapa[i][j] = cont;
            }
        }
    }

    document.getElementById("flag-count").innerHTML = ' x ' + (10-flagCount).toString();
}

function buildMap() {
    for(let i = 0; i < 8; i++) {
        let tr = document.createElement("tr");
        let vtable = document.getElementById("vtablecontent");

        for(var j = 0; j < 8; j++) {
            var td = document.createElement("td");
            td.id = "cel-" + i.toString() + "-" + j.toString();
            //td.onclick = function(){open(this)};
            td.onmousedown =  function(){mouseControllerClick(this, event.button)};
            td.innerHTML = '<img class="content" src="sprites/unsolved.png">';
            tr.appendChild(td);
        }

        document.getElementById('paidetudo').appendChild(tr);
    }
}


function mouseControllerClick(td, button) {
    var id = td.id.toString().replace('cel_', '').split('_');
    var ii = parseInt(id[1]);
    var jj = parseInt(id[2]);


    app.teste = "em-svg em-skull";
    app.iconMap[ii][jj] = "leo";

    alert(app.iconMap);

    if(!gameOver) {
        if (button == 0 && getButtonFlag() == false)
            open(td);
        else {
            putFlag(td);
        }
    }
}

function putFlag(td) {
    var id = td.id.toString().replace('cel-', '').split('-');
    var ii = parseInt(id[0]);
    var jj = parseInt(id[1]);

    if(flagMap[ii][jj] == true) {
        flagCount--;
        td.innerHTML = '<img class="content" src="sprites/unsolved.png">';
        flagMap[ii][jj] = false;
    } else if(flagCount < 10) {
        if(visitado[ii][jj] == false) {
            flagCount++;
            td.innerHTML = '<img class="content" src="sprites/flag.png">';
            flagMap[ii][jj] = true;
            checkVictory();
        }
    }


    document.getElementById("flag-count").innerHTML = ' x ' + (10-flagCount).toString();
}

function open(td){
    if(!gameOver) {
        var id = td.id.toString().replace('cel-', '').split('-');
        var ii = parseInt(id[0]);
        var jj = parseInt(id[1]);
       // serumcuzao(ii, jj);

        visitado[ii][jj] = true;

        if (flagMap[ii][jj] == true) {
            flagCount--;
            document.getElementById("flag-count").innerHTML = ' x ' + (10-flagCount).toString();
        }

        if (app.mapa[ii][jj] == 'B') {
            gameOver = true;
            for (let i = 0; i < 8; i++) {
                for (let j = 0; j < 8; j++) {
                    if (app.mapa[i][j] == 'B') {
                        var trr = document.getElementById('cel-' + i.toString() + '-' + j.toString());
                        if(!flagMap[i][j])
                            trr.innerHTML = '<img class="content" src="sprites/bomb.png">';
                        else
                            trr.innerHTML = '<img class="content" src="sprites/bomb-covered.png">';
                    }
                }
            }
        } else if (app.mapa[ii][jj] == '0') {
            td.innerHTML = '<img class="content" src="sprites/nothing.png">';
            flood_fill(ii, jj);
        } else {
            td.innerHTML = '<img class="content" src="sprites/' + app.mapa[ii][jj] + '.png">';
        }

        if(!gameOver)
            checkVictory();
    }
}

function serumcuzao(_i, _j) {
    var cont = 0;
    for(var i = 0; i < 8; i++) {
        for(var j = 0; j < 8; j++) {
            if(!visitado[i][j] && !flagMap[i][j])
                cont++;
        }
    }

    if(cont <= 2) {
        app.mapa[_i][_j] = 'B';
        var ii = [-1, -1, -1,  0, 0,  1, 1, 1];
        var jj = [-1,  0,  1, -1, 1, -1, 0, 1];

        for(let k = 0; k < 8; k++) {
            let y = _i + ii[k];
            let x = _j + jj[k];

            if (y >= 0 && y < 8 && x >= 0 && x < 8) {
                app.mapa[y][x]++;
                if(visitado[y][x]) {
                    var td = document.getElementById('cel-' + y.toString() + '-' + x.toString());
                    td.innerHTML = '<img class="content" src="sprites/' + app.mapa[y][x].toString() + '.png">';
                }
            }
        }
    }
}

function flood_fill(i, j) {
    var ii = [-1, -1, -1,  0, 0,  1, 1, 1];
    var jj = [-1,  0,  1, -1, 1, -1, 0, 1];

    for(let k = 0; k < 8; k++) {
        let y = i + ii[k];
        let x = j + jj[k];

        if (y >= 0 && y < 8 && x >= 0 && x < 8) {
            if(!visitado[y][x]) {
                visitado[y][x] = true;
                var td = document.getElementById('cel-' + y.toString() + '-' + x.toString());
                if(!flagMap[y][x]) {
                    if (app.mapa[y][x] == '0') {
                        td.innerHTML = '<img class="content" src="sprites/nothing.png">';
                        flood_fill(y, x);
                    } else if (app.mapa[y][x] != 'B') {
                        td.innerHTML = '<img class="content" src="sprites/' + app.mapa[y][x].toString() + '.png">';
                    }
                }
            }
        }
    }
}

function checkVictory() {
    var visitCount = 0;
    for(var i = 0; i < 8; i++) {
        for(var j = 0; j < 8; j++) {
            if(visitado[i][j])
                visitCount++;
        }
    }

    if(visitCount == (8*8 - 10)) {
        gameOver = true;
        alert('Você é do caralho!');
    }
}

function generateRandomNumber(min , max)  {
    return Math.round(Math.random() * (max-min) + min);
}

