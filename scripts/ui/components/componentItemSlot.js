class ComponentItemSlot extends BaseComponent {
    constructor() {
        super("div", function () {
            if (this.item !== undefined) {
                this.children[0].show();
            } else {
                if (UIItemHeld !== undefined) {
                    var r = this.rect;
                    if (rectpoint(r, mousePos)) {
                        UIItemHeld.x = r.x;
                        UIItemHeld.y = r.y;
                        UIItemHeld.shouldMove = false;
                    }
                }
            }
        });
        this.width = 32;
        this.height = 32;
        this.item = undefined;
    }

    get rect() {
        var r = this.element.getBoundingClientRect();
        return { x: r.x, y: r.y, w: r.width, h: r.height };
    }
}