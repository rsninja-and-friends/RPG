

class BasicEnemy extends Enemy {
    constructor(x,y) {
        super(x,y,24,24);

        this.defaultX = x;
        this.defaultY = y;

        this.hp = 5;
        this.atk = 2;
        this.def = 0;
        this.spd = 0;
        this.attacks = [0];
    }
}