class BaseWall extends Tile { 
    constructor(x,y,tileID,variation,rotation=0) {
        super(x,y,tileID,variation,rotation);
    } 
}

BaseWall.prototype.effect = effects.colliding;

BaseWall.prototype.layer = layers.wall;

tileClasses.BaseWall = BaseWall;