let player1Ready = false;
let player2Ready = false;
let player1 = {
    initiative:0,
    maxhp:40,
    currenthp:40,
    spell1:2,
    mod:16,
}

let player2 = {
    initiative:0,
    maxhp:28,
    currenthp:28,
    spell1:2,
    spell2:1,
    mod:16
}
function getMod(value) {
    return Math.floor((value -10) /2);
}

function rolld20(mod,prof) {
    let roll = Math.floor(Math.random()*20+1);
    console.log(roll + " + " + mod + " + " + prof);
    return Math.floor(roll + mod + prof);
}

function player1RollInitiative() {
    document.getElementById("InitiativeArea").style.visibility = 'hidden';
    player1.initiative = rolld20(getMod(14),2);
    console.log("Player 1 rolled " + player1.initiative);
    player1Ready = true;
    resetPrompt();
    appendPrompt(" Player 1 rolled " + player1.initiative + " for initiative. ");
    player2RollInitiative();

}

function player2RollInitiative() {
    player2.initiative = rolld20(getMod(9),2);
    console.log("Player 2 rolled " + player2.initiative);
    player2Ready = true;
    appendPrompt(" Player 2 rolled " + player2.initiative + " for initiative. ");
    checkReady();
}

function resetPrompt() {
    document.querySelector("#Prompt").innerText="";
}

function appendPrompt(msg) {
    document.querySelector("#Prompt").innerText +=msg;
}

function checkReady() {
    if(player1Ready && player2Ready){
        if(player1.initiative>player2.initiative){
            appendPrompt(" Player 1 will go first.");
            startCombat(1);
        }
        else {
            appendPrompt(" Player 2 will go first.");
            startCombat(2);
        }
    }
}

function startCombat(place) {
    while(player1.currenthp <= 0 || player2.currenthp <= 0) {
        if(place == 1) {
            goPlayer1();
            if(player2.currenthp <= 0)
                break;
            goPlayer2();
        }
        else {
            goPlayer1();
        }
    }
}

function goPlayer1() {
    openMenu();
}

function openMenu() {
    document.getElementById('CombatArea').style.display = "block";
}

