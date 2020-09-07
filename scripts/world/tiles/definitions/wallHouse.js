class WallHouse extends BaseWall {
    constructor(x, y, tileID, variation, rotation = 0) {
        super(x, y, tileID, variation, rotation);
    }
}

WallHouse.prototype.imageName = "house";

WallHouse.prototype.typesAmount = 3;

tileClasses.WallHouse = WallHouse;
