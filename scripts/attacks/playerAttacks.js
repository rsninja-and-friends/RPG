
const attacks = {
    basic:0,
}


function basicAttack(target) {
    player.x += 5;
    if(rectrect(player,fightEnemies[target])) {
        fightEnemies[target].hp -= player.atk - fightEnemies[target].def;
        curBattleState = bStates.eTurn;
    }   
}