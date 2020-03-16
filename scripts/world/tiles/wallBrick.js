class wallBrick extends BaseWall {
    constructor(x,y,type,tileID) {
        super(x,y,type,tileID,layer.ground);
        this.imageName = "brick";
    }
}
wallBrick.prototype.typesAmount = 4;