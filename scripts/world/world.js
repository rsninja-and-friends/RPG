var worldTiles = [];
var worldObjects = [];

var worldW;
var worldH;

var worldLayers = {
    ground: null,
    walls: null,
    objects: null
};

function getRoomObject() {
    var exportObj = {};

    // name
    exportObj.name = dGet("name").value;

    // dimensions
    exportObj.w = worldTiles[0].length;
    exportObj.h = worldTiles.length;

    // tiles
    var tiles = "";
    for (var y = 0; y < worldH; y++) {
        for (var x = 0; x < worldW; x++) {
            tiles += worldTiles[y][x].data + ",";
        }
    }
    tiles = tiles.substring(0, tiles.length - 1);
    exportObj.tiles = tiles;

    // objects
    var objects = "";
    for (var i = 0, l = worldObjects.length; i < l; i++) {
        objects += worldObjects[i].data + ",";
    }
    objects = objects.substring(0, objects.length - 1);
    exportObj.objects = objects;

    return exportObj;
}

// loads a room, pre renders, and makes collisions
function loadRoom(roomIndex,entranceID="") {
    globalLoading = true;
    fetch(roomBaseDir + rooms[roomIndex]).then((response) => response.json().then((data) => { 
        loadRoomObject(data); 
        renderLayers(); 
        makeRoomCollisions();
        for(var i=0,l=worldObjects.length;i<l;i++) {
            var o = worldObjects[i];
            if(i+1===l) {
                player.x = 100;
                player.y = 100;
            }
            if(o.meta.entranceID === entranceID) {
                player.x = o.x;
                player.y = o.y;
                player.angle = o.rotation;
                player.x += Math.cos(player.angle) * 10;
                player.y += Math.sin(player.angle) * 10;
                break;
            }
        }
        globalLoading = false;
    }));
}

// parses an object to load a room
function loadRoomObject(json) {
    // name
    dGet("name").value = json.name;

    // dimensions
    var w = json.w;
    dGet("roomW").value = json.w;
    worldW = w;
    var h = json.h;
    dGet("roomH").value = json.h;
    worldH = h;

    // tiles
    worldTiles = [];
    var jsonTiles = json.tiles.split(",");
    for (var y = 0; y < h; y++) {
        var row = [];
        for (var x = 0; x < w; x++) {
            var data = jsonTiles[x + y * w].split(".");
            var dl = data.length;
            row.push(new tileClasses[tileIDs[parseInt(data[0])]](x, y, parseInt(data[0]), dl > 1 ? parseInt(data[1]) : 0, dl > 2 ? parseInt(data[2]) : 0));
        }
        worldTiles.push(row);
    }

    worldObjects = [];
    var jsonObjects = json.objects.split(",");
    if (jsonObjects.length > 0) {
        if (jsonObjects[0].length > 0) {
            for (var i = 0, l = jsonObjects.length; i < l; i++) {
                var data = jsonObjects[i].split("~");
                worldObjects.push(new objectClasses[objectIDs[parseInt(data[2])]](parseInt(data[0])+0.5, parseInt(data[1])+0.5, parseInt(data[2]), parseInt(data[3]), parseInt(data[4]), data[5]));
            }
        }
    }
}

// goes through all tiles, and creates collisions for wall tiles
function makeRoomCollisions() {
    overworldCollisions = [];

    // 2d array of booleans for if there is a wall tile
    var wallTiles = [];

    // 2d array of booleans for if a tile has gotten a collision made for it
    var hasCollision = [];

    // fill arrays
    for(var y=0;y<worldH;y++) {
        var wallsRow = [];
        var colRow = [];
        for(var x=0;x<worldW;x++) {
            wallsRow.push(worldTiles[y][x].layer === layers.wall ? true : false);
            colRow.push(false);
        }
        wallTiles.push(wallsRow);
        hasCollision.push(colRow);
    }

    // try to make large rectangles that cover multiple walls to make collision more efficient

    for(var y=0;y<worldH;y++) {
        for(var x=0;x<worldW;x++) {
            if(!hasCollision[y][x] && wallTiles[y][x]) {
                // find right limit
                var xPos = x;
                while(xPos < worldW && wallTiles[y][xPos]) {
                    xPos++;
                }
                xPos--;

                // find bottom limit
                var yPos = y;
                var fullRow = true;
                // go down row by row
                while(yPos < worldH && wallTiles[yPos][xPos] && fullRow) {
                    yPos++;
                    // go through the whole row, make sure it is full
                    var rowX = xPos;
                    while(rowX > -1 && wallTiles[yPos][rowX]) {
                        rowX--;
                    }
                    // if the row is not full, stop
                    if(rowX+1 !== x) {
                        fullRow = false;
                        yPos--;
                    }
                }

                // track what tiles have gotten collision
                for(var y2=y;y2<yPos+1;y2++) {
                    for(var x2=x;x2<xPos+1;x2++) {
                        hasCollision[y2][x2] = true;
                    }
                }

                // find collider dimensions
                var colX = (x+xPos+1)/2;
                var colY = (y+yPos+1)/2;
                var colW = xPos-x+1;
                var colH = yPos-y+1;

                // add collider
                overworldCollisions.push({x:colX*16,y:colY*16,w:colW*16,h:colH*16});
            }
        }
    }
}