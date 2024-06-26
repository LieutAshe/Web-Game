const health = document.getElementById("health");
const exp = document.getElementById("expBar");
const playerName = document.getElementById("playerName");
const nameInputContainer = document.getElementById("nameInput");
const playerNameInput = document.getElementById("playerNameInput");

const enemy = document.getElementById("enemy");
const enemyHealth = document.getElementById("enemyHealth");
const enemyName = document.getElementById("enemyName");
const enemyLevel = document.getElementById("enemyLevel");

const menuOverlay = document.getElementById("menuOverlay");
const overlay = document.getElementById("overlay");
const overlay2 = document.getElementById("overlay2");

var maxLife = 15;
var remainingLife = maxLife;
var currentExp = 0;
var requiredExp = 10;

var Monster = String;
var enemyMaxLife = 5;
var enemyRemainingLife = enemyMaxLife;
var damage = 0;
var inBattle = Boolean;
var wonBattle = Boolean;

var onScreen = {
    name: "Player"
};

function updateOnScreenName() {
    onScreen.name = playerNameInput.value;
    playerName.innerHTML = onScreen.name || "Player";
    console.log(playerNameInput.value);

}

function saveName() {
    nameInputContainer.style.display = "none";
    next.removeAttribute("disabled");
    narrate();
}

function restart(){
    //resetting values
    step = 0;
    flow = "";
    maxLife = 15;
    remainingLife = maxLife;
    overlay2.style.display = "none";
    document.documentElement.style.setProperty('--bg', '#202020');
    document.documentElement.style.setProperty('--bg2', '#423c47');
    
    nameInputContainer.style.display = "block";
    narrations.innerHTML = "";
    enemy.style.opacity = "0%";

    //functions
    lifeLogic();
    resume();
}

function resume(){
    menuOverlay.style.bottom = "-500px";
    overlay.style.display = "none"
}

function menu() {
    menuOverlay.style.bottom = "500px"
    overlay.style.display = "flex"
}

function gotHit() {
    damage = opponentDamage;
    
    if(remainingLife !== 0) {
    
    remainingLife = remainingLife - damage;
    console.log("Player got hit");
    console.log("Remaining Life:", remainingLife);
    lifeLogic();

    playerName.style.marginLeft = "20px";
    playerName.style.color = "var(--blood)";
    setTimeout(function() {
        playerName.style.marginLeft = "-20px";
    }, 100);
    setTimeout(function() {
        playerName.style.marginLeft = "0px";
    }, 200);

    setTimeout(function() {
        playerName.style.color = "var(--normal)";
    }, 400);

    if (remainingLife === 0) {
        console.log("Player Died");
    }
    }

    if (remainingLife === 0) {
        console.log("Player already died, game over");
    }
}

function gotHealed() {
    if (remainingLife !== 0 && remainingLife !== maxLife) {
    remainingLife = remainingLife + 1;
    console.log("Player gained Life");
    console.log("Player Life:", remainingLife);
    lifeLogic();
    }

    if (remainingLife === 0) {
        console.log("Cannot revive a dead")
    }

    if (remainingLife === maxLife) {
        console.log("At full health");
    }
}

function lifeLogic() {
    var lifePercent = remainingLife/maxLife;
    var actualLifePercent = Math.round(lifePercent*100);
        health.style.width = "calc(200px*" + lifePercent + ")";
        health.innerHTML = actualLifePercent + "%";

    if (actualLifePercent <= 20) {
        document.documentElement.style.setProperty('--bg', '#3b0605');
        document.documentElement.style.setProperty('--bg2', '#590a07');
    }

    if (remainingLife <= 0) {
        health.style.width = "0px";
        health.innerHTML = "0%";
        died();
    }
}

function gainedExp() {
    var expGot = Math.floor(Math.random()* (Monster.mLevel - playerLevel + 1)) + playerLevel;
    currentExp = currentExp + expGot;
    console.log(expGot)
    expLogic();
}

function expLogic() {
    var expPercent = currentExp/requiredExp;
    var actualExpPercent = Math.round(expPercent*100);
        exp.style.width = actualExpPercent + "%";

    if (actualExpPercent >= 100) {
        currentExp = 0;
        requiredExp = requiredExp + playerLevel*3 - playerLevel*2;
        playerLevel = playerLevel + 1;
        expLogic();
    }

    if (playerLevel === 99){
        currentExp = 0;
        playerLevel = 99;
    }
    console.log(currentExp + "/" + requiredExp);
    console.log(actualExpPercent);
}

function vsMode () {
    getValues();
    color = "var(--blood)";
    enemyName.style.color = "var(--" + Monster.mType + ")";
    actionResults = "You have encountered an enemy";
    action();
    enemyRemainingLife = enemyMaxLife;
    enemyLifeLogic();
    enemyName.innerHTML = Monster.mName;
    enemyLevel.innerHTML = "Level: " + Monster.mLevel;
    enemyMaxLife = Monster.mHealth;
    enemy.style.opacity = "100%";
}

function enemyGotHit () {
    damage = myDamage;
    enemyName.style.marginLeft = "20px";
    enemyName.style.color = "var(--blood)";
    setTimeout(function() {
        enemyName.style.marginLeft = "-20px";
    }, 100);
    setTimeout(function() {
        enemyName.style.marginLeft = "0px";
    }, 200);

    setTimeout(function() {
        enemyName.style.color = "var(--normal)";
    }, 400);

    if (enemyRemainingLife != 0) {
        enemyRemainingLife = enemyRemainingLife - damage;
    }
    enemyLifeLogic();
}

function enemyHealed () {

}

function enemyLifeLogic () {
    var enemyLifePercent = enemyRemainingLife/enemyMaxLife;
    var enemyActualLifePercent = Math.round(enemyLifePercent*100);
    enemyHealth.style.width = "calc(200px*" + enemyLifePercent + ")";
    enemyHealth.innerHTML = enemyActualLifePercent + "%";

    if (enemyRemainingLife <= 0) {
        enemyHealth.style.width = "0px";
        enemy.style.opacity = "0%";
        wonBattle = true;
        gainedExp();
        storyFlow();
        narrate();
    }
}