class WallBrick extends BaseWall {
    constructor(x,y,tileID,variation,rotation=0) {
        super(x,y,tileID,variation,rotation);
    }
}

WallBrick.prototype.imageName = "brick";

WallBrick.prototype.typesAmount = 4;

tileClasses.WallBrick = WallBrick;