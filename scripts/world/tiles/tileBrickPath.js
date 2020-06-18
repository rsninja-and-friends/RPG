class tileBrickPath extends BaseTile {
    constructor(x,y,type,tileID) {
        super(x,y,type,tileID,layer.ground);
        this.imageName = "brickPath";
    }
}
tileBrickPath.prototype.typesAmount = 3;

tileBrickPath.prototype.effect = effects.speedUp;