const weaponTypes = {
    melee:0,
    ranged:1,
    magic:2,
    shield:3
};

const weaponTypesKeys = Object.keys(weaponTypes);

// pass array of attacks into attackUnlocks
class WeaponItem extends BaseItem {
    constructor(name,toolTip,rarity,weaponType,dmgBoost,attackUnlocks) {
        super(name,toolTip,rarity);
        this.weaponType = weaponType;
        this.dmgBoost = dmgBoost;
        this.attackUnlocks = attackUnlocks;
    }
}

WeaponItem.prototype.category = catagories.weapon;
WeaponItem.prototype.sell = 10;