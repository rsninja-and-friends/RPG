class Enemy {
    constructor(x,y,w,h,range,loadout) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.range = range;
        this.loadout = loadout;
        
        this.selAttack;
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
        //initiate battle
        let enemyXPos = 400;
        for(let i = 0;i < this.loadout.length;i++) {
            fightEnemies.push(enemyDefinitions[this.loadout[i]](enemyXPos,300));
            enemyXPos += 50;
        }
        globalState = states.battle;
    }
}

Enemy.prototype.move = function(x,y) {
    this.x = x;
    this.y = y;
}

Enemy.prototype.attack = function(type) {
    switch(type) {
        case eAttacks.basic:
            this.x -= 5;
            if(rectrect(player,this)) {
                player.hp -= this.atk - player.def; 
                this.move(this.defaultX,this.defaultY);

                if(curEnemy == fightEnemies.length - 1) {
                    curEnemy = 0;
                    curBattleState = bStates.pTurn;
                } else {
                    curEnemy++;
                    curBattleState = bStates.eTurn;
                }
            }   

        break;


    }
}

Enemy.prototype.checkDead = function() {
    if(this.hp <= 0) {
        //dead stuff
    }
}

function drawEnemies() {
    switch(globalState) {
        case states.world:
            for(let i=0;i<worldEnemies.length;i++) {
                worldEnemies[i].draw();
            }
        break;

        case states.battle:
            for(let i=0;i<fightEnemies.length;i++) {
                fightEnemies[i].draw();
            }
        break;
    }
}

function updateEnemies() {
    for(let i=0;i<worldEnemies.length;i++) {
        worldEnemies[i].update();
    }
}

