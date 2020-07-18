class Entity {
    constructor(x,y,w,h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    // if the entity has collided
    get colliding() {
        return false;
    }

    // returns array of all potential collisions
    get collisions() {
        return [];
    }
}