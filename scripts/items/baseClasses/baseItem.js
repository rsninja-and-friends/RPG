const rarities = {
    common:0,
    uncommon:1,
    rare:2,
    epic:3,
    mystical:4,
    special:5
};

const rarityKeys = Object.keys(rarities);

const rarityColors = [
    "#7d7d7d",
    "#f0f0f0",
    "#f7412d",
    "#be00ff",
    "#00cdde",
    "#ded700"
];

const catagories = {
    all:-2,
    none:-1,
    weapon:0,
    singleUse:1,
    loot:2,
    armourAndEquipable:3,
    special:4
};

var itemIdCount = 0;

function getItemPositionById(id) {
    for(var i=0;i<player.inventory.length;i++) {
        if(player.inventory[i].id === id) {
            return i;
        }
    }
}

class BaseItem {
    constructor(name,toolTip,rarity) {
        this.name = name;
        this.toolTip = toolTip;
        this.rarity = rarity;
        this.id = itemIdCount;
        itemIdCount++;
        this.imageName = "debug0";
    }
}

BaseItem.prototype.sell = 0;
BaseItem.prototype.buy = 0;

BaseItem.prototype.category = catagories.none;

BaseItem.prototype.draw = function(ctx,x,y) {
    ctx.drawImage(sprites[this.imageName].spr,x,y);
}