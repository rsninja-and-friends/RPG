var player = new Player();

var overworldCollisions = [];

function handleOverWorld(isNewState) {
    if (keyPress[k.BACKSLASH]) {
        desiredState = states.BUILDING;
        globalState = states.LOADING;
        globalLoading = false;
    }

    if (!cutScene) {
        for (var i = 0, l = worldObjects.length; i < l; i++) {
            worldObjects[i].update();
        }
        player.update();
        updateEnemies();
    }
}

function drawOverWorld() {
    var x = worldTiles[0].length * 8;
    var y = worldTiles.length * 8;
    imgIgnoreCutoff({ spr: worldLayers.ground, drawLimitSize: 0 }, x, y);
    player.draw();
    drawEnemies();
    imgIgnoreCutoff({ spr: worldLayers.walls, drawLimitSize: 0 }, x, y);
    imgIgnoreCutoff({ spr: worldLayers.objects, drawLimitSize: 0 }, x, y);

    // show collision
    // for(var i=0;i<overworldCollisions.length;i++) {
    //     var c = overworldCollisions[i];
    //     rectOutline(c.x,c.y,c.w,c.h);
    // }
}
