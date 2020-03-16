var buildData = {
    inventory: false,
    hotBarPosition: 0,
    position: 0,
    type: 0,
    select: false,
    dropDown: { showing: false },
    mouseTile:null
};

var roomJSON;

function handleBuild(isNewState) {
    if (isNewState) {
        document.getElementById("buildGUI").style.display = "flex";
    }

    // play mode
    if (keyPress[k.BACKSLASH]) {
        roomJSON = getRoomJSON();
        parseRoom(roomJSON);
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
    if (keyPress[k.LEFT]) { buildData.position--; }
    if (keyPress[k.RIGHT]) { buildData.position++; }
    if (keyPress[k.UP]) { buildData.type--; }
    if (keyPress[k.DOWN]) { buildData.type++; }
    buildData.position = clamp(buildData.position, 0, tileDefinitions.length - 1);
    buildData.type = clamp(buildData.type, 0, tilePalette[buildData.position].typesAmount - 1);

    // find mouse position in grid
    var mPos = mousePosition();
    mPos.x = roundToGrid(mPos.x);
    mPos.y = roundToGrid(mPos.y);


    // select tile
    if (mousePress[0]) {
        for (var i = 0; i < 20; i++) {
            if (rectpoint({ x: 18 + 34 * i, y: 18, w: 33, h: 33 }, mousePos)) {
                buildData.position = clamp(i + buildData.hotBarPosition * 20, 0, tileDefinitions.length - 1);
                buildData.select = true;
            }
        }
    }

    // dropDown showing
    if (rectpoint({ x: 18 + 34 * buildData.position, y: 18, w: 33, h: 33 }, mousePos)) {
        var amount = tilePalette[buildData.position].typesAmount;
        if (amount > 1) {
            buildData.dropDown.showing = true;
            buildData.dropDown.x = (18 + buildData.position * 34);
            buildData.dropDown.y = 34 + (34 * amount)/2;
            buildData.dropDown.w = 36;
            buildData.dropDown.h = amount * 34 + 4;
        }
    } else if (!rectpoint(buildData.dropDown, mousePos)) {
        buildData.dropDown.showing = false;
    }

    // type selecting
    if(buildData.dropDown.showing && mousePress[0]) {
        for (var i = 0; i < tilePalette[buildData.position].typesAmount; i++) {
            if (rectpoint({ x: buildData.dropDown.x, y: 52 + i*34, w: 33, h: 33 }, mousePos)) { 
                buildData.type = i;
                buildData.select = true;
            }
        }
    }

    // place tile
    if (mouseDown[0]) {
        if (!buildData.select) {
            var xpos = mPos.x / 16;
            var ypos = mPos.y / 16;
            if (xpos === clamp(xpos, 0, tiles[0].length - 1) && ypos === clamp(ypos, 0, tiles.length - 1)) {
                tiles[ypos][xpos] = tileDefinitions[buildData.position](mPos.x, mPos.y, buildData.type);
            }
        }
    } else {
        buildData.select = false;
    }

    // pick block from world
    if(mousePress[2]) {
        var xpos = mPos.x / 16;
        var ypos = mPos.y / 16;
        if (xpos === clamp(xpos, 0, tiles[0].length - 1) && ypos === clamp(ypos, 0, tiles.length - 1)) {
            buildData.position = tiles[ypos][xpos].tileID;
            buildData.type = tiles[ypos][xpos].type;
        }
    }

    buildData.position = clamp(buildData.position, 0, tileDefinitions.length - 1);
    buildData.type = clamp(buildData.type, 0, tilePalette[buildData.position].typesAmount - 1);
    buildData.mouseTile = tileDefinitions[buildData.position](mPos.x, mPos.y, buildData.type);
}

function drawBuild() {
    drawRoomLimits();
    drawTiles();
    player.draw();

    // find mouse position in grid
    var mPos = mousePosition();
    mPos.x = roundToGrid(mPos.x);
    mPos.y = roundToGrid(mPos.y);

    if(buildData.mouseTile !== null) {
        buildData.mouseTile.draw();
    }
}

function drawBuildAbsolute() {
    scaleDefault = 2;
    if (buildData.inventory) {

    } else {
        // go through the tiles in the current hotbar, and draw them to the ui
        for (var i = buildData.hotBarPosition * 20; i < buildData.hotBarPosition * 20 + 20; i++) {
            if (tilePalette[i] !== undefined) {
                if (i === buildData.position) {
                    rect(18 + i * 34, 18, 36, 36, "#999999");
                    if (buildData.dropDown.showing) {
                        rect(buildData.dropDown.x, buildData.dropDown.y, buildData.dropDown.w, buildData.dropDown.h, "#999999");
                        for (var j = 0; j < tilePalette[i].typesAmount; j++) {
                            tilePalette[i].y = 18 + (j + 1) * 34;
                            tilePalette[i].type = j;
                            tilePalette[i].draw();
                        }
                    }
                    tilePalette[i].type = buildData.type;
                }
                tilePalette[i].x = 18 + i * 34;
                tilePalette[i].y = 18;
                tilePalette[i].draw();
                tilePalette[i].type = 0;
            }
        }
    }
    scaleDefault = 1;
}