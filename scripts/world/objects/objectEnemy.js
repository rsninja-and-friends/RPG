class objectEnemy extends baseObject {
    constructor(x,y,type,defName,args) {
        super(x,y,16,16,type,defName);
        this.enemyType = args[0];
        this.variation = args[1];
        this.imageName = "preview";
        
        this.drawSprite = sprites.preview0;

        if(args[0] !== undefined) {
            this.setSprite();
        }
    }
}
objectEnemy.prototype.exportArgs = function() {
    return [this.enemyType,this.variation];
}

objectEnemy.prototype.draw = function() {
    img(this.drawSprite,this.x,this.y);
}

objectEnemy.prototype.setSprite = function() {
    var tempEnemy = enemyDefinitions[this.enemyType](0,0,0,this.variation);
    this.drawSprite = tempEnemy.getSprite();
}