let player1Ready = false;
let player2Ready = false;
let availableAction = 1;
let availableBonusAction = 1;
let availableSpell = 1;
let promptCounter = 0;
let prayCounter = 1;
let secondWindCounter = 1;
let noActionChecker = false;
let noBonusActionChecker = false;
let noSpellChecker = false;

const prompt = document.getElementById('Prompt');
class Weapon {
    constructor(name, num, dmg) {
        this.name = name;
        this.num = num;
        this.dmg = dmg;
    }
}

let playerWeapon = new Weapon("Straight Sword", 1, 8);
let enemyWeapon = new Weapon("Claws", 2, 4);
let player1 = {
    name: "Julian THE ROCKET LEAGUE GOD",
    initiative: 0,
    maxhp: 40,
    currenthp: 40,
    armor: 14,
    spell1: 2,
    spell2: 0,
    mod: 16,
    prof: 2,
    adv: false,
    weapon: playerWeapon
}

let player2 = {
    name: "The Ghoul",
    initiative: 0,
    maxhp: 100,
    currenthp: 20,
    armor: 11,
    spell1: 2,
    spell2: 1,
    mod: 11,
    prof: 2,
    adv: false,
    weapon: enemyWeapon
}
updateComponents();
function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}
function getModifier(value) {
    return Math.floor((value - 10) / 2);
}


//Function to roll default 1d20 dice. Used for initiative.
function rolld20(mod, prof) {
    let roll = Math.floor(Math.random() * 20 + 1);
    console.log(roll + " + " + mod + " + " + prof);
    return Math.floor(roll + mod + prof);
}

//Function to roll any number of any dice. num is # of dice. dmg is the type of die.
//mod is the any modifier the character uses (ex. must be 3, not 16). prof is the 
//profficiency bonus the character has.
function roll(num, dmg, mod, prof) {
    let roll = 0;
    let message = "";
    let modifier = Math.floor((mod - 10) / 2);
    for (let i = 0; i < num; i++) {
        let singleRoll = Math.floor(Math.random() * dmg + 1);
        roll += singleRoll;
        message += singleRoll + " + ";
    }
    console.log(message + modifier + " + " + prof);
    return Math.floor(roll + modifier + prof);

}

//Rolls player initiative
function player1RollInitiative() {
    document.getElementById("InitiativeArea").style.visibility = 'hidden';
    document.getElementById("EndArea").style.visibility = 'hidden';
    player1.initiative = rolld20(getModifier(14), 2);
    console.log("Player 1 rolled " + player1.initiative);
    player1Ready = true;
    resetPrompt();
    appendPrompt(" Player 1 rolled " + player1.initiative + " for initiative. ");
    player2RollInitiative();

}

//Rolls enemy initiative
function player2RollInitiative() {
    player2.initiative = rolld20(getModifier(9), 2);
    console.log("Player 2 rolled " + player2.initiative);
    player2Ready = true;
    appendPrompt(" Player 2 rolled " + player2.initiative + " for initiative. ");
    checkReady();
}

//clears the prompt paragraph
function resetPrompt() {
    document.querySelector("#Prompt").innerText = "";
}

//appends a string to the prompt paragraph
async function appendPrompt(msg) {
    if (promptCounter >= 3) {
        removeFirstSentence();
    }
    document.querySelector("#Prompt").innerText += msg;
    promptCounter++;
}

//removes the first sentence of the prompt paragraph
function removeFirstSentence() {

    let index = document.querySelector("#Prompt").innerText.indexOf(".");
    let text = document.querySelector("#Prompt").innerText.substring(index + 2);
    document.querySelector('#Prompt').innerHTML = text;
}

//checks if both characters have an initiative and are ready
function checkReady() {
    if (player1Ready && player2Ready) {
        if (player1.initiative > player2.initiative) {
            appendPrompt(" Player 1 will go first.");
            startCombat(1);
        }
        else {
            appendPrompt(" Player 2 will go first.");
            startCombat(2);
        }
    }
}

//starts actual combat. Place is when the player will go. 
//Right now player always goes first.
function startCombat(place) {
    document.querySelector('#InitiativeArea').style.display = "none";
    console.log("startCombat(" + place + ")");
    document.getElementById('Attack').title += " Weapon deals " + player1.weapon.num + "d" + player1.weapon.dmg + " + " + getModifier(player1.mod) + " + " + player1.prof + ".";
    if (place == 1) {
        goPlayer1();
    }
    else {
        goPlayer2();
    }
}

//Players turn. Opens combat menu
function goPlayer1() {
    updateComponents();
    console.log("goPlayer1()")
    openMenu();
}

function goPlayer2() {
    updateComponents();
    console.log("goPlayer2()");
    if (checkToHit(player2, player1)) {
        dealDamage(player2, player1, player2.weapon.num, player2.weapon.dmg);
        console.log("Player1 HP: " + player1.currenthp + " Player2 HP: " + player2.currenthp);
    }
    endTurn(1);
}

//Options: Action BonusAction Spell Potion Back
function openMenu() {
    currentMenu = document.getElementById('CombatArea');
    document.getElementById('CombatArea').style.display = "flex";
}

//Action Selected: Options: Attack Back
function selectAction() {
    document.getElementById('CombatArea').style.display = "none";
    document.getElementById('ActionArea').style.display = "flex";
}

function selectBonusAction() {
    document.getElementById('CombatArea').style.display = "none";
    document.getElementById('BonusActionArea').style.display = "flex";
}

function selectSpell() {
    document.getElementById('CombatArea').style.display = "none";
    document.getElementById('SpellArea').style.display = "flex";
}

function selectPotion() {
    document.getElementById('CombatArea').style.display = "none";
    document.getElementById('PotionArea').style.display = "flex";
}

function returnToMenuA() {
    updateComponents();
    document.getElementById('ActionArea').style.display = "none";
    document.getElementById('CombatArea').style.display = "flex";
}

function returnToMenuBA() {
    updateComponents();
    document.getElementById('BonusActionArea').style.display = "none"; document.getElementById('CombatArea').style.display = "flex";
    document.getElementById('CombatArea').style.display = "flex";
}

function returnToMenuS() {
    updateComponents();
    document.getElementById('SpellArea').style.display = "none"; document.getElementById('CombatArea').style.display = "flex";
    document.getElementById('CombatArea').style.display = "flex";
}

function returnToMenuP() {
    updateComponents();
    document.getElementById('PotionArea').style.display = "none"; document.getElementById('CombatArea').style.display = "flex";
    document.getElementById('CombatArea').style.display = "flex";
}

function dealDamage(fromCharacter, toCharacter, num, dmg) {
    let damage = roll(num, dmg, fromCharacter.mod, fromCharacter.prof);
    appendPrompt(" " + fromCharacter.name + " has dealt " + damage + " damage to " + toCharacter.name + ".");
    if (damage >= toCharacter.currenthp) {
        toCharacter.currenthp = 0;
    }
    else {
        toCharacter.currenthp -= damage;
    }
}

function attack() {
    if (availableAction > 0) {
        if (checkToHit(player1, player2)) {
            dealDamage(player1, player2, player1.weapon.num, player1.weapon.dmg);
            console.log("Player1 HP: " + player1.currenthp + " Player2 HP: " + player2.currenthp);
        }
        availableAction--;
        returnToMenuA();
    }
    else {
        appendPrompt(" No available Action, Please go back. ");
    }
}

function checkToHit(fromCharacter, toCharacter) {
    let number = 0;
    if (fromCharacter.adv) {
        let temp1 = roll(1, 20, fromCharacter.mod, fromCharacter.prof);
        let temp2 = roll(1, 20, fromCharacter.mod, fromCharacter.prof);
        number = Math.max(temp1, temp2);
        fromCharacter.adv = false;
    }
    else {
        number = roll(1, 20, fromCharacter.mod, fromCharacter.prof);
    }

    if (number >= toCharacter.armor) {
        appendPrompt(" " + fromCharacter.name + " landed " + number + " hit.");
        return true;
    }
    else {
        appendPrompt(" " + fromCharacter.name + " rolls " + number + " misses completely.");
        return false;
    }
}

function secondWind() {
    if (availableBonusAction > 0 && secondWindCounter > 0) {
        availableAction++;
        appendPrompt(" You feel invigorated, gaining one free Action.");
        secondWindCounter--;
        availableBonusAction--;
        returnToMenuBA();
    }
    else if (secondWindCounter <= 0) {
        appendPrompt(" Second Wind refreshes after rest, Please go back. ");
    }
    else {
        appendPrompt(" No available Bonus Action, Please go back. ");
    }
}

function pray() {
    if (availableBonusAction > 0 && prayCounter && availableAction > 0) {
        player1.adv = true;
        appendPrompt(" You offer a quick prayer to strike true.");
        prayCounter--;
        availableBonusAction--;
        returnToMenuBA();
    }
    else if (prayCounter <= 0) {
        appendPrompt(" Pray refreshes after combat ends, Please go back. ");
    }
    else if (availableAction <= 0) {
        appendPrompt(" No Action available to give ADV.");
    }
    else {
        appendPrompt(" No available Bonus Action, Please go back. ");
    }
}

function endTurn(num) {
    availableAction = 1;
    availableBonusAction = 1;
    availableSpell = 1;
    if (num == 1) {
        goPlayer1();
    }
    else {
        goPlayer2();
    }
}


function updateComponents() {
    availableAction >= 1? document.getElementById('Action').disabled = false: document.getElementById('Action').disabled = true;
    availableBonusAction >= 1? document.getElementById('BonusActions').disabled = false: document.getElementById('BonusActions').disabled = true;
    availableSpell >= 1? document.getElementById('Spells').disabled = false: document.getElementById('Spells').disabled = true;
    document.getElementById("EndArea").style.visibility = 'hidden';
    document.getElementById("PopWindow").style.visibility = 'hidden';
    document.getElementById('HealthBar').max = player1.maxhp;
    document.getElementById('HealthBar').value = player1.currenthp;
    document.getElementById('EnemyHealthBar').max = player2.maxhp;
    document.getElementById('EnemyHealthBar').value = player2.currenthp;
    document.getElementById('HealthText').innerHTML = "HP: " + player1.currenthp + "/" + player1.maxhp;
    document.getElementById("ACText").innerText = "AC: " + player1.armor;
    document.getElementById("SpellsText").innerText = "Spell Slots: " + getSpellSlotList();
    document.getElementById("AvailableText").innerText = "Available: " + getAvailableList();

    if (player1.currenthp < 1){
        
        document.getElementById("CombatArea").style.visibility = 'hidden';
        resetPrompt(); 
        document.getElementById("PopWindow").style.visibility = 'visible';
        document.getElementById("EndArea").style.visibility = 'visible';
        
        appendPrompt("You have Died, click below to return to the Main Menu")
    }

    if (player2.currenthp < 1){
        document.getElementById("PopWindow").style.visibility = 'visible';
        document.getElementById("PopWindow").innerHTML = "Congratulations You Completed Level";
    }
}

function getSpellSlotList() {
    let text = "";
    if (player1.spell1 != 0) {
        text += "1:" + player1.spell1 + " "
    }
    if (player1.spell2 != 0) {
        text += "2:" + player1.spell2 + " "
    }
    return text;
}

function getAvailableList() {
    let text = "";
    console.log("actions " + availableAction + " bonus " + availableBonusAction + " spells " + availableSpell);
    for (let i = 0; i < availableAction; i++) {
        text += "A "
    }
    for (let i = 0; i < availableBonusAction; i++) {
        text += "B "
    }
    for (let i = 0; i < availableSpell; i++) {
        text += "S "
    }
    text = text.trimEnd();
    console.log(text);
    return text;
}

