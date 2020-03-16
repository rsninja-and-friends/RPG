var tiles = [];
var tilePalette = [];

var effects = {
    none:0,
    colliding:1,
    speedUp:2
};

var layer = {
    ground:0,
    wall:1
};

class BaseTile {
    constructor(x,y,type,tileID,layer) {
        this.x = x;
        this.y = y;
        this.w = 16;
        this.h = 16;
        this.tileID  = tileID;
        this.type = type;
        this.layer = layer;
        this.imageName = "debug";
    }
}

BaseTile.prototype.typesAmount = 1;
BaseTile.prototype.mergesWith = [];

BaseTile.prototype.effect = effects.none;

BaseTile.prototype.draw = function() {
    img(sprites[`${this.imageName}${this.type}`],this.x,this.y);
}

function drawTiles() {
    for(var y=0;y<tiles.length;y++) {
        for(var x=0;x<tiles[0].length;x++) {
            tiles[y][x].draw();
        }
    }
}

function drawTileLayers() {
    imgIgnoreCutoff({spr:roomInfo.layers.floor},roomInfo.width*8-8,roomInfo.height*8-8);
}