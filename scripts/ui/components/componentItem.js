class ComponentItem extends BaseComponent {
    constructor(item) {
        super("canvas", function () {
            if (this.shouldMove) {
                this.x = mousePos.x + 1;
                this.y = mousePos.y + 1;
            } else {
                this.shouldMove = true;
            }
        });
        this.element.width = 32;
        this.element.height = 32;
        this.element.style.pointerEvents = "none";
        this.shouldMove = true;
        this.item = item;
        this.class = "UIItem";
        this.renderItem();
    }

    set x(x) {
        this.element.style.left = `${x}px`;
    }
    set y(y) {
        this.element.style.top = `${y}px`;
    }
}

ComponentItem.prototype.renderItem = function() {
    var ctx = this.element.getContext("2d");
    ctx.imageSmoothingEnabled = false
    this.item.draw(ctx, 0, 0, 32, 32);
}