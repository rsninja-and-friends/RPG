var worldEnemies = [];
var fightEnemies = [];

const enemyMovementTypes = {
    jump: 0
};

class Enemy extends Entity {
    constructor(x,y,w,h,angle=0) {
        super(x,y,w,h);

        this.angle = angle;

        this.velocity = {x:Math.cos(angle),y:Math.sin(angle)};

        this.drawScale = 1;

        this.updateCount = 0;
    }
}

Enemy.prototype.movementType = enemyMovementTypes.jump;

Enemy.prototype.baseHP = 10;

Enemy.prototype.update = function() {
    var moveX = 0;
    var moveY = 0;

    var cols = this.collisions;
    switch(this.movementType) {
        case enemyMovementTypes.jump:
            var time = this.updateCount % 50;
            this.drawScale = 1;
            if(time < 25) {
                moveX = this.velocity.x * (time<18?1:0.5);
                moveY += this.velocity.y * (time<18?1:0.5);
                this.drawScale = 1 + (Math.sin(time/7.65)/2);
            }
            break;
    }

    this.x += moveX;
    for (var i = 0, l = cols.length; i < l; i++) {
        if (rectrect(this, cols[i])) {
            this.x -= moveX;
            break;
        }
    }

    this.y += moveY;
    for (var i = 0, l = cols.length; i < l; i++) {
        if (rectrect(this, cols[i])) {
            this.y -= moveY;
            break;
        }
    }

    this.updateCount++;
}

Enemy.prototype.draw = function() {
    img(sprites.debug0, this.x, this.y, this.angle, this.drawScale, this.drawScale);
}

function updateEnemies() {
    for(var i=0,l=worldEnemies.length;i<l;i++) {
        worldEnemies[i].update();
    }
}

function drawEnemies() {
    for(var i=0,l=worldEnemies.length;i<l;i++) {
        worldEnemies[i].draw();
    }
}