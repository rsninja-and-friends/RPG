const attacks = {
    basic:0,
    slash:1,
    block:2
}

const attacksKeys = Object.keys(attacks);

//OFFENSIVE ATTACKS
function basicAttack(target) {
    player.x += 5;
    if(rectrect(player,fightEnemies[target])) {
        fightEnemies[target].hp -= checkNegative(player.stats.atk - fightEnemies[target].def);
        fightEnemies[target].checkDead();
        curBattleState = bStates.eTurn;
    }   
}

function slash(target) {
    player.x += 10;
    if(rectrect(player,fightEnemies[target])) {
        fightEnemies[target].hp -= checkNegative((player.stats.atk + 1) - fightEnemies[target].def);

        if(fightEnemies.length < target+1) {
            fightEnemies[target+1].hp -= checkNegative((player.stats.atk - 1) - fightEnemies[target].def);
            fightEnemies[target+1].checkDead();
        }
        
        fightEnemies[target].checkDead();

        curBattleState = bStates.eTurn;
    }   
}

//DEFENSIVE ATTACKS
function block() {
    player.stats.def += 2;
    player.boosts.def = 1;
    curBattleState = bStates.eTurn;
}


//OTHER FUNCTIONS
function checkNegative(value) {
    if(value < 0) {
        return 0;
    } else {
        return value;
    }
}