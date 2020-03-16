function handleWorld(isNewState) {
    if(isNewState) {
        buildModeTiles = [];
        camera.zoom = 2;


        //test enemy
        worldEnemies.push(new Enemy(250,50,24,24,50,[0,0]));
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