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
var curAttack;
var curEnemy = 0;
var target;

function handleBattle(isNewState) {
    if(isNewState) {
        camera.x = 0;
        camera.y = 0;

        player.move(defaultPos.x,defaultPos.y);

        curBattleState = bStates.pTurn;
    }

    switch(curBattleState) {
        case bStates.pTurn:
            //basic attack (to be replaced with ui)
            if(keyPress[k.x]) {
                curAttack = attacks.basic;
                curBattleState = bStates.pSelect;
            }
        


        break;

        case bStates.pSelect:
            //to be replaced with ui
            if(keyPress[k["1"]]) {
                setTarget(0);
            }

            if(keyPress[k["2"]] && fightEnemies.length >= 2) {
                setTarget(1);
            }



        break;

        case bStates.pAnimate:
            handleAnimations();
        break;

        case bStates.eTurn:
            player.move(defaultPos.x,defaultPos.y);
            fightEnemies[curEnemy].selAttack = 0 //fightEnemies[i].attacks[rand(0,fightEnemies[i].length-1)]
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

//sets attack's target and advanced the battle
function setTarget(targ) {
    target = targ;
    curBattleState = bStates.pAnimate;
}

function drawBattle() {
    player.draw();
    drawEnemies();
}