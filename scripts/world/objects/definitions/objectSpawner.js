class Spawner extends BaseObject {
    constructor(x, y, objectID, variation, rotation = 0, meta = "") {
        super(x, y, objectID, variation, rotation, meta);

        this.spawnCount = 0;
    }
}

Spawner.prototype.imageName = "spawner";

Spawner.prototype.metaArguments = [
    ["enemyType", metaFieldTypes.enemy],
    ["spawnCap", metaFieldTypes.number],
    ["framesBetweenSpawns", metaFieldTypes.number],
    ["range", metaFieldTypes.number]
];

Spawner.prototype.update = function () {
    if (updateCount % this.meta.framesBetweenSpawns === 0 && this.spawnCount < this.meta.spawnCap) {
        var randX = rand(this.x - this.meta.range, this.x + this.meta.range);
        var randY = rand(this.y - this.meta.range, this.y + this.meta.range);
        var enemy = new enemyClasses[enemyIDs[this.meta.enemyType]](randX, randY, 0);

        var spawnAttempts = 0;
        while (enemy.colliding && spawnAttempts < SPAWN_ATTEMPTS_MAX) {
            enemy.x = rand(this.x - this.meta.range, this.x + this.meta.range);
            enemy.y = rand(this.y - this.meta.range, this.y + this.meta.range);
            spawnAttempts++;
        }

        if (spawnAttempts < SPAWN_ATTEMPTS_MAX) {
            enemy.spawnerObjectIndex = worldObjects.indexOf(this);
            worldEnemies.push(enemy);
            this.spawnCount++;
        }
    }
    return false;
};

Spawner.prototype.draw = function () {
    if (!globalLoading) {
        img(sprites[`${this.imageName}${this.variation}`], this.x, this.y, this.rotation);
        img(sprites[`${enemyClasses[enemyIDs[this.meta.enemyType | 0]].prototype.imageName}0`], this.x, this.y, 0, 0.75, 0.75);
        circleOutline(this.x, this.y, this.meta.range, "#ffffff");
    }
};

objectClasses.Spawner = Spawner;
