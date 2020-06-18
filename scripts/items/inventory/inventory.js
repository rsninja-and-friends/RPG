var inventory = {
    mainComponent:null,
    itemViewCategory: catagories.all,
    itemViewCategoryName: "all",
    hoveredItem:null,
    selectedItem:null,
    equipSelect:null,
    equipSlots:null
};

var itemInvHeadings = [
    ["all",function(){inventory.itemViewCategory = catagories.all;inventory.itemViewCategoryName = "all";}],
    ["equipables",function(){inventory.itemViewCategory = catagories.armourAndEquipable;inventory.itemViewCategoryName = "equipables";}],
    ["weapons",function(){inventory.itemViewCategory = catagories.weapon;inventory.itemViewCategoryName = "weapons";}],
    ["usables",function(){inventory.itemViewCategory = catagories.singleUse;inventory.itemViewCategoryName = "usables";}],
    ["loot",function(){inventory.itemViewCategory = catagories.loot;inventory.itemViewCategoryName = "loot";}],
    ["special",function(){inventory.itemViewCategory = catagories.special;inventory.itemViewCategoryName = "special";}],
    ["misc.",function(){inventory.itemViewCategory = catagories.none;inventory.itemViewCategoryName = "misc.";}]
];

// switches UI in item viewer
function handleSelectedItemUI(item) {
    var comp = getComponentById("itemViewer");
    while(comp.children.length>0) {
        comp.children[0].delete();
    }
    // image
    var tempImg = new ImageComponent(80 - sprites[item.imageName].spr.width*3/2,0,sprites[item.imageName],3);
    tempImg.relativePosition = true;
    comp.addChild(tempImg);
    // rarity
    comp.addChild(new TextComponent(0,0,125,rarityColors[item.rarity],1,returnStr(rarityKeys[item.rarity])));
    // name
    comp.addChild(new TextComponent(0,0,125,"white",2,returnStr(item.name)));
    // sell price
    comp.addChild(new TextComponent(0,0,125,"#ded700",1,returnStr(`sell price: ${item.sell} currency`)));

    // type specific info
    switch(item.category) {
        // weapon
        case catagories.weapon:
            // weapon type
            comp.addChild(new TextComponent(0,0,125,"white",1,returnStr(weaponTypesKeys[item.weaponType])));
            // damage boost
            if(item.weaponType === weaponTypes.magic) {
                comp.addChild(new TextComponent(0,0,125,"#2fbcbd",1,returnStr("damage: +" + item.dmgBoost)));
            } else if(item.weaponType !== weaponTypes.shield) {
                comp.addChild(new TextComponent(0,0,125,"white",1,returnStr("damage: +" + item.dmgBoost)));
            }
            // br
            var br = new Component(0,0,10,10);
            br.show = false;
            comp.addChild(br);
            // attack unlocks
            for(var i=0;i<item.attackUnlocks.length;i++) {
                if( i === 0 ) {
                    comp.addChild(new TextComponent(0,0,125,"white",1,returnStr(`enables attack${item.attackUnlocks.length > 1 ? "s" : ""}:`)));
                }
                comp.addChild(new TextComponent(0,0,125,"white",1,returnStr(attacksKeys[item.attackUnlocks[i]])));
            }
            break;
        // equipables
        case catagories.armourAndEquipable:
            comp.addChild(new TextComponent(0,0,125,"white",1,returnStr(equipTypesKeys[item.equipType])));
            break;
        // single use
        case catagories.singleUse:
            comp.addChild(new TextComponent(0,0,125,"white",1,returnStr("affects: " + effectTargetsKeys[item.effectType])));
            break;
    }

    // tooltip
    var tt = new TextComponent(0,0,125,"white",1,returnStr(item.toolTip));
    tt.showBorder = true;
    comp.addChild(tt);
}

// creates inventory
function makeInventoryUI() {
    inventory.mainComponent = new HorizontalLayout(0,75,0,0);
    inventory.mainComponent.backgroundColor = colors.background + "55";
    inventory.mainComponent.show = false;

        // items section
        var itemsSection = new VerticalLayout(0,0,0,0);
        itemsSection.id = "itemDiv";
        itemsSection.backgroundColor = colors.background + "55";

            // buttons of type selection
            var typeBar = new HorizontalLayout(0,0,0,0);
            typeBar.id = "itemTypeDiv";

                // type buttons
                
                for(var i=0;i<itemInvHeadings.length;i++) {
                    var button = new Button(0,0,itemInvHeadings[i][1]);
                        button.addChild(new TextComponent(0,0,itemInvHeadings[i][0].length*7,"white",1,returnStr(itemInvHeadings[i][0])));
                    typeBar.addChild(button);
                }

            itemsSection.addChild(typeBar);

            // extra options
            var optionsBar = new HorizontalLayout(0,0,0,0);
                optionsBar.addChild(new TextComponent(0,0,150,"#777777",1,function(){return `viewing type: ${inventory.itemViewCategoryName}`}));
            itemsSection.addChild(optionsBar);

            // item list and viewer
            var itemListAndViewer= new HorizontalLayout(0,0,0,0);
            itemListAndViewer.showBackground = false;

                // list of items
                var itemList = new ItemListComponent(0,0,207,400);
                itemList.id = "itemList";
                itemList.showBackground = false;
                itemListAndViewer.addChild(itemList);

                // item viewer
                var itemViewer = new VerticalLayout(0,0,160,400);
                itemViewer.id = "itemViewer";
                itemViewer.adaptHeight = false;
                itemViewer.adaptWidth = false;
                itemViewer.showBackground = false;
                itemListAndViewer.addChild(itemViewer);

            itemsSection.addChild(itemListAndViewer);

        inventory.mainComponent.addChild(itemsSection);

        // equipment section
        var slots = new VerticalLayout(0,0,300,400);
        slots.showBackground = false;
        
            // slots
            inventory.equipSlots = new Component(0,0,300,300);
            inventory.equipSlots.showBackground = false;
            inventory.equipSlots.update = function() {
                if(mousePress[0] && mousePos.x > 380 && mousePos.y < 380 && !componentPoint(getComponentById("equipButton"),mousePos)) {
                    inventory.equipSelect = null;
                }
            }

                // accessory slot 1
                inventory.equipSlots.addChild(new equipmentSquare(248,8,48,48,slotTypes.equipable,sprites.slotAccessory));
                // accessory slot 2
                inventory.equipSlots.addChild(new equipmentSquare(248,68,48,48,slotTypes.equipable,sprites.slotAccessory));
                // accessory slot 3
                inventory.equipSlots.addChild(new equipmentSquare(248,128,48,48,slotTypes.equipable,sprites.slotAccessory));
                // weapon slot 1
                inventory.equipSlots.addChild(new equipmentSquare(8,8,48,48,slotTypes.weapon,sprites.slotWeapon));
                // weapon slot 2
                inventory.equipSlots.addChild(new equipmentSquare(8,68,48,48,slotTypes.weapon,sprites.slotWeapon));
                // head slot
                inventory.equipSlots.addChild(new equipmentSquare(126,38,48,48,slotTypes.equipable,sprites.slotHead,equipTypes.helmet));
                // body slot
                inventory.equipSlots.addChild(new equipmentSquare(126,98,48,48,slotTypes.equipable,sprites.slotBody,equipTypes.chestpiece));
                // legs slot
                inventory.equipSlots.addChild(new equipmentSquare(126,158,48,48,slotTypes.equipable,sprites.slotPants,equipTypes.pants));
                // boots slot
                inventory.equipSlots.addChild(new equipmentSquare(126,218,48,48,slotTypes.equipable,sprites.slotBoots,equipTypes.boots));
                // hands slot
                inventory.equipSlots.addChild(new equipmentSquare(66,128,48,48,slotTypes.equipable,sprites.slotHand,equipTypes.gloves));

            slots.addChild(inventory.equipSlots);

            // equip button
            var but = new Button(0,0,function(){
                var itemList = getComponentById("itemList");
                // get item in list
                var listItem = getItemPositionById(itemList.currentItems[inventory.selectedItem].id);
                // get item in slot
                var slotItemCache = inventory.equipSlots.children[inventory.equipSelect].item;
                // put in slot
                inventory.equipSlots.children[inventory.equipSelect].item = player.inventory[listItem];
                player.inventory.splice(listItem,1);
                // put in list
                if(slotItemCache !== null) {
                    player.inventory.splice(listItem,0,slotItemCache);
                }
                // clear info
                var comp = getComponentById("itemViewer");
                while(comp.children.length>0) {
                    comp.children[0].delete();
                }

                inventory.selectedItem = null;
            });
            but.id = "equipButton";
            but.addChild(new TextComponent(0,0,100,"white",2,function(){return `equip`}));
            slots.addChild(but);

            // unequip button
            but = new Button(0,0,function() {
                // get item in slot
                var slotItemCache = inventory.equipSlots.children[inventory.equipSelect].item;

                // put in list
                player.inventory.push(slotItemCache);

                // remove from slot
                inventory.equipSlots.children[inventory.equipSelect].item = null;
            });
            but.id = "unequipButton";
            but.addChild(new TextComponent(0,0,100,"white",2,function(){return `unequip`}));
            slots.addChild(but);

        inventory.mainComponent.addChild(slots);

    components.push(inventory.mainComponent);
}