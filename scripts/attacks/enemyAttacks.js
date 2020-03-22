
const eAttacks = {
    basic:0,
}

function eBasicAttack(enemy) {
    fightEnemies[enemy].x -= 5;
    if(rectrect(player,fightEnemies[enemy])) {
        player.trueStats.hp -= fightEnemies[enemy].atk - player.stats.def; 
        fightEnemies[enemy].move(fightEnemies[enemy].defaultX,fightEnemies[enemy].defaultY);

        curEnemyCheck();
    }   
}





//checks if all enemies have attacked
function curEnemyCheck() {
    if(curEnemy == fightEnemies.length - 1) {
        curEnemy = 0;
        curBattleState = bStates.pTurn;
    } else {
        curEnemy++;
        curBattleState = bStates.eTurn;
    }
}