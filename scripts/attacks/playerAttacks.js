
const attacks = {
    basic:0,
    test:1
}

const attacksKeys = Object.keys(attacks);


function basicAttack(target) {
    player.x += 5;
    if(rectrect(player,fightEnemies[target])) {
        fightEnemies[target].hp -= player.stats.atk - fightEnemies[target].def;
        fightEnemies[target].checkDead();
        curBattleState = bStates.eTurn;
    }   
}