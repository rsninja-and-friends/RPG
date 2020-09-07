class Player extends Entity {
    constructor() {
        super(0, 0, 14, 14);
        this.angle = 0;
        this.vel = 0;
        this.walkCycle = 1;
    }
}

Player.prototype.update = function () {
    // movement
    var wasInput = false;
    var angle = 0;
    var divisor = 0;
    // up
    if (keyDown[k.w]) {
        this.vel += PLAYER_ACCELERATION;
        angle -= Math.PI / 2;
        wasInput = true;
        divisor++;
    }
    // down
    if (keyDown[k.s]) {
        this.vel += PLAYER_ACCELERATION;
        wasInput = true;
        angle += Math.PI / 2;
        divisor++;
    }
    // left
    if (keyDown[k.a]) {
        this.vel += PLAYER_ACCELERATION;
        wasInput = true;
        angle -= Math.PI * (keyDown[k.s] ? -1 : 1);
        divisor++;
    }
    // right
    if (keyDown[k.d]) {
        this.vel += PLAYER_ACCELERATION;
        wasInput = true;

        divisor++;
    }
    // determine angle
    divisor = divisor === 0 ? 1 : divisor;
    angle /= divisor;

    // turn towards target angle
    if (wasInput) {
        this.angle = turn(this.angle, angle, 0.15);
    }

    // limit speed
    this.vel = clamp(this.vel, 0, PLAYER_MAX_VEL);

    // friction
    if (!wasInput) {
        this.vel = friction(this.vel, PLAYER_FRICTION);
    }

    var cols = this.collisions;

    // move x
    this.x += Math.cos(this.angle) * this.vel;
    for (var i = 0, l = cols.length; i < l; i++) {
        if (rectrect(this, cols[i])) {
            this.x -= Math.cos(this.angle) * this.vel;
        }
    }

    // move y
    this.y += Math.sin(this.angle) * this.vel;
    for (var i = 0, l = cols.length; i < l; i++) {
        if (rectrect(this, cols[i])) {
            this.y -= Math.sin(this.angle) * this.vel;
        }
    }

    // increase walk cycle
    this.walkCycle += Math.abs(this.vel / 5);
    // set animation to idle if not moving
    if (this.vel == 0) {
        this.walkCycle = 3;
    }
    // loop cycle
    if (this.walkCycle >= 11) {
        this.walkCycle = 1;
    }

    this.moveCamera();

    this.w = 18;
    this.h = 18;
    for(var i=0,l=worldEnemies.length;i<l;i++) {
        if(rectrect(this, worldEnemies[i])) {
            cutSceneData = i;
            playCutscene(2);
        }
    }
    this.w = 14;
    this.h = 14;
};

Player.prototype.moveCamera = function () {
    camera.zoom = 3;
    var cameraTargetPosition = { x: this.x, y: this.y };

    var w = worldTiles[0].length;
    var h = worldTiles.length;

    // if the room smaller than canvas, set camera to center. Otherwise prevent  camera from going off screen
    if (h * 48 < ch) {
        cameraTargetPosition.y = worldTiles.length * 8;
    } else {
        if (cameraTargetPosition.y < ch / 2 / camera.zoom) {
            cameraTargetPosition.y = ch / 2 / camera.zoom;
        }
        if (cameraTargetPosition.y > h * 16 - ch / 2 / camera.zoom) {
            cameraTargetPosition.y = h * 16 - ch / 2 / camera.zoom;
        }
    }

    // if the room smaller than canvas, set camera to center. Otherwise prevent  camera from going off screen
    if (w * 48 < cw) {
        cameraTargetPosition.x = worldTiles[0].length * 8;
    } else {
        if (cameraTargetPosition.x < cw / 2 / camera.zoom) {
            cameraTargetPosition.x = cw / 2 / camera.zoom;
        }
        if (cameraTargetPosition.x > w * 16 - cw / 2 / camera.zoom) {
            cameraTargetPosition.x = w * 16 - cw / 2 / camera.zoom;
        }
    }

    centerCameraOn(cameraTargetPosition.x, cameraTargetPosition.y);
};

Player.prototype.draw = function () {
    var cycle = Math.floor(this.walkCycle);
    cycle = cycle > 5 ? 11 - cycle : cycle;
    imgIgnoreCutoff(sprites[`player${cycle}`], this.x, this.y, this.angle);
};
