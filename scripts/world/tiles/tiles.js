var tileIDs = [
    "TileGrass",
    "TilePath",
    "TileBrickPath",
    "WallBrick",
    "WallHouse"
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

var tileDataCaches = [];

class Tile {
    constructor(x,y,tileID,variation,rotation=0) {
        this.x = x*16;
        this.y = y*16;
        this.tileID  = tileID;
        this.variation = variation;
        this.rotation = rotation * Math.PI/2;
    }

    get data() {
        var dataStr;
        if(this.rotation !== 0) {
            dataStr = `${this.tileID}.${this.variation}.${~~(this.rotation/halfPI)}`;
        } else if(this.variation !== 0){
            dataStr = `${this.tileID}.${this.variation}`;
        } else {
            dataStr = `${this.tileID}`;
        }
        return dataStr;
    }
    
}

Tile.prototype.w = 16;
Tile.prototype.h = 16;

Tile.prototype.imageName = "debug"; // name of image without number at the end

Tile.prototype.typesAmount = 1; // amount of tile visual variations

Tile.prototype.mergesWith = []; // what tile this with visually merge with

Tile.prototype.effect = effects.none; // what effect this tile does

Tile.prototype.layer = layers.ground;

Tile.prototype.draw = function() {
    img(sprites[`${this.imageName}${this.variation}`],this.x,this.y,this.rotation);
};

tileClasses.Tile = Tile;

// gets the image data for each variation of each tile
function generateTileDataCaches() {
    camera.x = 0;
    camera.y = 0
    camera.angle = 0;
    camera.zoom = 1;
    difx = 0;
    dify = 0;
    absDraw = true;
    for(var i=0;i<tileIDs.length;i++) {
        var arr = [];
        for(var j=0,jl=tileClasses[tileIDs[i]].prototype.typesAmount;j<jl;j++) {
            var t  = new tileClasses[tileIDs[i]](0.5, 0.5, i, j, 0);
            var tileCanvas = dMake("canvas");
            tileCanvas.width = 16;
            tileCanvas.height = 16;
            var tileCtx = tileCanvas.getContext("2d");
            curCtx = tileCtx;
            t.draw();
            arr.push(tileCtx.getImageData(0,0,16,16));
        }
        tileDataCaches.push(arr);
    }
}