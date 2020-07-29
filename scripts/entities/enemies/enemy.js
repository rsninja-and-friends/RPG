var worldEnemies = [];
var fightEnemies = [];

const enemyMovementTypes = {
    jump: 0
};

class Enemy extends Entity {
    constructor(x,y,w,h,angle=0) {
        super(x,y,w,h);

        this.angle = angle;

        this.agroed = false;

        this.velocity = {x:Math.cos(angle),y:Math.sin(angle)};

        this.drawScale = 1;

        this.updateCount = 0;
    }
}

Enemy.prototype.movementType = enemyMovementTypes.jump;

Enemy.prototype.baseHP = 10;

Enemy.prototype.agroRadius = 200;

Enemy.prototype.update = function() {
    if(!this.agroed) {
        if(dist(this,player) < this.agroRadius) {
            this.agroed = true;
        }
    } else {
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
                } else {
                    this.angle = turn(this.angle, pointTo(this,player),0.05);
                    this.velocity = {x:Math.cos(this.angle),y:Math.sin(this.angle)};
                }
                break;
        }

        this.x += moveX;
        for (var i = 0, l = cols.length; i < l; i++) {
            if (rectrect(this, cols[i])) {
                this.x -= moveX;
                if(cols[i].__proto__.constructor.name !== "Object") {
                    cols[i].x += moveX/2;
                }
                break;
            }
        }

        this.y += moveY;
        for (var i = 0, l = cols.length; i < l; i++) {
            if (rectrect(this, cols[i])) {
                this.y -= moveY;
                if(cols[i].__proto__.constructor.name !== "Object") {
                    cols[i].y += moveY/2;
                }
                break;
            }
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