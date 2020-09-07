class AngryHedge extends Enemy {
    constructor(x, y, variation) {
        super(x, y, 12, 12, variation);
    }
}

AngryHedge.prototype.imageName = "angryHedge";

AngryHedge.prototype.movementType = enemyMovementTypes.walk;

AngryHedge.prototype.baseHP = 10;

enemyClasses.AngryHedge = AngryHedge;
