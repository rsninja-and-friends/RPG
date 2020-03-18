class VerticalLayout extends Component {
    constructor(x, y, w, h) {
        super(x, y, w, h);
        this.padding = 2;
        this.spacing = 2;
        this.adaptWidth = true;
        this.adaptHeight = true;
    }
}

VerticalLayout.prototype.update = function() {
    let maxW = 10;
    let finalH = this.padding;
    for (let i = 0; i < this.children.length; i++) {
        let c = this.children[i];
        if(!c.absolutePosition) {
            if (c.w > maxW) {
                maxW = c.w;
            }
            c.y = finalH + this.y;
            c.x = this.x + this.padding;
            finalH += c.h + this.spacing;
        }
    }
    if (this.adaptWidth) { this.h = finalH + this.padding - 2; }
    if (this.adaptHeight) { this.w = maxW + this.padding * 2; }
}