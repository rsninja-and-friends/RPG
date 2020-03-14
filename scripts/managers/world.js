function handleWorld(isNewState) {
    if(isNewState) {
        buildModeTiles = [];
        camera.zoom = 2;
        
        worldEnemies.push(new Enemy(600,200,32,32,50));
    }
    updateEnemies();
    player.update();

    // build mode
    if(keyPress[k.BACKSLASH]) {
        globalState = states.build;
    }
}

function drawWorld() {
    drawRoomLimits();
    drawTiles();
    drawEnemies();
    player.draw();
}