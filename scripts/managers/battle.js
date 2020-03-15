
var battleStates = {
    pTurn:0,
    eTurn:1,
    animate:2
}

function handleBattle(isNewState) {
    if(isNewState) {
        player.x = 200;
        player.y = 300;

        let enemyXPos = 500;
        for(let i = 0;i < fightEnemies.length;i++) {
            fightEnemies[i].move(enemyXPos,300);
            enemyXPos += 50;
        }
    }
}