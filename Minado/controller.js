var mapa;
var visitado;
var flagMap;
var gameOver;
var flagCount;

function iniciaJogo() {
    alert(getButtonFlag())
    reset();
    buildMap();
}

function getButtonFlag() {
    var btn = document.getElementById("botaoloco");
    return btn.checked;
}

function buildMap() {
    for(let i = 0; i < 8; i++) {
        let tr = document.createElement("tr");

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

function resetButton() {
    reset();

    for(var i = 0; i < 8; i++) {
        for(var j = 0; j < 8; j++) {
            var td = document.getElementById('cel-' + i.toString() + '-' + j.toString());
            td.innerHTML = '<img class="content" src="sprites/unsolved.png">';
        }
    }
}

function reset() {
    flagCount = 0;
    gameOver = false;
    mapa = new Array(8);
    visitado = new Array(8);
    flagMap = new Array(8);

    for(let i = 0; i < 8; i++) {
        mapa[i] = new Array(8).fill('0');
        visitado[i] = new Array(8).fill(false);
        flagMap[i] = new Array(8).fill(false);
    }

    for(let i = 0; i < 10; i++) {
        let check = false;

        while(check === false) {
            let ii = generateRandomNumber(0, 7);
            let jj = generateRandomNumber(0, 7);

            if(mapa[ii][jj] === '0') {
                mapa[ii][jj] = 'B';
                check = true;
            }
        }
    }

    for(let i = 0; i < 8; i++) {
        for(let j = 0; j < 8; j++) {
            if(mapa[i][j] != 'B') {
                let cont = 0;

                var ii = [-1, -1, -1,  0, 0,  1, 1, 1];
                var jj = [-1,  0,  1, -1, 1, -1, 0, 1];

                for (let k = 0; k < 8; k++) {
                    let y = i + ii[k];
                    let x = j + jj[k];

                    if (y >= 0 && y < 8 && x >= 0 && x < 8) {
                        if (mapa[y][x] === 'B')
                            cont++;
                    }
                }

                mapa[i][j] = cont;
            }
        }
    }
    document.getElementById("flag-count").innerHTML = ' x ' + (10-flagCount).toString();
}

function mouseControllerClick(td, button) {
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

        visitado[ii][jj] = true;

        if (flagMap[ii][jj] == true) {
            flagCount--;
            document.getElementById("flag-count").innerHTML = ' x ' + (10-flagCount).toString();
        }

        if (mapa[ii][jj] == 'B') {
            gameOver = true;
            for (let i = 0; i < 8; i++) {
                for (let j = 0; j < 8; j++) {
                    if (mapa[i][j] == 'B') {
                        var trr = document.getElementById('cel-' + i.toString() + '-' + j.toString());
                        if(!flagMap[i][j])
                            trr.innerHTML = '<img class="content" src="sprites/bomb.png">';
                        else
                            trr.innerHTML = '<img class="content" src="sprites/bomb-covered.png">';
                    }
                }
            }
        } else if (mapa[ii][jj] == '0') {
            td.innerHTML = '<img class="content" src="sprites/nothing.png">';
            flood_fill(ii, jj);
        } else {
            td.innerHTML = '<img class="content" src="sprites/' + mapa[ii][jj] + '.png">';
        }

        checkVictory();
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
                    if (mapa[y][x] == '0') {
                        td.innerHTML = '<img class="content" src="sprites/nothing.png">';
                        flood_fill(y, x);
                    } else if (mapa[y][x] != 'B') {
                        td.innerHTML = '<img class="content" src="sprites/' + mapa[y][x].toString() + '.png">';
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

    if(visitCount + flagCount == 8*8) {
        gameOver = true;
        alert('Você é do caralho!');
    }
}

function generateRandomNumber(min , max)  {
    return Math.round(Math.random() * (max-min) + min);
}

