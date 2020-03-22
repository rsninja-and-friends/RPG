const rarities = {
    common:0,
    uncommon:1,
    rare:2,
    epic:3,
    mystical:4,
    special:5
};

const catagories = {
    none:-1,
    weapon:0,
    singleUse:1,
    loot:2,
    armourAndEquipable:3,
    special:4
};

class BaseItem {
    constructor(name,toolTip,rarity) {
        this.name = name;
        this.toolTip = toolTip;
        this.rarity = rarity;
        this.imageName = "debug";
    }
}

BaseItem.prototype.sell = 0;
BaseItem.prototype.buy = 0;

BaseItem.prototype.catagory = catagories.none;

BaseItem.prototype.draw = function(x,y) {
    img(this.imageName,x,y);
}