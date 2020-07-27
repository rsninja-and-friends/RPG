
function pressSelectedTile() {
    dGet("buildTable").children[buildSelection.menuPos.y].children[buildSelection.menuPos.x].children[0].onclick();
}

// pen
dGet("selectPen").onclick = function () {
    buildTool = "pen";
};

// bucket
dGet("selectBucket").onclick = function () {
    buildTool = "bucket";
};

// pointer
dGet("selectPointer").onclick = function () {
    buildTool = "pointer";
};

dGet("hideShow").onclick = function() {
    if(this.innerText === "hide") {
        dGet("build").style.display = "none";
        this.innerText = "show";
        this.style.left = "10px";
    } else {
        dGet("build").style.display = "block";
        this.innerText = "hide";
        this.style.left = "475px";
    }
}

// creates a blank room of grass
dGet("newRoom").onclick = function () {
    if (worldTiles.length !== 0) {
        trackUndo();
    }

    worldTiles = [];
    worldObjects = [];
    var w = parseInt(dGet("roomW").value);
    var h = parseInt(dGet("roomH").value);

    for (var y = 0; y < h; y++) {
        var row = [];
        for (var x = 0; x < w; x++) {
            row.push(new TileGrass(x, y, 0, 0, 0));
        }
        worldTiles.push(row);
    }

    buildSelection.objectIndex = -1;

    centerCameraOn(w * 8, h * 8);
};

// help
dGet("help").onclick = function () {
    var stl = dGet("helpDiv").style;
    stl.display = (stl.display === "block" ? "none" : "block");
};

// go trough everything to be added to build mode, and put it in the build table
function generateBuildUI() {
    var rowLength = 0;
    var tr = dMake("tr");

    // tiles
    for (var i = 0; i < tileIDs.length; i++) {

        // create button and set the id to to the id of the tile
        var button = dMake("button");
        button.id = "t" + i;
        button.xPos = rowLength;
        button.yPos = dGet("buildTable").childNodes.length;
        // set the onclick to switch the active object to the right tile
        button.onclick = function () {
            buildSelection.menuPos.x = this.xPos;
            buildSelection.menuPos.y = this.yPos;
            selectTile(parseInt(this.id[1]));
        };

        // add cell
        tr.appendChild(makeTableCell(button, sprites[tileClasses[tileIDs[i]].prototype.imageName + "0"].spr.src, (tileClasses[tileIDs[i]].prototype.layer ? "#320738" : "#08403a")));

        // once there are 10 cells, create a new row
        rowLength++;
        if (rowLength === 10) {
            dGet("buildTable").appendChild(tr);
            tr = dMake("tr");
            rowLength = 0;
        }
    }

    // objects
    for (var i = 0; i < objectIDs.length; i++) {

        // create button and set the id to to the id of the tile
        var button = dMake("button");
        button.id = "o" + i;
        button.xPos = rowLength;
        button.yPos = dGet("buildTable").childNodes.length;
        // set the onclick to switch the active object to the right tile
        button.onclick = function () {
            buildSelection.menuPos.x = this.xPos;
            buildSelection.menuPos.y = this.yPos;
            selectObject(parseInt(this.id[1]));
        };

        // add cell
        tr.appendChild(makeTableCell(button, sprites[objectClasses[objectIDs[i]].prototype.imageName + "0"].spr.src, "#265917"));

        // once there are 10 cells, create a new row
        rowLength++;
        if (rowLength === 10) {
            dGet("buildTable").appendChild(tr);
            tr = dMake("tr");
            rowLength = 0;
        }
    }

    dGet("buildTable").appendChild(tr);

    dGet("build").style.visibility = "visible";
}

function selectTile(tileID) {
    buildSelection.type = "tile";
    buildSelection.ID = tileID;
    buildSelection.variance = 0;
    buildSelection.rotation = 0;
    buildSelection.menuPos.x = tileID % 10;
    buildSelection.menuPos.y = Math.floor(tileID / 10) + 1;

    var tr = dMake("tr");

    var tileClass = tileClasses[tileIDs[tileID]];

    for (var i = 0, l = tileClass.prototype.typesAmount; i < l; i++) {

        // create button and set the on click to set the correct variance
        var button = dMake("button");
        button.id = "v" + i;
        button.style = "width: 34px; height: 34px; padding:0;";
        button.onclick = function () {
            buildSelection.variance = parseInt(this.id[1]);
        };

        // add cell
        tr.appendChild(makeTableCell(button, sprites[tileClass.prototype.imageName + i].spr.src));
    }

    dGet("buildVariations").innerHTML = "";
    dGet("buildVariations").appendChild(tr);

    var tileName = tileIDs[tileID];
    var buildInfoString = `id: ${tileID}\n type: tile\n layer: ${tileClass.prototype.layer}\n name: ${tileName}\n merges with: `;
    var tileMerges = tileClass.prototype.mergesWith;
    for (var m = 0; m < tileMerges.length; m++) {
        buildInfoString += tileIDs[tileMerges[m]] + ", ";
    }
    dGet("buildInfo").innerText = buildInfoString;
}

function selectObject(objectID) {
    buildSelection.type = "object";
    buildSelection.ID = objectID;
    buildSelection.variance = 0;
    buildSelection.rotation = 0;

    var tr = dMake("tr");

    var objectClass = objectClasses[objectIDs[objectID]];

    for (var i = 0, l = objectClass.prototype.typesAmount; i < l; i++) {

        // create button and set the on click to set the correct variance
        var button = dMake("button");
        button.id = "v" + i;
        button.style = "width: 34px; height: 34px; padding:0;";
        button.onclick = function () {
            buildSelection.variance = parseInt(this.id[1]);
        };

        // add cell
        tr.appendChild(makeTableCell(button, sprites[objectClass.prototype.imageName + i].spr.src));
    }

    dGet("buildVariations").innerHTML = "";
    dGet("buildVariations").appendChild(tr);

    var buildInfoString = `id: ${objectID}\n type: object\n name: ${objectIDs[objectID]}\n arguments: `;
    var keys = Object.keys(objectClass.prototype.metaArguments);
    for (var m = 0; m < keys.length; m++) {
        buildInfoString += keys[m] + ", ";
    }
    dGet("buildInfo").innerText = buildInfoString;
}

var objectUIDiv = dGet("object");
var objectUIRoomSelect;
var objectUIEnemySelect;

function generateObjectUITemplates() {
    // TODO make options for everything
    objectUIRoomSelect = dMake("select");
    objectUIEnemySelect = dMake("select");

    // generate list of rooms
    for(var i=0;i<rooms.length;i++) {
        var option = dMake("option");
        var lastSlash = rooms[i].lastIndexOf("/");
        option.innerText = lastSlash === -1 ? rooms[i] : rooms[i].substring(lastSlash+1);
        option.value = i;
        objectUIRoomSelect.appendChild(option);
    }
}

function generateObjectUI() {
    if (buildSelection.objectIndex !== -1) {
        objectUIDiv.innerHTML = "";

        var metaArgs = (new objectClasses[objectIDs[worldObjects[buildSelection.objectIndex].objectID]]).metaArguments;
        var keys = Object.keys(metaArgs);

        for (var i = 0; i < keys.length; i++) {
            makeObjectInput(keys[i], metaArgs[keys[i]], i);
        }
    }
}

function makeObjectInput(label, type, id) {
    var span = dMake("span");
    span.innerText = label;
    span.style.paddingRight = "20px";
    objectUIDiv.appendChild(span);

    switch (type) {
        case metaFieldTypes.string:
            var input = dMake("input");
            input.type = "text";
            input.id = "objectMeta" + id;
            input.labelName = label;
            objectUIDiv.appendChild(input);
            break;
        case metaFieldTypes.number:
            var input = dMake("input");
            input.type = "number";
            input.id = "objectMeta" + id;
            input.labelName = label;
            objectUIDiv.appendChild(input);
            break;
        case metaFieldTypes.room:
            var select = dMake("select");
            select.innerHTML = objectUIRoomSelect.innerHTML;
            select.id = "objectMeta" + id;
            select.labelName = label;
            objectUIDiv.appendChild(select);
            break;
        case metaFieldTypes.enemy:
            var select = dMake("select");
            select.innerHTML = objectUIEnemySelect.innerHTML;
            select.id = "objectMeta" + id;
            select.labelName = label;
            objectUIDiv.appendChild(select);
            break;
    }

    var brrrrrrrrrrr = dMake("br");
    objectUIDiv.appendChild(brrrrrrrrrrr);
}

function makeTableCell(button, image, color = "#00000000") {
    // create cell and set background color based on layer
    var td = dMake("td");
    td.style.backgroundColor = color;

    // set button style
    button.style = "width: 34px; height: 34px; padding:0;";

    // add image to the button
    var img = dMake("img");
    img.style.width = "32px";
    img.style.height = "32px";
    img.src = image;

    // append everything
    button.appendChild(img);
    td.appendChild(button);

    return td;
}