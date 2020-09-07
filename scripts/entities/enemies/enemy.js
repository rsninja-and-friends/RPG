var enemyIDs = ["Slime","AngryHedge"];

var enemyClasses = {};

var worldEnemies = [];
var fightEnemies = [];

const enemyMovementTypes = {
    jump: 0,
    walk: 1
};

class Enemy extends Entity {
    constructor(x, y, w, h, variation) {
        super(x, y, w, h);

        this.angle = 0;
        this.speed = 0;
        this.calculateVelocity();

        this.agroed = false;

        this.drawScale = 1;
        this.variation = variation;

        this.updateCount = 0;

        this.spawnerObjectIndex = -1;
    }
}

Enemy.prototype.movementType = enemyMovementTypes.jump;

Enemy.prototype.baseHP = 10;

Enemy.prototype.agroRadius = 200;

Enemy.prototype.imageName = "debug";

Enemy.prototype.baseUpdate = function () {
    if (!this.agroed) {
        if (dist(this, player) < this.agroRadius) {
            this.agroed = true;
        }
    } else {
        var moveX = 0;
        var moveY = 0;

        var cols = this.collisions;
        switch (this.movementType) {
            case enemyMovementTypes.jump:
                this.speed = 1;
                var time = this.updateCount % 50;
                this.drawScale = 1;
                if (time < 25) {
                    moveX = this.velocity.x * (time < 18 ? 1 : 0.5);
                    moveY = this.velocity.y * (time < 18 ? 1 : 0.5);
                    this.drawScale = 1 + Math.sin(time / 7.65) / 2;
                } else {
                    this.angle = turn(this.angle, pointTo(this, player), 0.05);
                    this.calculateVelocity();
                }
                break;
            case enemyMovementTypes.walk:
                this.angle = turn(this.angle, pointTo(this, player), 0.05);
                if(this.speed < 0.8) {
                    this.speed += 0.1;
                }
                this.calculateVelocity();
                moveX = this.velocity.x;
                moveY = this.velocity.y;
                break;
        }

        this.x += moveX;
        for (var i = 0, l = cols.length; i < l; i++) {
            if (rectrect(this, cols[i])) {
                this.x -= moveX;
                if (cols[i].__proto__.constructor.name !== "Object") {
                    cols[i].x += moveX / 2;
                    if(cols[i].colliding) {
                        cols[i].x -= moveX / 2;
                    }
                }
                break;
            }
        }

        this.y += moveY;
        for (var i = 0, l = cols.length; i < l; i++) {
            if (rectrect(this, cols[i])) {
                this.y -= moveY;
                if (cols[i].__proto__.constructor.name !== "Object") {
                    cols[i].y += moveY / 2;
                    if(cols[i].colliding) {
                        cols[i].y -= moveY / 2;
                    }
                }
                break;
            }
        }
    }

    this.updateCount++;

    return false;
};

Enemy.prototype.update = function () {};

Enemy.prototype.calculateVelocity = function () {
    this.velocity = { x: Math.cos(this.angle) * this.speed, y: Math.sin(this.angle) * this.speed };
};

Enemy.prototype.draw = function () {
    imgIgnoreCutoff(sprites[`${this.imageName}${this.variation}`], this.x, this.y, this.angle, this.drawScale, this.drawScale);
};

function updateEnemies() {
    for (var i = 0, l = worldEnemies.length; i < l; i++) {
        if(worldEnemies[i].baseUpdate()) {
            if(worldEnemies[i].spawnerObjectIndex !== -1) {
                worldObjects[worldEnemies[i].spawnerObjectIndex].spawnCount--;
                worldEnemies.splice(i,1);
                i--;
            }
        }
        worldEnemies[i].update();
    }
}

function drawEnemies() {
    for (var i = 0, l = worldEnemies.length; i < l; i++) {
        worldEnemies[i].draw();
    }
}
