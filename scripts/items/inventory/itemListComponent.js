class ItemListComponent extends Component {
    constructor(x, y, w, h) {
        super(x, y, w, h);
        this.backgroundColor = "#00000000";
        this.canv = document.createElement("canvas");
        this.canv.width = w;
        this.canv.height = h;
        this.ctx = this.canv.getContext("2d");
        this.ctx.imageSmoothingEnabled = false;
        this.currentItems = [];
        this.spacing = 34;
    }
}

ItemListComponent.prototype.draw = function() {
    var items = this.currentItems;
    this.ctx.clearRect(0,0,this.w,this.h);
    this.ctx.fillStyle = "#999999";
    this.ctx.font = `8px pixelmix`;

    for(var i=0;i<items.length;i++) {
        // draw hover when hovered
        if(inventory.hoveredItem === i || inventory.selectedItem === i) {
            this.ctx.fillStyle = inventory.selectedItem === i ? colors.click :colors.hover;
            this.ctx.fillRect(0,i*this.spacing,this.w,this.spacing+2);
            this.ctx.fillStyle = "#999999";
        }
        // draw image
        items[i].draw(this.ctx,2,i*this.spacing + 2,32,32);
        // draw name
        if(items[i].name.length > 26) {
            // if name is long, split to 2 lines
            this.ctx.fillText(items[i].name.substring(0,30),40,(i+1)*this.spacing - 16);
            this.ctx.fillText(items[i].name.substring(30,items[i].name.length),40,(i+1)*this.spacing-8);
        } else {
            // if name is short, just draw
            this.ctx.fillText(items[i].name,40,(i+1)*this.spacing - 12);
        }
    }
    // draw list of items to component
    UICtx.drawImage(this.canv,this.x,this.y);
}

ItemListComponent.prototype.update = function() {
    if(inventory.mainComponent.show) {
        var items = player.inventory;
        this.currentItems = [];

        // find what items should be displayed
        for(var i=0;i<items.length;i++) {
            if(items[i].category === inventory.itemViewCategory || inventory.itemViewCategory === catagories.all) {
                this.currentItems.push(items[i]);
            }
        }

    
        items = this.currentItems;
        // deselect
        if((mousePress[0] && mousePos.x < 380) || keyPress[k.ESCAPE]) {
            inventory.selectedItem = null;
            var comp = getComponentById("itemViewer");
            while(comp.children.length>0) {
                comp.children[0].delete();
            }
        }
        // find if items are hovered over
        inventory.hoveredItem = null;
        for(var i=0;i<items.length;i++) {
            if(componentPoint({x:this.x,y:this.y + (i*this.spacing) + 1,w:this.w,h:this.spacing},mousePos)) {
                inventory.hoveredItem = i;
                // handle click
                if(mousePress[0]) {
                    inventory.selectedItem = i;
                    handleSelectedItemUI(this.currentItems[i]);
                }
            }
        }

        // arrow keys
        if(inventory.selectedItem !== null) {
            if(keyPress[k.UP]) {
                if(inventory.selectedItem > 0) {
                    inventory.selectedItem--;
                    handleSelectedItemUI(this.currentItems[inventory.selectedItem]);
                }
            }
            if(keyPress[k.DOWN]) {
                if(inventory.selectedItem < this.currentItems.length-1) {
                    inventory.selectedItem++;
                    handleSelectedItemUI(this.currentItems[inventory.selectedItem]);
                }
            }
        }

        // show/hide equip
        getComponentById("equipButton").show = false;
        if(inventory.equipSelect !== null && inventory.selectedItem !== null) {
            var slot = inventory.equipSlots.children[inventory.equipSelect];
            if(slot.slotType === this.currentItems[inventory.selectedItem].category) {
                getComponentById("equipButton").show = true;
            }
        }
        // show/hide unequip
        getComponentById("unequipButton").show = false;
        if(inventory.equipSelect !== null) {
            var slot = inventory.equipSlots.children[inventory.equipSelect];
            if(slot.item !== null) {
                getComponentById("unequipButton").show = true;
            }
        }
    }
}