const weaponTypes = {
    melee:0,
    ranged:1,
    magic:3,
    shield:4
};

// pass array of attacks into attackUnlocks
class WeaponItem extends BaseItem {
    constructor(name,toolTip,rarity,weaponType,dmgBoost,attackUnlocks) {
        super(name,toolTip,rarity);
        this.weaponType = weaponType;
        this.dmgBoost = dmgBoost;
        this.attackUnlocks = attackUnlocks;
    }
}

WeaponItem.prototype.catagory = catagories.weapon;