var tileIDs = [
    "TileGrass",
    "TilePath",
    "TileBrickPath",
    "WallBrick"
];

var tileClasses = {};

const effects = {
    none:0,
    colliding:1,
    speedUp:2
};

const layers = {
    ground:0,
    wall:1
};

function newTile(name,x,y,variation,rotation=0) {
    return new tileClasses[name](x,y,tileIDs.indexOf(name),variation,rotation);
}

class Tile {
    constructor(x,y,tileID,variation,rotation=0) {
        this.x = x;
        this.y = y;
        this.tileID  = tileID;
        this.variation = variation;
        this.rotation = rotation * Math.PI/2;
    }
}

Tile.prototype.w = 16;
Tile.prototype.h = 16;

Tile.prototype.imageName = "debug";

Tile.prototype.typesAmount = 1; // amount of tile visual variations

Tile.prototype.mergesWith = []; // what tile this with visually merge with

Tile.prototype.effect = effects.none; // what effect this tile does

Tile.prototype.layer = layers.ground;

Tile.prototype.draw = function() {
    img(sprites[`${this.imageName}${this.variation}`],this.x,this.y,rotation);
}

tileClasses.Tile = Tile;