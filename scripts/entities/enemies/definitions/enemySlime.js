class Slime extends Enemy {
    constructor(x, y, variation) {
        super(x, y, 14, 14, variation);
    }
}

Slime.prototype.imageName = "slime";

Slime.prototype.movementType = enemyMovementTypes.jump;

Slime.prototype.baseHP = 10;

enemyClasses.Slime = Slime;
