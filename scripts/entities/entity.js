class Entity {
    constructor(x,y,w,h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    // if the entity has collided
    get colliding() {
        var cols = this.collisions;
        for(var i=0,l=cols.length;i<l;i++) {
            if(rectrect(this,cols[i])) {
                return true;
            }
        }
        return false;
    }

    // returns array of all potential collisions
    get collisions() {
        var cols = [...overworldCollisions, player, ...worldEnemies];
        for(var i=0,l=cols.length;i<l;i++) {
            if(cols[i].x === this.x && cols[i].y === this.y) {
                cols.splice(i,1);
                break;
            }
        }
        return cols;
    }
}