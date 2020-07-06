var buildUIBuilt = false;

var buildSelection = { type: "tile", ID: 0, variance: 0, rotation: 0, menuPos: { x: 0, y: 1 } };

var buildTool = "pen";

var buildLastPos = { x: 0, y: 0 };

var undo = { states: [], pos: -1, lastStep: "forward", lastActionWasEdit: false, bufferSize: 200 };

function handleBuild(isNewState) {
    if (isNewState) {
        // generate build ui
        if (!buildUIBuilt) {
            generateBuildUI();
            buildUIBuilt = true;
        }
    }

    // position selector
    var tableSelStyle = document.getElementById("tableSelection").style;
    tableSelStyle.top = buildSelection.menuPos.y * 43 - 2 + "px";
    tableSelStyle.left = buildSelection.menuPos.x * 42 + "px";

    // select tiles 
    if (keyPress[k.UP]) { if(tileTableValid(0, -1)) {buildSelection.menuPos.y--; pressSelectedTile();} }
    if (keyPress[k.DOWN]) { if(tileTableValid(0, 1)) {buildSelection.menuPos.y++; pressSelectedTile();} }
    if (keyPress[k.LEFT]) { if(tileTableValid(-1, 0)) {buildSelection.menuPos.x--; pressSelectedTile();} }
    if (keyPress[k.RIGHT]) { if(tileTableValid(1, 0)) {buildSelection.menuPos.x++; pressSelectedTile();} }

    // select variance
    var variations = document.getElementById("buildVariations").children[0];
    if(variations !== undefined) {
        for(var i=1,l=variations.children.length;i<10 &&i<=l;i++) {
            if(keyPress[k[i+""]]) {
                variations.children[i-1].children[0].onclick();
            }
        }
    }

    // un focus buttons
    if (mousePress[0]) { [].forEach.call(document.getElementsByTagName("button"), e => { e.blur(); }); }

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
            }
        }

        // place

        // pen
        if (buildTool === "pen") {
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
        
        } else { // bucket
            if (mousePress[0]) {
                // get world width and height
                var ww = worldTiles[0].length;
                var wh = worldTiles.length;

                // get data string of what is to be targeted, and what will replace it;
                var target = worldTiles[mPos.y][mPos.x].data;
                var replace = `${buildSelection.ID}.${buildSelection.variance}.${buildSelection.rotation}`;

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
                            worldIDsRow.push(worldTiles[y][x].data);
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
    switch (buildSelection.type) {
        case "tile":
            worldTiles[y][x] = new tileClasses[tileIDs[buildSelection.ID]](x, y, buildSelection.ID, buildSelection.variance, buildSelection.rotation);
            break;
        case "object":
            worldObjects.push(new objectClasses[objectIDs[buildSelection.ID]](x, y, buildSelection.ID, buildSelection.variance, buildSelection.rotation));
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
    if(buildSelection.menuPos.y + yChange === 0) {
        return false;
    }
    var row = document.getElementById("buildTable").children[buildSelection.menuPos.y + yChange];
    if( row !== undefined) {
        if(row.children[buildSelection.menuPos.x + xChange] === undefined) {
            return false;
        }
    } else {
        return false;
    }
    return true;
}

function pressSelectedTile() {
    document.getElementById("buildTable").children[buildSelection.menuPos.y].children[buildSelection.menuPos.x].children[0].onclick();
}

// pen
document.getElementById("selectPen").onclick = function () {
    buildTool = "pen";
};

// bucket
document.getElementById("selectBucket").onclick = function () {
    buildTool = "bucket";
};

// creates a blank room of grass
document.getElementById("newRoom").onclick = function () {
    if (worldTiles.length !== 0) {
        trackUndo();
    }

    worldTiles = [];
    var w = parseInt(document.getElementById("roomW").value);
    var h = parseInt(document.getElementById("roomH").value);

    for (var y = 0; y < h; y++) {
        var row = [];
        for (var x = 0; x < w; x++) {
            row.push(new TileGrass(x, y, 0, 0, 0));
        }
        worldTiles.push(row);
    }

    centerCameraOn(w * 8, h * 8);
};

// help
document.getElementById("help").onclick = function () {
    var stl = document.getElementById("helpDiv").style;
    stl.display = (stl.display === "block" ? "none" : "block");
};

// go trough everything to be added to build mode, and put it in the build table
function generateBuildUI() {
    var rowLength = 0;
    var tr = document.createElement("tr");

    // tiles
    for (var i = 0; i < tileIDs.length; i++) {

        // create button and set the id to to the id of the tile
        var button = document.createElement("button");
        button.id = "t" + i;
        button.xPos = rowLength
        button.yPos = document.getElementById("buildTable").childNodes.length;
        // set the onclick to switch the active object to the right tile
        button.onclick = function () {
            selectTile(parseInt(this.id[1]));
            buildSelection.menuPos.x = this.xPos;
            buildSelection.menuPos.y = this.yPos;
        };

        // add cell
        tr.appendChild(makeTableCell(button, sprites[tileClasses[tileIDs[i]].prototype.imageName + "0"].spr.src, (tileClasses[tileIDs[i]].prototype.layer ? "#320738" : "#08403a")));

        // once there are 10 cells, create a new row
        rowLength++;
        if (rowLength === 10) {
            document.getElementById("buildTable").appendChild(tr);
            tr = document.createElement("tr");
            rowLength = 0;
        }
    }

    // objects
    for (var i = 0; i < objectIDs.length; i++) {

        // create button and set the id to to the id of the tile
        var button = document.createElement("button");
        button.id = "o" + i;
        button.xPos = rowLength
        button.yPos = document.getElementById("buildTable").childNodes.length;
        // set the onclick to switch the active object to the right tile
        button.onclick = function () {
            selectObject(parseInt(this.id[1]));
            buildSelection.menuPos.x = this.xPos;
            buildSelection.menuPos.y = this.yPos;
        };

        // add cell
        tr.appendChild(makeTableCell(button, sprites[objectClasses[objectIDs[i]].prototype.imageName + "0"].spr.src, "#265917"));

        // once there are 10 cells, create a new row
        rowLength++;
        if (rowLength === 10) {
            document.getElementById("buildTable").appendChild(tr);
            tr = document.createElement("tr");
            rowLength = 0;
        }
    }

    document.getElementById("buildTable").appendChild(tr);

    document.getElementById("build").style.visibility = "visible";
}

function selectTile(tileID) {
    buildSelection.type = "tile";
    buildSelection.ID = tileID;
    buildSelection.variance = 0;
    buildSelection.rotation = 0;

    var tr = document.createElement("tr");

    for (var i = 0, l = tileClasses[tileIDs[tileID]].prototype.typesAmount; i < l; i++) {

        // create button and set the on click to set the correct variance
        var button = document.createElement("button");
        button.id = "v" + i;
        button.style = "width: 34px; height: 34px; padding:0;";
        button.onclick = function () {
            buildSelection.variance = parseInt(this.id[1]);
        };

        // add cell
        tr.appendChild(makeTableCell(button, sprites[tileClasses[tileIDs[tileID]].prototype.imageName + i].spr.src));
    }

    document.getElementById("buildVariations").innerHTML = "";
    document.getElementById("buildVariations").appendChild(tr);
}

function selectObject(objectID) {
    buildSelection.type = "object";
    buildSelection.ID = objectID;
    buildSelection.variance = 0;
    buildSelection.rotation = 0;

    var tr = document.createElement("tr");

    for (var i = 0, l = objectClasses[objectIDs[objectID]].prototype.typesAmount; i < l; i++) {

        // create button and set the on click to set the correct variance
        var button = document.createElement("button");
        button.id = "v" + i;
        button.style = "width: 34px; height: 34px; padding:0;";
        button.onclick = function () {
            buildSelection.variance = parseInt(this.id[1]);
        };

        // add cell
        tr.appendChild(makeTableCell(button, sprites[objectClasses[objectIDs[objectID]].prototype.imageName + i].spr.src));
    }

    document.getElementById("buildVariations").innerHTML = "";
    document.getElementById("buildVariations").appendChild(tr);


}

function makeObjectInput(id, label, type) {
    
}

function makeTableCell(button, image, color="#00000000") {
    // create cell and set background color based on layer
    var td = document.createElement("td");
    td.style.backgroundColor = color;

    // set button style
    button.style = "width: 34px; height: 34px; padding:0;";

    // add image to the button
    var img = document.createElement("img");
    img.style.width = "32px";
    img.style.height = "32px";
    img.src = image;

    // append everything
    button.appendChild(img);
    td.appendChild(button);
    
    return td;
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
        switch (buildSelection.type) {
            case "tile":
                var previewTile = new tileClasses[tileIDs[buildSelection.ID]](buildLastPos.x + Math.cos(drawCount / 10) / 10, buildLastPos.y + Math.sin(drawCount / 10) / 10, buildSelection.ID, buildSelection.variance, buildSelection.rotation);
                previewTile.draw();
                break;
            case "object":
                var previewObject = new objectClasses[objectIDs[buildSelection.ID]](buildLastPos.x + Math.cos(drawCount / 10) / 10, buildLastPos.y + Math.sin(drawCount / 10) / 10, buildSelection.ID, buildSelection.variance, buildSelection.rotation);
                previewObject.draw();
                break;
        }

    }

}

function absoluteDrawBuild() {
    if (buildTool === "pen") {
        img(sprites.buildPen, mousePos.x + 16, mousePos.y + 16, 0, 2, 2);
    } else {
        img(sprites.buildBucket, mousePos.x + 16, mousePos.y, 0, 2, 2);
    }
}