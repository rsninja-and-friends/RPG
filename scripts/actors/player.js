//hp, atk, mp, def, spd

var player;
var playerStats = {
    hp:20,
    atk:2,
    mp:5,
    def:1,
    spd:1
}

class Player {
    
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }

    draw() {
        rect(this.x,this.y,16,16,"red");
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
}

player = new Player(0,0);