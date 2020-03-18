class wallBrick extends BaseWall {
    constructor(x,y,type,tileID) {
        super(x,y,type,tileID);
        this.imageName = "brick";
    }
}
wallBrick.prototype.typesAmount = 4;