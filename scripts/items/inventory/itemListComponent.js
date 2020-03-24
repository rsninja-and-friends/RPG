class ItemListComponent extends Component {
    constructor(x, y, w, h) {
        super(x, y, w, h);
        this.backgroundColor = "#00000000";
        this.canv = document.createElement("canvas");
        this.canv.width = w/2;
        this.canv.height = h/2;
        this.ctx = this.canv.getContext("2d");
        this.currentItems = [];
        this.spacing = 18;
    }
}

ItemListComponent.prototype.draw = function() {
    var items = this.currentItems;
    this.ctx.clearRect(0,0,this.w/2,this.h/2);
    this.ctx.fillStyle = "#999999";
    this.ctx.font = `8px pixelmix`;

    for(var i=0;i<items.length;i++) {
        // draw hover when hovered
        if(inventory.hoveredItem === i || inventory.selectedItem === i) {
            this.ctx.fillStyle = inventory.selectedItem === i ? colors.click :colors.hover;
            this.ctx.fillRect(0,i*this.spacing,this.w/2,this.spacing+2);
            this.ctx.fillStyle = "#999999";
        }
        // draw image
        items[i].draw(this.ctx,2,i*this.spacing + 2);
        // draw name
        if(items[i].name.length > 13) {
            // if name is long, split to 2 lines
            this.ctx.fillText(items[i].name.substring(0,13),19,(i+1)*this.spacing - 8);
            this.ctx.fillText(items[i].name.substring(13,items[i].name.length),19,(i+1)*this.spacing);
        } else {
            // if name is short, just draw
            this.ctx.fillText(items[i].name,19,(i+1)*this.spacing - 4);
        }
    }
    // draw list of items to component
    UICtx.drawImage(this.canv,0,0,this.w/2,this.h/2,this.x,this.y,this.w,this.h);
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
            if(componentPoint({x:this.x*2,y:this.y + (i*this.spacing*2) + 1,w:this.w,h:this.spacing*2},mousePos)) {
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
    }
}