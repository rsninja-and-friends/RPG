

class LootItem extends BaseItem {
    constructor(name,toolTip,rarity) {
        super(name,toolTip,rarity);
    }
}

LootItem.prototype.catagory = catagories.loot;