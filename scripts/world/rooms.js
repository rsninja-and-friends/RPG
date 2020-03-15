// enum for rooms, each room key name is the name of its JSON file without .json, and its value is its position in the object
var rooms = {
    test: 0,
    default: 1
}

var room = rooms.default;

var roomInfo = {
    width: 0,
    height: 0
}

// draws a rectangle of the room size
function drawRoomLimits() {
    rect(roomInfo.width * 8 - 8, roomInfo.height * 8 - 8, roomInfo.width * 16, roomInfo.height * 16, "#303030");
}

// creates a room of 0.0 with size set in html GUI
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

function loadRoom(room) {
    // get link of json file
    var link = "assets/roomFiles/" + Object.keys(rooms)[room] + ".json";
    // get room file and load from it 
    fetch(link).then((response) => response.json().then((data) => { parseRoom(data); }));
}

// load room from json
function parseRoom(json) {
    tiles = [];
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
}

// download rooms
document.getElementById("name").onkeydown = function (e) {
    if (e.keyCode === k.ENTER) {
        downloadRoom();
    }
}
function downloadRoom() {
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

    // add objects
    roomObj.roomObjects = [];

    // create download link
    var link = document.createElement("a");
    link.download = document.getElementById("name").value;
    var blob = new Blob([JSON.stringify(roomObj, null, "\t")], { type: 'application/json' });
    link.href = URL.createObjectURL(blob);

    // click the link
    var e = document.createEvent("MouseEvents");
    e.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    link.dispatchEvent(e);
}