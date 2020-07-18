var player = new Player();

function handleOverWorld(isNewState) {
    if(isNewState) {
        player.x = 100;
        player.y = 100;
    }

    if(keyPress[k.BACKSLASH]) {
        desiredState = states.BUILDING;
        globalState = states.LOADING;
        globalLoading = false;
    }
    
    player.update();
}

function drawOverWorld() {
    var x = worldTiles[0].length * 8;
    var y = worldTiles.length * 8;
    imgIgnoreCutoff({spr:worldLayers.ground,drawLimitSize:0},x,y);
    player.draw();
    imgIgnoreCutoff({spr:worldLayers.walls,drawLimitSize:0},x,y);
    imgIgnoreCutoff({spr:worldLayers.objects,drawLimitSize:0},x,y);

}