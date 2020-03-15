var tiles = [];
var buildModeTiles = [];

var affect = {
    none:0,
    colliding:1,
    speedUp:2
}

var layer = {
    ground:0,
    wall:1
}

class BaseTile {
    constructor(x,y,type,tileID,layer) {
        this.x = x;
        this.y = y;
        this.w = 16;
        this.h = 16;
        this.tileID  = tileID;
        this.type = type;
        this.layer = layer;
    }
}

BaseTile.prototype.typesAmount = 1;

BaseTile.prototype.affect = function(entity) {

}

BaseTile.prototype.draw = function() {
    rect(this.x,this.y,this.w,this.h,"white");
}

function drawTiles() {
    for(var y=0;y<tiles.length;y++) {
        for(var x=0;x<tiles[0].length;x++) {
            tiles[y][x].draw();
        }
    }
}