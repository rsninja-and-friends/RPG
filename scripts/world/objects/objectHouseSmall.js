class objectHouseSmall extends baseObject {
    constructor(x,y,type,defName) {
        super(x,y,64,48,type,defName);
        this.imageName = "houseSmall";
    }
}

objectHouseSmall.prototype.offSetX = 8;

objectHouseSmall.prototype.draw = function() {
    img(sprites[`${this.imageName}${this.type}`],this.x,this.y);
}