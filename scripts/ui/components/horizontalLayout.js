class HorizontalLayout extends Component {
    constructor(x, y, w, h) {
        super(x, y, w, h);
        // space between border and elements
        this.padding = 2;
        // space between elements
        this.spacing = 2;
        // if dimensions should change to fit children
        this.adaptWidth = true;
        this.adaptHeight = true;
    }
}

HorizontalLayout.prototype.update = function() {
    // highest height of all children
    let maxH = 10;
    // width of all children together
    let finalW = this.padding;
    // go through all children
    for (let i = 0; i < this.children.length; i++) {
        let c = this.children[i];
        // if child should be moved
        if(!c.absolutePosition) {
            // if this is the highest child set this height to it
            if (c.h > maxH) {
                maxH = c.h;
            }
            // position child
            c.x = finalW + this.x;
            c.y = this.y + this.padding;
            // increase width
            finalW += c.w + this.spacing;
        }
    }
    // adapt dimensions if this should
    if (this.adaptWidth) { this.w = finalW + this.padding - 2; }
    if (this.adaptHeight) { this.h = maxH + this.padding * 2; }
}