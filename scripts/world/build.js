var buildUIBuilt = false;

var buildSelection = { type: "tile", ID: 0, variance: 0, rotation: 0, menuPos: { x: 0, y: 1 }, objectIndex: -1 };

var buildTool = "pen";

var buildLastPos = { x: 0, y: 0 };

var buildRandomizeAngle = false;

var undo = { states: [], pos: -1, lastStep: "forward", lastActionWasEdit: false, bufferSize: 200 };

function handleBuild(isNewState) {
    if (isNewState) {
        canvases.cvs.style.cursor = "none";
        // generate build ui
        if (!buildUIBuilt) {
            generateBuildUI();
            buildUIBuilt = true;
        }
    }
    if (buildSelection.objectIndex === -1) {
        objectUIDiv.innerHTML = "";
    } else {
        if (updateCount % 10 == 0) {
            var argsLength = Object.keys((new objectClasses[objectIDs[worldObjects[buildSelection.objectIndex].objectID]]).metaArguments).length;
            for (var i = 0; i < argsLength; i++) {
                var elem = document.getElementById("objectMeta" + i);
                worldObjects[buildSelection.objectIndex].meta[elem.labelName] = (elem.type === "number" ? parseInt(elem.value) : elem.value);
            }
        }
    }

    buildRandomizeAngle = document.getElementById("randAngle").checked;

    // position selector
    var tableSelStyle = document.getElementById("tableSelection").style;
    tableSelStyle.top = buildSelection.menuPos.y * 43 - 2 + "px";
    tableSelStyle.left = buildSelection.menuPos.x * 42 + "px";

    // select tiles 
    if (keyPress[k.UP]) { if (tileTableValid(0, -1)) { buildSelection.menuPos.y--; pressSelectedTile(); } }
    if (keyPress[k.DOWN]) { if (tileTableValid(0, 1)) { buildSelection.menuPos.y++; pressSelectedTile(); } }
    if (keyPress[k.LEFT]) { if (tileTableValid(-1, 0)) { buildSelection.menuPos.x--; pressSelectedTile(); } }
    if (keyPress[k.RIGHT]) { if (tileTableValid(1, 0)) { buildSelection.menuPos.x++; pressSelectedTile(); } }

    // select variance
    var variations = document.getElementById("buildVariations").children[0];
    if (variations !== undefined) {
        for (var i = 1, l = variations.children.length; i < 10 && i <= l; i++) {
            if (keyPress[k[i + ""]]) {
                variations.children[i - 1].children[0].onclick();
            }
        }
    }

    // un focus html ui
    if (mousePress[0] || keyPress[k.ESCAPE]) { [].forEach.call(document.getElementsByTagName("button"), e => { e.blur(); });[].forEach.call(document.getElementsByTagName("select"), e => { e.blur(); });[].forEach.call(document.getElementsByTagName("input"), e => { e.blur(); }); }

    // camera
    if (keyDown[k.a]) { moveCamera(-5 / camera.zoom, 0); }
    if (keyDown[k.d]) { moveCamera(5 / camera.zoom, 0); }
    if (keyDown[k.w]) { moveCamera(0, -5 / camera.zoom); }
    if (keyDown[k.s]) { moveCamera(0, 5 / camera.zoom); }


    // scroll
    if (scroll && (scroll < 0 ? camera.zoom > 1 : true)) {
        var scrollAmount = 1;
        if (scroll < 0) {
            scrollAmount = -1;
        }

        var factor = 1 - camera.zoom / (camera.zoom + scrollAmount);

        var mPos = mousePosition();
        camera.x -= (mousePos.x - (cw / 2)) * factor;
        camera.y -= (mousePos.y - (ch / 2)) * factor;

        camera.zoom += scrollAmount;
    }

    // rotate 
    if (keyPress[k.q]) {
        if (--buildSelection.rotation < 0) {
            buildSelection.rotation = 3;
        }
    }
    if (keyPress[k.e]) {
        if (++buildSelection.rotation > 3) {
            buildSelection.rotation = 0;
        }
    }

    // switch tools
    if (keyPress[k.x]) { buildTool = "pen"; }
    if (keyPress[k.c]) { buildTool = "bucket"; }
    if (keyPress[k.v] || keyPress[k.ESCAPE]) { buildTool = "pointer"; }

    // delete selected object
    if (keyPress[k.BACKSPACE] || keyPress[k.DELETE] && buildSelection.objectIndex > -1) {
        worldObjects.splice(buildSelection.objectIndex, 1);
        buildSelection.objectIndex--;
    }

    if (worldTiles.length > 0) {
        // center
        if (keyPress[k.SHIFT]) { centerCameraOn((worldTiles[0].length - 1) * 8, (worldTiles.length - 1) * 8); }

        var mPos = mousePosition();
        mPos.x = clamp(roundToGrid(mPos.x) / 16, 0, worldTiles[0].length - 1);
        mPos.y = clamp(roundToGrid(mPos.y) / 16, 0, worldTiles.length - 1);

        // track undo
        if (mousePress[0]) {
            trackUndo();
        }

        // undo
        if (keyPress[k.z]) {
            if (undo.pos > -1) {
                if (undo.lastActionWasEdit) {
                    undo.states.push(JSON.stringify(getRoomObject()));
                } else if (undo.lastStep === "forward") {
                    undo.pos--;
                }
                loadRoomObject(JSON.parse(undo.states[undo.pos]));
                undo.pos--;
                undo.lastStep = "back";
                undo.lastActionWasEdit = false;

                buildSelection.objectIndex = worldObjects.length - 1;
                generateObjectUI();
            }
        }

        // redo
        if (keyPress[k.y]) {
            if (undo.pos < undo.states.length - 1) {
                if (undo.lastStep === "back") {
                    undo.pos++;
                }
                undo.pos++;
                loadRoomObject(JSON.parse(undo.states[undo.pos]));
                undo.lastStep = "forward";
                undo.lastActionWasEdit = false;

                buildSelection.objectIndex = worldObjects.length - 1;
                generateObjectUI();
            }
        }

        // tools
        switch (buildTool) {
            case "pen":
                if (mouseDown[0] && (buildLastPos.x !== mPos.x || buildLastPos.y !== mPos.y) || mousePress[0]) {
                    // if the last mouse position is more than 1 away, make a line between the last and current position
                    if (dist(mPos, buildLastPos) > 1) {
                        var sx = Math.min(buildLastPos.x, mPos.x);
                        var ex = Math.max(buildLastPos.x, mPos.x);
                        var sy = Math.min(buildLastPos.y, mPos.y);
                        var ey = Math.max(buildLastPos.y, mPos.y);

                        for (var y = sy; y <= ey; y++) {
                            for (var x = sx; x <= ex; x++) {
                                if (pDistance(x, y, buildLastPos.x, buildLastPos.y, mPos.x, mPos.y) <= 0.5) {
                                    place(x, y);
                                }
                            }
                        }
                    }
                    // place at the moues position
                    place(mPos.x, mPos.y);
                }
                break;
            case "bucket":
                if (mousePress[0]) {
                    // get world width and height
                    var ww = worldTiles[0].length;
                    var wh = worldTiles.length;

                    // get data string of what is to be targeted, and what will replace it;
                    var type = document.getElementById("fillType").value;
                    var target = worldTiles[mPos.y][mPos.x].data;
                    var replace = `${buildSelection.ID}.${buildSelection.variance}.${buildSelection.rotation}`;

                    if (type === "id") {
                        target = target.split(".")[0];
                    }

                    // if the current tile is not what is hovered
                    if (target !== replace) {

                        // create a list of positions to check
                        var q = [];
                        q.push([mPos.x, mPos.y]);

                        // 2d array of booleans for if the tile has been visited
                        var haveGoneTo = [];
                        // 2d array of tile data
                        var worldIDs = [];
                        for (var y = 0; y < wh; y++) {
                            var haveGoneToRow = [];
                            var worldIDsRow = [];
                            for (var x = 0; x < ww; x++) {
                                haveGoneToRow.push(false);
                                if (type === "id") {
                                    worldIDsRow.push(worldTiles[y][x].data.split(".")[0]);
                                } else {
                                    worldIDsRow.push(worldTiles[y][x].data);
                                }
                            }
                            haveGoneTo.push(haveGoneToRow);
                            worldIDs.push(worldIDsRow);
                        }

                        // decrease width and height so we don't have to the operation every loop
                        ww--;
                        wh--;

                        while (q.length > 0) {
                            // get the last position
                            var n = q.pop();
                            // if it has been visited, go to the next in the list
                            if (haveGoneTo[n[1]][n[0]]) { continue; }
                            // replace the tile
                            worldIDs[n[1]][n[0]] = replace;
                            place(n[0], n[1]);
                            haveGoneTo[n[1]][n[0]] = true;

                            // if any tiles around this one are the target, add them to the list to check
                            if (n[1] < wh) { if (worldIDs[n[1] + 1][n[0]] === target) { q.push([n[0], n[1] + 1]); } }
                            if (n[0] < ww) { if (worldIDs[n[1]][n[0] + 1] === target) { q.push([n[0] + 1, n[1]]); } }
                            if (n[1] > 0) { if (worldIDs[n[1] - 1][n[0]] === target) { q.push([n[0], n[1] - 1]); } }
                            if (n[0] > 0) { if (worldIDs[n[1]][n[0] - 1] === target) { q.push([n[0] - 1, n[1]]); } }
                        }
                    }
                }
                break;
            case "pointer":
                if (mousePress[0]) {
                    var pos = mousePosition();
                    for (var i = 0, l = worldObjects.length; i < l; i++) {
                        if (rectpoint(worldObjects[i], pos)) {
                            buildSelection.objectIndex = i;
                            generateObjectUI();
                        }
                    }
                }
                break;
        }

        // pick
        if (mousePress[2]) {
            var tile = worldTiles[mPos.y][mPos.x];
            buildSelection.type = "tile";
            selectTile(tile.tileID);
            buildSelection.rotation = Math.round(tile.rotation / Math.PI * 2);
            buildSelection.variance = tile.variation;
        }

        buildLastPos = mPos;
    }


}

function place(x, y) {
    var rotCache = buildSelection.rotation;
    if (buildRandomizeAngle) {
        rotCache = rand(0, 3);
    }
    switch (buildSelection.type) {
        case "tile":
            worldTiles[y][x] = new tileClasses[tileIDs[buildSelection.ID]](x, y, buildSelection.ID, buildSelection.variance, rotCache);
            break;
        case "object":
            buildSelection.objectIndex = worldObjects.length;
            worldObjects.push(new objectClasses[objectIDs[buildSelection.ID]](x, y, buildSelection.ID, buildSelection.variance, rotCache));
            generateObjectUI();
            break;
    }
}

function trackUndo() {
    if (undo.pos < undo.states.length - 1) {
        undo.states.length = undo.pos + 1;
    }
    undo.states.push(JSON.stringify(getRoomObject()));
    undo.pos++;
    undo.lastStep = "forward";
    undo.lastActionWasEdit = true;

    if (undo.states.length > undo.bufferSize) {
        undo.states.shift();
        undo.pos--;
    }
}

function tileTableValid(xChange, yChange) {
    if (buildSelection.menuPos.y + yChange === 0) {
        return false;
    }
    var row = document.getElementById("buildTable").children[buildSelection.menuPos.y + yChange];
    if (row !== undefined) {
        if (row.children[buildSelection.menuPos.x + xChange] === undefined) {
            return false;
        }
    } else {
        return false;
    }
    return true;
}

// distance from a line to a point
function pDistance(x, y, x1, y1, x2, y2) {

    var A = x - x1;
    var B = y - y1;
    var C = x2 - x1;
    var D = y2 - y1;

    var dot = A * C + B * D;
    var len_sq = C * C + D * D;
    var param = -1;
    if (len_sq != 0) {
        param = dot / len_sq;
    }

    var xx, yy;

    if (param < 0) {
        xx = x1;
        yy = y1;
    }
    else if (param > 1) {
        xx = x2;
        yy = y2;
    }
    else {
        xx = x1 + param * C;
        yy = y1 + param * D;
    }

    var dx = x - xx;
    var dy = y - yy;
    return Math.sqrt(dx * dx + dy * dy);
}

function drawBuild() {
    // draw tiles
    for (var y = 0, yl = worldTiles.length; y < yl; y++) {
        for (var x = 0, xl = worldTiles[0].length; x < xl; x++) {
            worldTiles[y][x].draw();
        }
    }

    for (var i = 0, l = worldObjects.length; i < l; i++) {
        worldObjects[i].draw();
    }

    if (worldTiles.length > 0) {
        // draw preview

        if (buildTool === "pointer") {
            if (buildSelection.objectIndex > -1) {
                var o = worldObjects[buildSelection.objectIndex];
                var previewObject = new objectClasses[objectIDs[o.objectID]](o.x / 16, o.y / 16, o.objectID, o.variation, o.rotation + Math.cos(drawCount / 10) / 5);
                previewObject.draw();
            }
        } else {
            if (buildSelection.type === "tile") {
                var previewTile = new tileClasses[tileIDs[buildSelection.ID]](buildLastPos.x + Math.cos(drawCount / 10) / 10, buildLastPos.y + Math.sin(drawCount / 10) / 10, buildSelection.ID, buildSelection.variance, buildSelection.rotation);
                previewTile.draw();
            } else {
                var previewObject = new objectClasses[objectIDs[buildSelection.ID]](buildLastPos.x + Math.cos(drawCount / 10) / 10, buildLastPos.y + Math.sin(drawCount / 10) / 10, buildSelection.ID, buildSelection.variance, buildSelection.rotation);
                previewObject.draw();
            }
        }
    }

}

function absoluteDrawBuild() {
    switch (buildTool) {
        case "pen":
            img(sprites.buildPen, mousePos.x + 16, mousePos.y + 16, 0, 2, 2);
            break;
        case "bucket":
            img(sprites.buildBucket, mousePos.x + 16, mousePos.y + 16, 0, 2, 2);
            break;
        case "pointer":
            img(sprites.buildPointer, mousePos.x + 16, mousePos.y + 16, 0, 2, 2);
            break;
    }
}