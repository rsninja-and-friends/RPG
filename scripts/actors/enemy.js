
var worldEnemies = [];
var fightEnemies = [];

class Enemy {
    constructor(x,y,w,h,range) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.range = range;

        //testing purposes
        this.loadout = this;
    }   
}

Enemy.prototype.draw = function() {
    rect(this.x,this.y,this.w,this.h,"blue");
}

Enemy.prototype.update = function() {
    if(dist(this,player) < this.range) {
        //move towards player
    }

    if(rectrect(this,player)) {
        fightEnemies.push(this.loadout);
        globalState = states.battle;
    }
}

Enemy.prototype.move = function(x,y) {
    this.x = x;
    this.y = y;
}

function drawEnemies() {
    for(var i=0;i<worldEnemies.length;i++) {
        worldEnemies[i].draw();
    }
}

function updateEnemies() {
    for(var i=0;i<worldEnemies.length;i++) {
        worldEnemies[i].update();
    }
}

