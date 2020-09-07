class TileBrickPath extends Tile {
    constructor(x, y, tileID, variation, rotation = 0) {
        super(x, y, tileID, variation, rotation);
    }
}

TileBrickPath.prototype.imageName = "brickPath";

TileBrickPath.prototype.typesAmount = 3;

TileBrickPath.prototype.effect = effects.speedUp;

tileClasses.TileBrickPath = TileBrickPath;
