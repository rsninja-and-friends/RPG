var buildData = {
    inventory: false,
    hotBarPosition: 0,
    position: 0,
    type: 0
};

function handleBuild(isNewState) {
    if (isNewState) {
        // put one of every tile in the inventory
        for (var i = 0; i < tileDefinitions.length; i++) {
            buildModeTiles.push(tileDefinitions[i](0, 17, 0));
        }
        document.getElementById("buildGUI").style.display = "flex";
    }

    // play mode
    if (keyPress[k.BACKSLASH]) {
        document.getElementById("buildGUI").style.display = "none";
        globalState = states.world;
    }

    // camera movement
    if (keyDown[k.a]) { moveCamera(-5 / camera.zoom, 0); }
    if (keyDown[k.d]) { moveCamera(5 / camera.zoom, 0); }
    if (keyDown[k.w]) { moveCamera(0, -5 / camera.zoom); }
    if (keyDown[k.s]) { moveCamera(0, 5 / camera.zoom); }

    if (keyPress[k.EQUALS]) { camera.zoom++; }
    if (keyPress[k.MINUS]) { camera.zoom--; }
    camera.zoom += scroll;

    // inventory toggle
    if (keyPress[k.e]) {
        buildData.inventory = !buildData.inventory;
    }

    // hotbar manipulation
    if(keyDown[k.LEFT]) {buildData.position--;} 
    if(keyDown[k.RIGHT]) {buildData.position++;} 
    if(keyDown[k.UP]) {buildData.type--;}
    if(keyDown[k.DOWN]) {buildData.type++;}
    buildData.position = clamp(buildData.position,0,tileDefinitions.length-1);
    buildData.type = clamp(buildData.type,0,buildModeTiles[buildData.position].typesAmount-1);  
    
    // find mouse position in grid
    var mPos = mousePosition();
    mPos.x = roundToGrid(mPos.x);
    mPos.y = roundToGrid(mPos.y);

    // place block
    if(mouseDown[0]) {
        var xpos = mPos.x/16;
        var ypos = mPos.y/16;
        if(xpos === clamp(xpos,0,tiles[0].length-1) && ypos === clamp(ypos,0,tiles.length-1)) {
            tiles[ypos][xpos] = tileDefinitions[buildData.position](mPos.x,mPos.y,buildData.type);
        }
    }
}

function drawBuild() {
    drawRoomLimits();
    drawTiles();
    player.draw();

    // find mouse position in grid
    var mPos = mousePosition();
    mPos.x = roundToGrid(mPos.x);
    mPos.y = roundToGrid(mPos.y);

    // make tile at mouse position
    mouseTile = tileDefinitions[buildData.position](mPos.x, mPos.y, buildData.type);

    // draw it
    mouseTile.draw();
}

function drawBuildAbsolute() {
    scaleDefault = 2;
    if (buildData.inventory) {

    } else {
        // go through the tiles in the current hotbar, and draw them to the ui
        for (var i = buildData.hotBarPosition * 20; i < buildData.hotBarPosition * 20 + 20; i++) {
            if (buildModeTiles[i] !== undefined) {
                buildModeTiles[i].x = 17 + i * 33;
                if(i === buildData.position) {
                    rect(17 + i * 33,17,18,18,"#555555");
                    buildModeTiles[i].type = buildData.type;
                }
                buildModeTiles[i].draw();
            }
        }
    }
    scaleDefault = 1;
}