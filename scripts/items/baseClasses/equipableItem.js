const equipTypes = {
    helmet:0,
    chestpiece:1,
    pants:2,
    boots:3,
    gloves:4,
    accessory:5
}

var applyOneOffEffects = false;

class EquipableItem extends BaseItem {
    constructor(name,toolTip,rarity,equipType) {
        super(name,toolTip,rarity);
        this.equipType = equipType;
    }
}

EquipableItem.prototype.applyEffect = function() {
    player.statsMax.hp += 5;
}

EquipableItem.prototype.effectCondition = function() {
    if(applyOneOffEffects) {
        this.applyEffect();
    }
}

EquipableItem.prototype.catagory = catagories.armourAndEquipable;