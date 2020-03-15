class tileGrass extends BaseTile {
    constructor(x,y,type,tileID) {
        super(x,y,type,tileID,layer.ground);
    }
}
tileGrass.prototype.typesAmount = 2;

tileGrass.prototype.affect = function(entity) {
    return affect.none;
}

tileGrass.prototype.draw = function() {
    switch(this.type) {
        case 0:
            img(sprites.grass0,this.x,this.y);
            break;
        case 1:
            img(sprites.grass1,this.x,this.y);
            break;
    }
}