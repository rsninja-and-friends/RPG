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
    rect(-camera.x + cw/2,-camera.y + ch/2,cw,ch,"#000000");
    drawRoomLimits();
    drawTiles();
    player.draw();
}