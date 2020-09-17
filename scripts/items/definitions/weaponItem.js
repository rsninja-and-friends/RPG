const weaponTypes = {
    melee: 0,
    ranged: 1,
    magic: 2,
    shield: 3
};

const weaponTypesKeys = Object.keys(weaponTypes);

class WeaponItem extends BaseItem {
    constructor(name, toolTip, rarity) {
        super(name, toolTip, rarity);

        this.randomness = rand(-2,2);

        this.stats = {
            hp:0,
            mp:0,
            atk:0,
            int:0,
            def:0
        };

        this.calculateOwnStats();
    }
}

WeaponItem.prototype.weaponType = weaponTypes.melee;

WeaponItem.prototype.attackUnlocks = [attacks.stab];

WeaponItem.prototype.calculateOwnStats = function () {
    this.stats.atk = 5 + this.randomness;
};

WeaponItem.prototype.statCalculation = function () {
    player.stats.atk += 5 + this.randomness;
};

WeaponItem.prototype.category = catagories.weapon;
