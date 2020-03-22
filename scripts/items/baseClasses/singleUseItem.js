const effectTargets = {
    player:0,
    enemy:1,
    enemyAOE:2
};

// pass a function that takes an entity into effect
class SingleUseItem extends BaseItem {
    constructor(name,toolTip,rarity,effect,effectType) {
        super(name,toolTip,rarity);
        this.effect = effect;
        this.effectType = effectType;
    }
}

SingleUseItem.prototype.catagory = catagories.singleUse;