function handleWorld(isNewState) {
    if(isNewState) {
        buildModeTiles = [];
        camera.zoom = 2;
    }
    player.update();

    // build mode
    if(keyPress[k.BACKSLASH]) {
        globalState = states.build;
    }
}

function drawWorld() {
    drawRoomLimits();
    drawTiles();
    player.draw();
}