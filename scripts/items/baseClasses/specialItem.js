

class SpecialItem extends BaseItem {
    constructor(name,toolTip,rarity) {
        super(name,toolTip,rarity);
    }
}

SpecialItem.prototype.catagory = catagories.special;