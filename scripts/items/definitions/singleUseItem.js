const effectTargets = {
    player: 0,
    enemy: 1,
    enemyAOE: 2
};

const effectTargetsKeys = Object.keys(effectTargets);

class SingleUseItem extends BaseItem {
    constructor(name, toolTip, rarity) {
        super(name, toolTip, rarity);
    }
}

SingleUseItem.prototype.effect = function() {};

SingleUseItem.prototype.attack = attacks.punch;

SingleUseItem.prototype.effectTargets = effectTargets.enemy;

SingleUseItem.prototype.category = catagories.singleUse;