var inventory = {
    mainComponent:null,
    itemViewCategory: catagories.all,
    itemViewCategoryName: "all"
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

            // list of items
            var itemList = new ItemListComponent(0,0,200,400);
            itemsSection.addChild(itemList);

        inventory.mainComponent.addChild(itemsSection);

    components.push(inventory.mainComponent);
}