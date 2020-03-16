//hp, atk, mp, def, spd

var player;

class Player {
    
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.w = 16
        this.h = 16;

        this.hp = 20;
        this.atk = 3;
        this.mp = 5;
        this.def = 1;
        this.spd = 1;
    }

    draw() {
        rect(this.x,this.y,this.w,this.h,"red");
    }

    update() {
        if(keyDown[k.w]) {
            this.y -= 4;
        }
        if(keyDown[k.a]) {
            this.x -= 4;
        }
        if(keyDown[k.s]) {
            this.y += 4;
        } 
        if(keyDown[k.d]) {
            this.x += 4;
        }
        centerCameraOn(this.x,this.y);
    }

    move(x,y) {
        this.x = x;
        this.y = y;
    }
}

player = new Player(0,0);