class TilePath extends Tile {
    constructor(x, y, tileID, variation, rotation = 0) {
        super(x, y, tileID, variation, rotation);
    }
}

TilePath.prototype.imageName = "path";

TilePath.prototype.effect = effects.speedUp;

TilePath.prototype.mergesWith = [3];

tileClasses.TilePath = TilePath;
