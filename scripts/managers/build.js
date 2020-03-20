var buildData = {
    inventory: false, // looking at inventory of tiles
    hotBarPosition: 0, // what hotbar is being veiwed
    position: 0, // position horizontally in hotbar
    type: 0, // visuals of the tile
    select: false, // if changed tile selection this frame
    dropDown: { showing: false, x: 0, y: 0, w: 0, h: 0 }, // info/collider for type dropdown
    mouseTile: null // what tile to display at cursor
};


var tilePalette = [];
var tilePaletteObjectStartPos;

var roomJSON; // json data for the current room, used when swapping global states

function handleBuild(isNewState) {
    if (isNewState) {
        // show html gui
        document.getElementById("buildGUI").style.display = "flex";

        // generate room link id inputs
        var htmlElem = document.getElementById("linkIDs");
        htmlElem.innerHTML = "";
        for(var i=0;i<worldObjects.length;i++) {
            if(worldObjects[i].constructor.name === "objectRoomLink") {
                addLinkUI(worldObjects[i],i);
                document.getElementById("linkID" + i).value = worldObjects[i].id;
                document.getElementById("linkRoom" + i).value = worldObjects[i].room;
            }
        }
    }

    // play mode
    if (keyPress[k.BACKSLASH]) {
        // remake room from what is in the editor
        roomJSON = getRoomJSON();
        parseRoom(roomJSON);
        // hide html gui
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
    // if (keyPress[k.e]) {
    //     buildData.inventory = !buildData.inventory;
    // }

    // hotbar manipulation
    // position movement
    if (keyPress[k.LEFT]) { buildData.position--; }
    if (keyPress[k.RIGHT]) { buildData.position++; }
    // type selecting
    if (keyPress[k.UP]) { buildData.type--; }
    if (keyPress[k.DOWN]) { buildData.type++; }
    // limit values to what tiles exist
    buildData.position = clamp(buildData.position, 0, tilePalette.length - 1);
    buildData.type = clamp(buildData.type, 0, tilePalette[buildData.position].typesAmount - 1);

    // find mouse position in grid
    var mPos = mousePosition();
    mPos.x = roundToGrid(mPos.x);
    mPos.y = roundToGrid(mPos.y);


    // select tile from hotbar
    if (mousePress[0]) {
        for (var i = 0; i < 20; i++) {
            if (rectpoint({ x: 18 + 34 * i, y: 18, w: 33, h: 33 }, mousePos)) {
                buildData.position = clamp(i + buildData.hotBarPosition * 20, 0, tilePalette.length - 1);
                buildData.select = true;
            }
        }
    }

    // show dropDown on hover 
    if (rectpoint({ x: 18 + 34 * buildData.position, y: 18, w: 33, h: 33 }, mousePos)) {
        var amount = tilePalette[buildData.position].typesAmount;
        if (amount > 1) {
            buildData.dropDown.showing = true;
            buildData.dropDown.x = (18 + buildData.position * 34);
            buildData.dropDown.y = 34 + (34 * amount) / 2;
            buildData.dropDown.w = 36;
            buildData.dropDown.h = amount * 34 + 4;
        }
    } else if (!rectpoint(buildData.dropDown, mousePos)) {
        buildData.dropDown.showing = false;
    }

    // select type from dropdown
    if (buildData.dropDown.showing && mousePress[0]) {
        for (var i = 0; i < tilePalette[buildData.position].typesAmount; i++) {
            if (rectpoint({ x: buildData.dropDown.x, y: 52 + i * 34, w: 33, h: 33 }, mousePos)) {
                buildData.type = i;
                buildData.select = true;
            }
        }
    }

    // place tile
    if (mouseDown[0]) {
        // if a tile wasn't just picked from the hotbar
        if (!buildData.select) {
            var xpos = mPos.x / 16;
            var ypos = mPos.y / 16;
            if (xpos === clamp(xpos, 0, tiles[0].length - 1) && ypos === clamp(ypos, 0, tiles.length - 1)) {
                if(buildData.position < tilePaletteObjectStartPos) {
                    tiles[ypos][xpos] = tileDefinitions[buildData.position](mPos.x, mPos.y, buildData.type);
                } else {
                    if(mousePress[0]) {
                        var func  = objectDefinitions[objDefKeys[buildData.position-tilePaletteObjectStartPos]];
                        if(func.length === 3) {
                            worldObjects.push(func(mPos.x, mPos.y, buildData.type));
                        } else {
                            worldObjects.push(func(mPos.x, mPos.y, buildData.type,[]));
                            // link id inputs
                            if(worldObjects[worldObjects.length-1].constructor.name === "objectRoomLink") {
                                addLinkUI(worldObjects[worldObjects.length-1],worldObjects.length-1);
                            }
                        }
                    }
                }
            }
        }
    } else {
        buildData.select = false;
    }

    // pick block from world
    if (mousePress[2]) {
        var xpos = mPos.x / 16;
        var ypos = mPos.y / 16;
        if (xpos === clamp(xpos, 0, tiles[0].length - 1) && ypos === clamp(ypos, 0, tiles.length - 1)) {
            buildData.position = tiles[ypos][xpos].tileID;
            buildData.type = tiles[ypos][xpos].type;
        }
    }

    // limit values to what tiles exist again because hotbar stuff
    buildData.position = clamp(buildData.position, 0, tilePalette.length - 1);
    buildData.type = clamp(buildData.type, 0, tilePalette[buildData.position].typesAmount - 1);
    // set tile to display at cursor
    if(buildData.position < tilePaletteObjectStartPos) {
        buildData.mouseTile = tileDefinitions[buildData.position](mPos.x, mPos.y, buildData.type);
    } else {
        var func  = objectDefinitions[objDefKeys[buildData.position-tilePaletteObjectStartPos]];
        if(func.length === 3) {
            buildData.mouseTile = func(mPos.x, mPos.y, buildData.type);
        } else {
            buildData.mouseTile = func(mPos.x, mPos.y, buildData.type,[]);
        }
    }

    for(var i=0;i<worldObjects.length;i++) {
        if(worldObjects[i].constructor.name === "objectRoomLink") {
            worldObjects[i].id = parseInt(document.getElementById("linkID" + i).value);
            worldObjects[i].room = document.getElementById("linkRoom" + i).value; 
        }
    }
}

function drawBuild() {
    drawRoomLimits();
    drawTiles();
    drawObjects();
    player.draw();

    if (buildData.mouseTile !== null) {
        buildData.mouseTile.draw();
    }
}

function drawBuildAbsolute() {
    scaleDefault = 2;
    if (buildData.inventory) {
        // show inventory here
    } else {
        rect(cw/2, 18, cw, 36, "#555555");
        // go through the tiles in the current hotbar, and draw them to the ui
        for (var i = buildData.hotBarPosition * 20; i < buildData.hotBarPosition * 20 + 20; i++) {
            if (tilePalette[i] !== undefined) {
                
                if (i === buildData.position) {
                    // highlight selected tile
                    rect(18 + i * 34, 18, 36, 36, "#999999");
                    if (buildData.dropDown.showing) {
                        // draw dropdown background
                        rect(buildData.dropDown.x, buildData.dropDown.y, buildData.dropDown.w, buildData.dropDown.h, "#999999");
                        // draw tile variations in background
                        for (var j = 0; j < tilePalette[i].typesAmount; j++) {
                            tilePalette[i].y = 18 + (j + 1) * 34;
                            tilePalette[i].type = j;
                            if(i<tilePaletteObjectStartPos) {
                                tilePalette[i].draw();
                            } else {
                                tilePalette[i].compressedDraw();
                            }
                        }
                    }
                    tilePalette[i].type = buildData.type;
                }

                // draw tile in pallette
                tilePalette[i].x = 18 + i * 34;
                tilePalette[i].y = 18;
                if(i<tilePaletteObjectStartPos) {
                    tilePalette[i].draw();
                } else {
                    tilePalette[i].compressedDraw();
                }
                tilePalette[i].type = 0;
            }
        }
    }
    scaleDefault = 1;
}