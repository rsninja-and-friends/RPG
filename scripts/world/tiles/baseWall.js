class BaseWall extends BaseTile { 
    constructor(x,y,type,tileID,layer) {
        super(x,y,type,tileID,layer);
    } 
}

BaseWall.prototype.effect = effects.colliding;