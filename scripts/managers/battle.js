//battle states
const bStates = {
    pTurn:0,
    pSelect:1,
    pAnimate:2,
    eTurn:3,
    eAnimate:4
}

//player's default battle position
const defaultPos = {
    x:275,
    y:300
}

var worldEnemies = [];
var fightEnemies = [];

var fightId;

var curBattleState; 
var lastBattleState;
var curAttack;
var curEnemy = 0;
var target;

function handleBattle(isNewState) {
    if(isNewState) {
        toggleBattleUI(true);
        camera.x = 0;
        camera.y = 0;

        player.move(defaultPos.x,defaultPos.y);

        curBattleState = bStates.pTurn;

        player.angle = pi/2;
    }

    updateComponents();
    
    isNewBattleState = false;
    if(curBattleState !== lastBattleState) {
        isNewBattleState = true;
    }
    lastBattleState = curBattleState;

    switch(curBattleState) {
        case bStates.pTurn:
            if(isNewBattleState) {
                battleUI.mainBar.show = true;
                battleUI.pSelect.show = false;
            }
        break;

        case bStates.pSelect:
            if(isNewBattleState) {
                battleUI.mainBar.show = false;
                battleUI.pSelect.show = true;
                battleUI.attackSelect.show = false;
            }
            updateFightEnemies();
        break;

        case bStates.pAnimate:
            handleAnimations();
        break;

        case bStates.eTurn:
            player.move(defaultPos.x,defaultPos.y);

            fightEnemies[curEnemy].selAttack = eAttacks.basic; //fightEnemies[i].attacks[rand(0,fightEnemies[i].length-1)]
            curBattleState = bStates.eAnimate;
            
        break;

        case bStates.eAnimate:
            handleEnemyAnimations();
        break;
    }

}

//performs player's animations. the targeted enemy is passed in
function handleAnimations() {
    switch(curAttack) {
        case attacks.basic:
            basicAttack(target);
        break;
    }
}

//performs current enemy's animations. the current enemy is passed in
function handleEnemyAnimations() {
    switch(fightEnemies[curEnemy].selAttack) {
        case eAttacks.basic:
            eBasicAttack(curEnemy);
        break;
    }
}

function winBattle() {
    
    //some sort of win animation/screen will go here

    player.money += income;
    player.xp += income;
    income = 0;

    let tempPos = {
        x:worldEnemies[fightId].x,
        y:worldEnemies[fightId].y
    };

    worldEnemies.splice(fightId,1);
    player.move(tempPos.x,tempPos.y);
    
    globalState = states.world;
}

//sets attack's target and advanced the battle
function setTarget(targ) {
    target = targ;
    curBattleState = bStates.pAnimate;
}

function drawBattle() {
    player.draw();
    drawEnemies();
}

function drawBattleAbsolute() {
    drawUI();
}