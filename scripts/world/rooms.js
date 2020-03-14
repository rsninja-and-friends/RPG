var rooms = {
    default:0
}

var room = rooms.default;

var roomInfo = {
    width:0,
    height:0
}

function drawRoomLimits() {
    rect(roomInfo.width*8-8,roomInfo.height*8-8,roomInfo.width*16,roomInfo.height*16,"#303030");
}

function addRoom() {
    tiles = [];
    roomInfo.width = document.getElementById("width").value;
    roomInfo.height = document.getElementById("height").value;
    for(var i=0;i<roomInfo.height;i++) {
        tiles.push([]);
        for(var j=0;j<roomInfo.width;j++) {
            tiles[i].push(tileDefinitions[0](j*16,i*16,0));
        }
    }
}

function loadRoom(room) {
    // get link of json file
    var link = "scripts/world/roomFiles/" + Object.keys(rooms)[room] + ".json";
    // get room file and load from it 
    fetch(link).then((response) => response.json().then((data) => { parseRoom(data); }));
}

//
function parseRoom(json) {
    tiles = [];
    roomInfo.width = json.width;
    roomInfo.height = json.height;
    var t = json.tiles;
    for(var i=0;i<t.length;i++) {
        tiles.push([]);
        tt = t[i].split(",");
        for(var j=0;j<tt.length;j++) {
            var ttt = tt[j].split(".");
            tiles[i].push(tileDefinitions[parseInt(ttt[0])](j*16,i*16,parseInt(ttt[1])));
        }
    }
}

function downloadRoom() {

}