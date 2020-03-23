const slotTypes = {
    equipable:catagories.armourAndEquipable,
    weapon:catagories.weapon
}

class equipmentSquare extends Component {
    constructor(x, y, w, h, slotType, sprite) {
        super(x, y, w, h);
        this.slotType = slotType;
        this.img = sprite.spr;
        this.item = null;
        this.showBackground = false;
    }
}

equipmentSquare.prototype.draw = function() {
    if(inventory.equipSelect === this.position) {
        UIRect(this.x,this.y,this.w,this.h,colors.click);
    }
    UIImageScaled(this.img, this.x, this.y, 2);
    if(this.item !== null) {
        var tempImg = sprites[this.item.imageName].spr;
        UICtx.drawImage(tempImg,0,0,tempImg.width,tempImg.height,this.x,this.y,this.w,this.h);
    }
}

equipmentSquare.prototype.update = function() {
    this.x = this.originalX + this.parent.x;
    this.y = this.originalY + this.parent.y;
    if(componentPoint(this,mousePos)) {
        if(mousePress[0]) {
            inventory.equipSelect = this.position;
        }
    }
}