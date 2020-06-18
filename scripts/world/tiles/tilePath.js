class tilePath extends BaseTile {
    constructor(x,y,type,tileID) {
        super(x,y,type,tileID,layer.ground);
        this.imageName = "path";
    }
}
tilePath.prototype.typesAmount = 1;

tilePath.prototype.effect = effects.speedUp;

tilePath.prototype.mergesWith = [3];