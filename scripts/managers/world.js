function handleWorld(isNewState) {
    if (isNewState) {
        camera.zoom = 2;

        worldEnemies.push(new Enemy(600, 200, 32, 32, 50));
    }
    updateEnemies();
    player.update();

    // build mode
    if (keyPress[k.BACKSLASH]) {
        globalState = states.build;
    }

    camera.zoom += scroll/5;
}

function drawWorld() {
    drawRoomLimits();
    // floor
    if(roomInfo.layers.floor !== null) {imgIgnoreCutoff({spr:roomInfo.layers.floor},roomInfo.width*8-8,roomInfo.height*8-8);}
    drawEnemies();
    player.draw();
    //walls
    if(roomInfo.layers.walls !== null) {imgIgnoreCutoff({spr:roomInfo.layers.walls},roomInfo.width*8-8,roomInfo.height*8-8);}
    drawBlack();
}