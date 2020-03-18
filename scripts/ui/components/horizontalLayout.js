class HorizontalLayout extends Component {
    constructor(x, y, w, h) {
        super(x, y, w, h);
        this.padding = 2;
        this.spacing = 2;
        this.adaptWidth = true;
        this.adaptHeight = true;
    }
}

HorizontalLayout.prototype.update = function() {
    let maxH = 10;
    let finalW = this.padding;
    for (let i = 0; i < this.children.length; i++) {
        let c = this.children[i];
        if(!c.absolutePosition) {
            if (c.h > maxH) {
                maxH = c.h;
            }
            c.x = finalW + this.x;
            c.y = this.y + this.padding;
            finalW += c.w + this.spacing;
        }
    }
    if (this.adaptWidth) { this.w = finalW + this.padding - 2; }
    if (this.adaptHeight) { this.h = maxH + this.padding * 2; }
}