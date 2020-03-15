class tilePath extends BaseTile {
    constructor(x,y,type,tileID) {
        super(x,y,type,tileID,layer.ground);
    }
}
tilePath.prototype.typesAmount = 1;

tilePath.prototype.affect = function(entity) {
    return affect.speedUp;
}

tilePath.prototype.draw = function() {
    switch(this.type) {
        case 0:
            img(sprites.path0,this.x,this.y);
            break;
    }
}