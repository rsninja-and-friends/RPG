
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

// pointer
document.getElementById("selectPointer").onclick = function () {
    buildTool = "pointer";
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

    buildSelection.objectIndex = -1;

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
        button.xPos = rowLength;
        button.yPos = document.getElementById("buildTable").childNodes.length;
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
        button.xPos = rowLength;
        button.yPos = document.getElementById("buildTable").childNodes.length;
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
    buildSelection.menuPos.x = tileID%10; 
    buildSelection.menuPos.y = Math.floor(tileID/10) + 1; 

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

var objectUIDiv = document.getElementById("object");
var objectUIRoomSelect;
var objectUIEnemySelect;

function generateObjectUITemplates() {
    // TODO make options for everything
    objectUIRoomSelect = document.createElement("select");
    objectUIEnemySelect = document.createElement("select");

    var example = document.createElement("option");
    example.innerText = "aa";
    objectUIRoomSelect.appendChild(example);
    example = document.createElement("option");
    example.innerText = "213sdvbvc";
    objectUIRoomSelect.appendChild(example);
}

function generateObjectUI() {
    if(buildSelection.objectIndex !== -1) {
        objectUIDiv.innerHTML = "";

        var metaArgs = (new objectClasses[objectIDs[worldObjects[buildSelection.objectIndex].objectID]]).metaArguments;
        var keys = Object.keys(metaArgs);

        for(var i=0;i<keys.length;i++) {
            makeObjectInput(keys[i], metaArgs[keys[i]], i);
        }
    }
}

function makeObjectInput(label, type, id) {
    var span = document.createElement("span");
    span.innerText = label;
    span.style.paddingRight = "20px";
    objectUIDiv.appendChild(span);
    
    switch(type) {
        case metaFieldTypes.string:
            var input = document.createElement("input");            
            input.type = "text";
            input.id = "objectMeta" + id;
            input.labelName = label;
            objectUIDiv.appendChild(input);
            break;
        case metaFieldTypes.number:
            var input = document.createElement("input");            
            input.type = "number";
            input.id = "objectMeta" + id;
            input.labelName = label;
            objectUIDiv.appendChild(input);
            break;
        case metaFieldTypes.room:
            var select = document.createElement("select");         
            select.innerHTML = objectUIRoomSelect.innerHTML;
            select.id = "objectMeta" + id;
            select.labelName = label;
            objectUIDiv.appendChild(select);
            break;
        case metaFieldTypes.enemy:
            var select = document.createElement("select");            
            select.innerHTML = objectUIEnemySelect.innerHTML;
            select.id = "objectMeta" + id;
            select.labelName = label;
            objectUIDiv.appendChild(select);
            break;
    }

    var brrrrrrrrrrr = document.createElement("br");
    objectUIDiv.appendChild(brrrrrrrrrrr);
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