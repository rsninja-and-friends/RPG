class BaseWall extends BaseTile { 
    constructor(x,y,w,h,c) {
        super(x,y,w,h,c);
    } 
}

BaseWall.prototype.effect = effects.colliding;