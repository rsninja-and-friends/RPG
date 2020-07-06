var worldTiles = [];
var worldObjects = [];

function getRoomObject() {
    var exportObj = {};

    // name
    exportObj.name = document.getElementById("name").value;

    // dimensions
    exportObj.w = worldTiles[0].length;
    exportObj.h = worldTiles.length;

    // tiles
    var tiles = "";
    var xl = worldTiles[0].length;
    for (var y = 0, yl = worldTiles.length; y < yl; y++) {
        for (var x = 0; x < xl; x++) {
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

function loadRoomObject(json) {
    // name
    document.getElementById("name").value = json.name;

    // dimensions
    var w = json.w;
    document.getElementById("roomW").value = json.w;
    var h = json.h;
    document.getElementById("roomH").value = json.h;

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
    if(jsonObjects.length > 0) {
        if(jsonObjects[0].length > 0) {
            for (var i = 0, l = jsonObjects.length; i < l; i++) {
                var data = jsonObjects[i].split(".");
                worldObjects.push(new objectClasses[objectIDs[parseInt(data[2])]](parseInt(data[0]), parseInt(data[1]), parseInt(data[2]), parseInt(data[3]), parseInt(data[4]), JSON.parse(data[5])));
            }
        }
    }
}