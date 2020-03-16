class BaseWall extends BaseTile { 
    constructor(x,y,type,tileID) {
        super(x,y,type,tileID,layer.wall);
    } 
}

BaseWall.prototype.effect = effects.colliding;