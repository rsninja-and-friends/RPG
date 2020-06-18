

class BasicEnemy extends Enemy {
    constructor(x,y,id,variation) {
        super(x,y,24,24,0,0,id,variation);

        this.defaultX = x;
        this.defaultY = y;

        this.hp = 5;
        this.atk = 2;
        this.def = 0;
        this.attacks = [0];
        this.value = 3; 
    }
}

BasicEnemy.prototype.name = "slime or something";