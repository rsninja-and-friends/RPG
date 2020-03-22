// enum for rooms, each room key name is the name of its JSON file without .json, and its value is its position in the object
var rooms = {
    test: 0,
    default: 1
}

var room = rooms.default;

var roomInfo = {
    width: 0,
    height: 0,
    layers: { // images for each layer
        floor: null,
        walls: null
    }
}

// draws a rectangle of the room size
function drawRoomLimits() {
    rect(roomInfo.width * 8 - 8, roomInfo.height * 8 - 8, roomInfo.width * 16, roomInfo.height * 16, "#303030");
}

function drawBlack() {
    rect(- cw / 4 - 8, roomInfo.height * 8 - 8, cw / 2, ch, "#000000");
    rect((roomInfo.width - 1) * 16 + cw / 4 + 8, roomInfo.height * 8 - 8, cw / 2, ch, "#000000");
    rect(roomInfo.width * 8 - 8, - ch / 4 - 8, cw, ch / 2, "#000000");
    rect(roomInfo.width * 8 - 8, (roomInfo.height - 1) * 16 + ch / 4 + 8, cw, ch / 2, "#000000");
}

// creates a room of 0.0s with size set in html GUI
function addRoom() {
    tiles = [];
    roomInfo.width = document.getElementById("width").value;
    roomInfo.height = document.getElementById("height").value;
    for (var i = 0; i < roomInfo.height; i++) {
        tiles.push([]);
        for (var j = 0; j < roomInfo.width; j++) {
            tiles[i].push(tileDefinitions[0](j * 16, i * 16, 0));
        }
    }
}

function loadRoom(room,id=undefined) {
    document.getElementById("load").style.display = "block";
    globalState = states.loading;
    // get link of json file
    var link = "assets/roomFiles/" + Object.keys(rooms)[room] + ".json";
    // get room file and load from it 
    fetch(link).then((response) => response.json().then((data) => { parseRoom(data,id); }));
}

// export room to json
function getRoomJSON() {
    var roomObj = {};

    // set width and height
    roomObj.width = roomInfo.width;
    roomObj.height = roomInfo.height;

    // add tiles
    var tilesArray = [];
    for (var y = 0; y < tiles.length; y++) {
        var str = "";
        for (var x = 0; x < tiles[0].length; x++) {
            // add id.type
            str += `${tiles[y][x].tileID}.${tiles[y][x].type},`;
        }
        // add string minus last comma
        tilesArray.push(str.substring(0, str.length - 1));
    }
    roomObj.tiles = tilesArray;

    var roomObjcts = [];

    for(var i=0;i<worldObjects.length;i++) {
        var wo = worldObjects[i];
        if(wo.exportArgs !== undefined) {
            roomObjcts.push([wo.definitionKey,wo.x/16,wo.y/16,wo.type,wo.exportArgs()]);
        } else {
            roomObjcts.push([wo.definitionKey,wo.x/16,wo.y/16,wo.type]);
        }
    }

    // add objects
    roomObj.roomObjects = roomObjcts;

    return roomObj;
}

// load room from json
function parseRoom(json,id) {
    tiles = [];
    worldObjects = [];
    roomInfo.width = json.width;
    roomInfo.height = json.height;
    var t = json.tiles;
    // go through array of strings
    for (var y = 0; y < t.length; y++) {
        tiles.push([]);
        // spilt string on commas to get tiles
        tt = t[y].split(",");
        // go through tiles
        for (var x = 0; x < tt.length; x++) {
            // get tileId and type component of string
            var ttt = tt[x].split(".");
            // add tile tileID at x,y with type type
            tiles[y].push(tileDefinitions[parseInt(ttt[0])](x * 16, y * 16, parseInt(ttt[1])));
        }
    }

    var o = json.roomObjects;
    // go through array of strings
    for (var i = 0;i < o.length; i++) {
        var oo = o[i];
        if(oo.length === 4) {
            worldObjects.push(objectDefinitions[oo[0]](oo[1]*16,oo[2]*16,oo[3]));
        } else {
            worldObjects.push(objectDefinitions[oo[0]](oo[1]*16,oo[2]*16,oo[3],oo[4]));
        }
    }

    makeTileLayers();

    player.x = 0;
    player.y = 0;

    if(id !== undefined) {
        for(var i=0;i<worldObjects.length;i++) {
            if(worldObjects[i].constructor.name === "objectRoomLink") {
                if(worldObjects[i].id === id) {
                    player.x = worldObjects[i].x;
                    player.y = worldObjects[i].y;
                }
            }
        }
    }
}

// download rooms
document.getElementById("name").onkeydown = function (e) {
    if (e.keyCode === k.ENTER) {
        downloadRoom();
    }
}
function downloadRoom() {
    var exportObj = getRoomJSON();

    // create download link
    var link = document.createElement("a");
    link.download = document.getElementById("name").value;
    var blob = new Blob([JSON.stringify(exportObj, null, "\t")], { type: "application/json" });
    link.href = URL.createObjectURL(blob);

    // click the link
    var e = document.createEvent("MouseEvents");
    e.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    link.dispatchEvent(e);
}