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

        var attackSelect = getComponentById("attackSelect").children;
        for(let i = 0;i < attackSelect.length;i++) {
            attackSelect[i].show = false;
        }
        attackSelect[0].show = true;
        checkEquips();
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
            handleBoosts();
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

        case attacks.slash:
            slash(target);
        break;

        case attacks.block:
            block();
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

    player.boosts.atk = 0;
    player.boosts.int = 0;
    player.boosts.def = 0;
    
    globalState = states.world;
}

//checks the player's equipped items to show any unlocked attacks
function checkEquips() {
    let equips = inventory.equipSlots.children;
    for(let i = 0;i < equips.length;i++) {
        if(equips[i].slotType == catagories.weapon && equips[i].item !== null) {
            showAttacks(equips[i].item.attackUnlocks);
        }
    }
}

function showAttacks(unlocks) {
    for(let i = 0;i < unlocks.length;i++) {
        getComponentById(attacksKeys[unlocks[i]]).show = true;
    }
}

function handleBoosts() {
    if(player.boosts.atk > 0) {
        player.boosts.atk--;
        if(player.boosts.atk == 0){
            player.stats.atk = player.trueStats.atk;
        }
    }
    
    if(player.boosts.int > 0) {
        player.boosts.int--;
        if(player.boosts.int == 0){
            player.stats.int = player.trueStats.int;
        }
    }
    
    if(player.boosts.def > 0) {
        player.boosts.def--;
        if(player.boosts.def == 0){
            player.stats.def = player.trueStats.def;
        }
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