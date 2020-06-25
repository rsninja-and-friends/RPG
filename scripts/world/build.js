var buildUIBuilt = false;

var buildSelection = {type:"tile", ID:0, variance:0, rotation:0};

function handleBuild(isNewState) {
    if(isNewState) {
        // generate build ui
        if(!buildUIBuilt) {
            generateBuildUI();
            buildUIBuilt = true;
        }
    }
}

function drawBuild() {

}

// go trough everything to be added to build mode, and put it in the build table
function generateBuildUI() {
    var rowLength = 0;
    var tr = document.createElement("tr");

    // tiles
    for(var i=0;i<tileIDs.length;i++) {
        // create cell and set background color based on layer
        var td = document.createElement("td");
        td.style.backgroundColor = (tileClasses[tileIDs[i]].prototype.layer ? "#320738" : "#08403a" );

        // create button and set the id to to the id of the tile
        var button = document.createElement("button");
        button.id = "t"+i;
        // set the onclick to switch the active object to the right tile
        button.onclick = function() {
            selectTile(parseInt(this.id[1]));
        }

        // add a preview of the tile to the button
        var img = document.createElement("img");
        img.style.width = "32px";
        img.style.height = "32px";
        img.src = sprites[tileClasses[tileIDs[i]].prototype.imageName+"0"].spr.src;

        // append everything
        button.appendChild(img);
        td.appendChild(button);
        tr.appendChild(td);

        // once there are 10 objects, create a new row
        rowLength++;
        if(rowLength === 10) {
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

    var tr = document.createElement("tr");

    for(var i=0,l=tileClasses[tileIDs[tileID]].prototype.typesAmount;i<l;i++) {
        // create cell
        var td = document.createElement("td");

        // create button and set the on click to set the correct variance
        var button = document.createElement("button");
        button.id = "v"+i;
        button.onclick = function() {
            selectVariance(parseInt(this.id[1]));
        }

        // add a preview of the variance
        var img = document.createElement("img");
        img.style.width = "32px";
        img.style.height = "32px";
        img.src = sprites[tileClasses[tileIDs[tileID]].prototype.imageName+i].spr.src;

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