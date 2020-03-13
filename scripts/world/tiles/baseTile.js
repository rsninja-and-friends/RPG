var tiles = [];

var affect = {
    colliding:1,
    speedUp:2
}

class BaseTile {
    constructor(x,y,type,layer) {
        this.x = x;
        this.y = y;
        this.w = 16;
        this.h = 16;
        this.type = type;
        this.layer = layer;
    }
}
BaseTile.prototype.affect = function(entity) {

}

BaseTile.prototype.draw = function() {
    rect(this.x,this.y,this.w,this.h,"white");
}

function drawTiles() {
    for(var i=0;i<tiles.length;i++) {
        tiles[i].draw();
    }
}