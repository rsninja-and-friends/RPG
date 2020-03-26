const slotTypes = {
    equipable:catagories.armourAndEquipable,
    weapon:catagories.weapon
}

class equipmentSquare extends Component {
    constructor(x, y, w, h, slotType, sprite, equipType = null) {
        super(x, y, w, h);
        this.slotType = slotType;
        this.img = sprite.spr;
        this.item = null;
        this.showBackground = false;
        this.showBorder = false;
        this.equipType = equipType;
    }
}

equipmentSquare.prototype.draw = function() {
    if(inventory.equipSelect === this.position) {
        UIImageScaled(sprites.slotSelect.spr, this.x-2, this.y-2, 2);
    }
    UIImageScaled(sprites.slotFrame.spr, this.x-2, this.y-2, 2);
    UIImageScaled(this.img, this.x-2, this.y-2, 2);
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