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
            fightEnemies[curEnemy].attack(fightEnemies[curEnemy].selAttack);
        break;
    }

}

function handleAnimations() {
    switch(curAttack) {
        case attacks.basic:
            basicAttack(target);
        break;
    }
}

function handleEnemyAnimations() {
    switch(fightEnemies[curEnemy].selAttack) {

    }
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