/*
let pencil = '<div class="d-flex"> <!--ROW 1-->'
for(let i =0; i< 81; i++){
    if(i%3 === 0 && i%9 !==0){
        pencil += `<div id="game-cell-${i+1}" class="sudoku-cell d-flex align-items-center justify-content-center lg-border-left" >`
    }else{
        pencil += `<div id="game-cell-${i+1}" class="sudoku-cell d-flex align-items-center justify-content-center" >`
    }
    pencil += `
    <div class="pencil-cell">
        <div class="d-flex justify-content-center pencil-row">
            <div class="pencil-sm-cell p-c-1 align-items-center justify-content-center p-start">1</div>
            <div class="pencil-sm-cell p-c-2 align-items-center justify-content-center p-center">2</div>
            <div class="pencil-sm-cell p-c-3 align-items-center justify-content-center p-end">3</div>
        </div>
        <div class="d-flex justify-content-center pencil-row">
            <div class="pencil-sm-cell p-c-4 align-items-center justify-content-center p-start">4</div>
            <div class="pencil-sm-cell p-c-5 align-items-center justify-content-center p-center">5</div>
            <div class="pencil-sm-cell p-c-6 align-items-center justify-content-center p-end">6</div>
        </div>
        <div class="d-flex justify-content-center pencil-row">
            <div class="pencil-sm-cell p-c-7 align-items-center justify-content-center p-start">7</div>
            <div class="pencil-sm-cell p-c-8 align-items-center justify-content-center p-center">8</div>
            <div class="pencil-sm-cell p-c-9 align-items-center justify-content-center p-end">9</div>
        </div>
    </div>
</div>`;

    if((i+1)%9 === 0){
        if((i+1)/9 +1 !== 10){
            if((i+1)/9 === 2 ||(i+1)/9 === 5){
                pencil +=`              
                </div>
                <div class="d-flex lg-border-bottom"> <!--ROW ${(i+1)/9 +1}-->`
            }else{
                pencil +=`              
                </div>
                <div class="d-flex"> <!--ROW ${(i+1)/9 +1}-->`
            }
        }
    }
}
document.getElementById("game-box").innerHTML = pencil;
*/
//#region GET SUDOKU
getSudoku();
function getSudoku(level){
    var formData = new FormData();
    if(level){
        formData.append('level', level);
    }else{
        formData.append('level', "easy");

    }
    
    fetch("libs/php/sudoku.php", {
        method: 'POST',
        body: formData
    }).then((response) => {
            if (!response.ok) {
            throw Error(response.statusText);
            }
            return response;
    }).then((response) => response.json())
      .then((data) => {
            console.log(data);
            if(document.querySelector(".active-level")){
                document.querySelector(".active-level").classList.remove("active-level")
            }
            document.getElementById(data.level).classList.add("active-level")
            for(let i = 0; i < 9; i++){
                for(let j = 0; j < 9; j++){
                    document.getElementById(`game-cell-${i*9+(j+1)}`).setAttribute("filled", "false");
                    if(data.puzzle[i][j] !== 0){
                        document.getElementById(`game-cell-${i*9+(j+1)}`).innerText = data.puzzle[i][j]
                        document.getElementById(`game-cell-${i*9+(j+1)}`).setAttribute("filled", "true")
                    }else{
                        document.getElementById(`game-cell-${i*9+(j+1)}`).innerHTML = `
                        <div class="pencil-cell">
                            <div class="d-flex justify-content-center pencil-row">
                                <div class="pencil-sm-cell p-c-1 align-items-center justify-content-center p-start">1</div>
                                <div class="pencil-sm-cell p-c-2 align-items-center justify-content-center p-center">2</div>
                                <div class="pencil-sm-cell p-c-3 align-items-center justify-content-center p-end">3</div>
                            </div>
                            <div class="d-flex justify-content-center pencil-row">
                                <div class="pencil-sm-cell p-c-4 align-items-center justify-content-center p-start">4</div>
                                <div class="pencil-sm-cell p-c-5 align-items-center justify-content-center p-center">5</div>
                                <div class="pencil-sm-cell p-c-6 align-items-center justify-content-center p-end">6</div>
                            </div>
                            <div class="d-flex justify-content-center pencil-row">
                                <div class="pencil-sm-cell p-c-7 align-items-center justify-content-center p-start">7</div>
                                <div class="pencil-sm-cell p-c-8 align-items-center justify-content-center p-center">8</div>
                                <div class="pencil-sm-cell p-c-9 align-items-center justify-content-center p-end">9</div>
                            </div>
                        </div>
                    </div>`
                    }
                    document.getElementById(`game-cell-${i*9+(j+1)}`).setAttribute("solution", data.board[i][j])

                }
            }
            if(document.getElementById("time").getAttribute("timer")){
                clearTimeout(parseInt(document.getElementById("time").getAttribute("timer")));
                clearTimeout(parseInt(document.getElementById("time").getAttribute("drift")));
                document.getElementById("time").innerText = "0:00"
                startTimer()
            }else{
                startTimer() 
            }
      })
}
//#endregion

//#region PENCIL ON/OFF BTN
document.getElementById("pencil-div").addEventListener("click", function(e){
    if(e.currentTarget.getAttribute("value") === "off"){
        e.currentTarget.style.width = "10rem"; 
        e.currentTarget.setAttribute("value", "on")
        setTimeout(function(){
            document.getElementById("pencil-on").style.display = "block"
            document.getElementById("pencil-div").style.color = "#675D50"
            const digits =document.getElementsByClassName("digit-btn")
            for(let i =0; i< digits.length; i++){
                digits[i].style.color = "#675D50"
            }
            document.documentElement.style.setProperty('--border-color', '#675D50');
            document.documentElement.style.setProperty('--hover-border-color', '#675D50');
            document.documentElement.style.setProperty('--active-cell', 'rgba(103, 93, 80,0.6)');
            document.documentElement.style.setProperty('--highlighted-cell', 'rgba(103, 93, 80,0.2)');

        }, 200)
    }else{
        e.currentTarget.style.width = "5rem"; 
        e.currentTarget.setAttribute("value", "off")
        document.getElementById("pencil-on").style.display = "none"
        document.getElementById("pencil-div").style.color = "white"
        const digits =document.getElementsByClassName("digit-btn")
        for(let i =0; i< digits.length; i++){
            digits[i].style.color = "white"
        }
        document.documentElement.style.setProperty('--border-color', '#ABC4AA');
        document.documentElement.style.setProperty('--hover-border-color', '#97b096');
        document.documentElement.style.setProperty('--active-cell', 'rgba(171, 196, 170,0.6)');
        document.documentElement.style.setProperty('--highlighted-cell', 'rgba(171, 196, 170,0.2)');

    }
})
//#endregion

//#region CLICK ON SUDOKU CELL
    const cells = document.getElementsByClassName("sudoku-cell");
    for(let i = 0; i < cells.length; i++){
        cells[i].addEventListener("click", function(e){
            if(document.querySelector(".active-cell")){
                document.querySelector(".active-cell").classList.remove("active-cell")
            }
            e.currentTarget.classList.add("active-cell")
            highlightCells(parseInt(e.currentTarget.id.split("-")[2]));
        })
    }

    function highlightCells(id){
        if(document.getElementsByClassName("highlighted-cell")){
            const highlightedCells = document.getElementsByClassName("highlighted-cell")
            while(highlightedCells.length > 0){
                highlightedCells[0].classList.remove("highlighted-cell")
            } 
        }        
        let cell = parseInt((Math.floor(Math.floor((id - (id-1)%3)/9)/3)*3)*9+((id - (id-1)%3)%9));
        for(let j = 1; j<9; j++){
            if(document.getElementById(`game-cell-${id + j*9}`)){
                document.getElementById(`game-cell-${id + j*9}`).classList.add("highlighted-cell")
            }
            if(document.getElementById(`game-cell-${id - j*9}`)){
                document.getElementById(`game-cell-${id - j*9}`).classList.add("highlighted-cell")      
            }

            if(Math.floor((id-1)/9)*9+j === id){
                if(document.getElementById(`game-cell-${Math.floor((id-1)/9)*9+9}`)){
                    document.getElementById(`game-cell-${Math.floor((id-1)/9)*9+9}`).classList.add("highlighted-cell")
                }
            }else{
                if(document.getElementById(`game-cell-${Math.floor((id-1)/9)*9+j}`)){
                    document.getElementById(`game-cell-${Math.floor((id-1)/9)*9+j}`).classList.add("highlighted-cell")
                }
            }
            if(j%3===0){
                cell += 9;
                if(cell === id){
                    if(document.getElementById(`game-cell-${(Math.floor(Math.floor((id - (id-1)%3)/9)/3)*3)*9+((id - (id-1)%3)%9)}`)){
                        document.getElementById(`game-cell-${(Math.floor(Math.floor((id - (id-1)%3)/9)/3)*3)*9+((id - (id-1)%3)%9)}`).classList.add("highlighted-cell")
                    }
                }else{
                    if(document.getElementById(`game-cell-${cell}`)){
                        document.getElementById(`game-cell-${cell}`).classList.add("highlighted-cell")
                    }
                }
            }else{
                let add = j%2 === 1 ? 1:2
                if(cell+add === id){
                    if(document.getElementById(`game-cell-${(Math.floor(Math.floor((id - (id-1)%3)/9)/3)*3)*9+((id - (id-1)%3)%9)}`)){
                        document.getElementById(`game-cell-${(Math.floor(Math.floor((id - (id-1)%3)/9)/3)*3)*9+((id - (id-1)%3)%9)}`).classList.add("highlighted-cell")
                    }
                }else{
                    if(document.getElementById(`game-cell-${cell+add}`)){
                        document.getElementById(`game-cell-${cell+add}`).classList.add("highlighted-cell")
                    }
                }
            }
        }
        
    }
//#endregion

//#region CLICK ON DIGIT
    const digits = document.getElementsByClassName("digit-btn")
    for(let i =0; i< digits.length; i++){
        digits[i].addEventListener("click", function(e){
            if(document.querySelector(`.active-cell`) && document.querySelector(`.active-cell`).getAttribute("filled") === "false"){
                if(document.getElementById("pencil-div").getAttribute("value") === "on"){
                    markDigitWithPencil(e.currentTarget.value)
                }else{
                    tryTolaceDigit(e.currentTarget.value);
                }
            }
        })
    }

    function markDigitWithPencil(value){
        if(document.querySelector(`.active-cell .p-c-${value}`).style.display === "flex"){
            document.querySelector(`.active-cell .p-c-${value}`).style.display = "none"
        }else{
            document.querySelector(`.active-cell .p-c-${value}`).style.display = "flex"
        }
    }
    function tryTolaceDigit(value){
        if(document.querySelector(`.active-cell`).getAttribute("solution") !== value){
            document.getElementById("mistakes").style.color = "rgba(253, 138, 138, 0.6)"
            document.getElementById("mistakes").innerText = parseInt(document.getElementById("mistakes").innerText) + 1
            document.documentElement.style.setProperty('--active-cell', 'rgba(253, 138, 138, 0.6)');

            setTimeout(function(){
                if(document.getElementById("pencil-div").getAttribute("value") === "off"){
                    document.documentElement.style.setProperty('--active-cell', 'rgba(171, 196, 170,0.6)');
                }else{
                    document.documentElement.style.setProperty('--active-cell', 'rgba(103, 93, 80,0.6)');
                }
                document.getElementById("mistakes").style.color = "white"
            }, 200)
        }else{
            document.querySelector(`.active-cell`).innerText = value
            document.querySelector(`.active-cell`).setAttribute("filled", "true")

        }
    }
//#endregion

//#region NEW GAME BUTTON
const newGameButtons = document.getElementsByClassName("level-input")
for(let i =0; i<newGameButtons.length; i++){
    newGameButtons[i].addEventListener("click", function(e){
        getSudoku(e.currentTarget.value)
    })
}
//#endregion

//#region TIMER
function startTimer(){
    var interval = 1000; // ms
    var expected = Date.now() + interval;
    const timer = setTimeout(step, interval)
    document.getElementById("time").setAttribute("timer", timer);
    function step() {
        var dt = Date.now() - expected; // the drift (positive for overshooting)
        if (dt > interval) {
            // something really bad happened. Maybe the browser (tab) was inactive?
            // possibly special handling to avoid futile "catch up" run
        }
        //console.log(new Date().toUTCString())
        let limit = false
        let time = document.getElementById("time").innerText.split(":")
        if(time[1] === "59"){
            if(time[0] === "59"){
                console.log("min59")
                limit = true;
            }
            time[0]++;
            time[1] = 0;
        }else{
            time[1]++;
        }
        time[1]=time[1].toString().padStart(2, "0")
        document.getElementById("time").innerText = time.join(":");
        expected += interval;
        let drift = setTimeout(step, Math.max(0, interval - dt)); // take into account drift
        document.getElementById("time").setAttribute("drift", drift);
        if(limit){
            clearTimeout(parseInt(document.getElementById("time").getAttribute("timer")));
            clearTimeout(parseInt(document.getElementById("time").getAttribute("drift")));
            document.getElementById("time").innerText = "0:00"
        }
    }
}
//#endregion
