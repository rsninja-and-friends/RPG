class SpawnerSingle extends BaseObject {
    constructor(x, y, objectID, variation, rotation = 0, meta = "") {
        super(x, y, objectID, variation, rotation, meta);
    }
}

SpawnerSingle.prototype.imageName = "spawnerSingle";

SpawnerSingle.prototype.metaArguments = [["enemyType", metaFieldTypes.enemy]];

SpawnerSingle.prototype.initialize = function () {
    worldEnemies.push(new enemyClasses[enemyIDs[this.meta.enemyType]](this.x, this.y, 0));
};

SpawnerSingle.prototype.draw = function () {
    if (!globalLoading) {
        img(sprites[`${this.imageName}${this.variation}`], this.x, this.y, this.rotation);
        img(sprites[`${enemyClasses[enemyIDs[this.meta.enemyType | 0]].prototype.imageName}0`], this.x, this.y, 0, 0.75, 0.75);
        circleOutline(this.x, this.y, this.meta.range, "#ffffff");
    }
};

objectClasses.SpawnerSingle = SpawnerSingle;
