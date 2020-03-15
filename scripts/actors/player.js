//hp, atk, mp, def, spd

var player;

class Player {

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.angle = 0;
        this.vel = 0;
        this.accel = 0.1;
        this.friction = 0.3;
        this.maxVel = 1.5;
        this.cameraTarget = { x: x, y: y };
        this.stats = {
            hp: 20,
            atk: 2,
            mp: 5,
            def: 1,
            spd: 1
        }
    }

    draw() {
        img(sprites.tempPlayer, this.x, this.y, -this.angle - pi);
    }

    update() {
        // apply force in a direction
        var wasInput = false;

        var angle = 0;
        var divisor = 0;
        // up
        if (keyDown[k.w]) {
            this.vel += this.accel;
            angle -= Math.PI * (keyDown[k.d] ? -1 : 1);
            wasInput = true;
            divisor++;
        }
        // down
        if (keyDown[k.s]) {
            this.vel += this.accel;
            wasInput = true;
            divisor++;
        }
        // left
        if (keyDown[k.a]) {
            this.vel += this.accel;
            wasInput = true;
            angle -= Math.PI / 2;
            divisor++;
        }
        // right
        if (keyDown[k.d]) {
            this.vel += this.accel;
            wasInput = true;
            angle += Math.PI / 2;
            divisor++;
        }
        // determine angle
        divisor = divisor === 0 ? 1 : divisor;
        angle /= divisor;

        // turn towards target angle
        if (wasInput) {
            this.angle = turn(this.angle, angle, 0.2);
        }

        // limit speed
        this.vel = clamp(this.vel, 0, this.maxVel);

        // friction
        if (!wasInput) {
            this.vel = friction(this.vel, this.friction);
        }

        // move
        this.x += Math.sin(this.angle) * this.vel;
        this.y += Math.cos(this.angle) * this.vel;

        // camera movement
        var cameraTargetPosition = { x: this.x, y: this.y };
        if (roomInfo.width <= 25 && roomInfo.height <= 19) {
            cameraTargetPosition.x = roomInfo.width * 8 - 8;
            cameraTargetPosition.y = roomInfo.height * 8 - 8;
        } else {
            if (cameraTargetPosition.x < cw / 2 / camera.zoom) { cameraTargetPosition.x = cw / 2 / camera.zoom; }
            if (cameraTargetPosition.y < ch / 2 / camera.zoom) { cameraTargetPosition.y = ch / 2 / camera.zoom; }
            if (cameraTargetPosition.x > roomInfo.width * 16 - cw / 2 / camera.zoom - 8) { cameraTargetPosition.x = roomInfo.width * 16 - cw / 2 / camera.zoom - 8; }
            if (cameraTargetPosition.y > roomInfo.height * 16 - ch / 2 / camera.zoom - 8) { cameraTargetPosition.y = roomInfo.height * 16 - ch / 2 / camera.zoom - 8; }
        }

        this.cameraTarget.x = lerp(this.cameraTarget.x, cameraTargetPosition.x, 0.1);
        this.cameraTarget.y = lerp(this.cameraTarget.y, cameraTargetPosition.y, 0.1);
        centerCameraOn(this.cameraTarget.x, this.cameraTarget.y);
    }
}

player = new Player(0, 0);