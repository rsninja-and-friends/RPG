var buildUIBuilt = false;

var buildSelection = { type: "tile", ID: 0, variance: 0, rotation: 0 };

var buildTool = "pen";

var buildLastPos;

function handleBuild(isNewState) {
    if (isNewState) {
        // generate build ui
        if (!buildUIBuilt) {
            generateBuildUI();
            buildUIBuilt = true;
        }
    }

    // camera
    if (keyDown[k.a]) { moveCamera(-5 / camera.zoom, 0); }
    if (keyDown[k.d]) { moveCamera(5 / camera.zoom, 0); }
    if (keyDown[k.w]) { moveCamera(0, -5 / camera.zoom); }
    if (keyDown[k.s]) { moveCamera(0, 5 / camera.zoom); }
    camera.zoom += scroll;

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
    if(keyPress[k.z]) {buildTool = "pen";}
    if(keyPress[k.x]) {buildTool = "bucket";}

    if (world.length > 0) {
        var mPos = mousePosition();
        mPos.x = clamp(roundToGrid(mPos.x) / 16, 0, world[0].length - 1);
        mPos.y = clamp(roundToGrid(mPos.y) / 16, 0, world.length - 1);

        // place
        if (mouseDown[0]) {
            // pen
            if (buildTool === "pen") {
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
            } else {
                // bucket

            }
        }
        // pick
        if (mousePress[1]) {
            var tile = world[mPos.y][mPos.x];
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
            world[y][x] = new tileClasses[tileIDs[buildSelection.ID]](x, y, buildSelection.ID, buildSelection.variance, buildSelection.rotation);
            break;
    }
}

function buildSelectPen() {
    buildTool = "pen";
}

function buildSelectBucket() {
    buildTool = "bucket";
}

function drawBuild() {
    // draw tiles
    for (var y = 0, yl = world.length; y < yl; y++) {
        for (var x = 0, xl = world[0].length; x < xl; x++) {
            world[y][x].draw();
        }
    }
    if (world.length > 0) {
        var mPos = mousePosition();
        mPos.x = clamp(roundToGrid(mPos.x) / 16, 0, world[0].length - 1);
        mPos.y = clamp(roundToGrid(mPos.y) / 16, 0, world.length - 1);

        // draw preview
        switch (buildSelection.type) {
            case "tile":
                var previewTile = new tileClasses[tileIDs[buildSelection.ID]](mPos.x + Math.cos(drawCount / 10) / 10, mPos.y + Math.sin(drawCount / 10) / 10, buildSelection.ID, buildSelection.variance, buildSelection.rotation);
                previewTile.draw();
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

// creates a blank room of grass
function newRoom() {
    world = [];
    var w = parseInt(document.getElementById("roomW").value);
    var h = parseInt(document.getElementById("roomH").value);

    for (var y = 0; y < h; y++) {
        var row = [];
        for (var x = 0; x < w; x++) {
            row.push(new TileGrass(x, y, 0, 0, 0));
        }
        world.push(row);
    }
}

// go trough everything to be added to build mode, and put it in the build table
function generateBuildUI() {
    var rowLength = 0;
    var tr = document.createElement("tr");

    // tiles
    for (var i = 0; i < tileIDs.length; i++) {
        // create cell and set background color based on layer
        var td = document.createElement("td");
        td.style.backgroundColor = (tileClasses[tileIDs[i]].prototype.layer ? "#320738" : "#08403a");

        // create button and set the id to to the id of the tile
        var button = document.createElement("button");
        button.id = "t" + i;
        // set the onclick to switch the active object to the right tile
        button.onclick = function () {
            selectTile(parseInt(this.id[1]));
        }

        // add a preview of the tile to the button
        var img = document.createElement("img");
        img.style.width = "32px";
        img.style.height = "32px";
        img.src = sprites[tileClasses[tileIDs[i]].prototype.imageName + "0"].spr.src;

        // append everything
        button.appendChild(img);
        td.appendChild(button);
        tr.appendChild(td);

        // once there are 10 objects, create a new row
        rowLength++;
        if (rowLength === 10) {
            document.getElementById("buildTable").appendChild(tr);
            tr = document.createElement("tr");
        }
    }
    document.getElementById("buildTable").appendChild(tr);

    document.getElementById("build").style.visibility = "visible";
}

function selectTile(tileID) {
    buildSelection.type = "tile";
    buildSelection.ID = tileID;
    buildSelection.variance = 0;

    var tr = document.createElement("tr");

    for (var i = 0, l = tileClasses[tileIDs[tileID]].prototype.typesAmount; i < l; i++) {
        // create cell
        var td = document.createElement("td");

        // create button and set the on click to set the correct variance
        var button = document.createElement("button");
        button.id = "v" + i;
        button.onclick = function () {
            selectVariance(parseInt(this.id[1]));
        }

        // add a preview of the variance
        var img = document.createElement("img");
        img.style.width = "32px";
        img.style.height = "32px";
        img.src = sprites[tileClasses[tileIDs[tileID]].prototype.imageName + i].spr.src;

        // append everything
        button.appendChild(img);
        td.appendChild(button);
        tr.appendChild(td);
    }

    document.getElementById("buildVariations").innerHTML = "";
    document.getElementById("buildVariations").appendChild(tr);
}

function selectVariance(variance) {
    buildSelection.variance = variance;
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