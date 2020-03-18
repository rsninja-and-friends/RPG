class tileGrass extends BaseTile {
    constructor(x,y,type,tileID) {
        super(x,y,type,tileID,layer.ground);
        this.imageName = "grass";
    }
}
tileGrass.prototype.typesAmount = 2;
tileGrass.prototype.mergesWith = [0,1];