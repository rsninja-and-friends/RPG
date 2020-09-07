class TileGrass extends Tile {
    constructor(x, y, tileID, variation, rotation = 0) {
        super(x, y, tileID, variation, rotation);
    }
}

TileGrass.prototype.imageName = "grass";

TileGrass.prototype.typesAmount = 2;

TileGrass.prototype.mergesWith = [0, 1, 3];

tileClasses.TileGrass = TileGrass;
