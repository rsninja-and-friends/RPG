var tiles = [];

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
BaseTile.prototype.typesAmount = 1; // amount of tile visual variations

BaseTile.prototype.mergesWith = []; // what tile this with visually merge with

BaseTile.prototype.effect = effects.none; // what effect this tile does

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