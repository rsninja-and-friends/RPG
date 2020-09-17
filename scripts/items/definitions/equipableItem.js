const equipTypes = {
    helmet: 0,
    chestpiece: 1,
    pants: 2,
    boots: 3,
    gloves: 4,
    accessory: 5
};

const equipTypesKeys = Object.keys(equipTypes);

class EquipableItem extends BaseItem {
    constructor(name, toolTip, rarity) {
        super(name, toolTip, rarity);
    }
}

EquipableItem.prototype.applyEffect = function () {
    player.stats.hp += 5;
};

EquipableItem.prototype.statCalculation = function () {
    player.stats.atk *= 1.5;
};

EquipableItem.prototype.equipType = equipTypes.chestpiece;

EquipableItem.prototype.category = catagories.armourAndEquipable;
