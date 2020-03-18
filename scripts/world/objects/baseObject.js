var worldObjects = [];

class baseObject {
    constructor(x,y,w,h,type,definitionKey) {
        this.x = x;
        this.y = y;
        this.h = h;
        this.w = w;
        this.imageName = "debug";
        this.type = type;
        this.definitionKey = definitionKey;
        this.layer = layer.wall;
    }
}

baseObject.prototype.typesAmount = 1; // amount of object visual variations

baseObject.prototype.draw = function() {
    img(sprites[`${this.imageName}${this.type}`],this.x,this.y);
}

baseObject.prototype.compressedDraw = function(ctx,x,y,w,h) {
    ctx.drawImage(sprites[`${this.imageName}${this.type}`].spr,0,0,this.w,this.h,x,y,w,h);
} 

function drawObjects() {
    for(var i=0;i<worldObjects.length;i++) {
        worldObjects[i].draw();
    }
}