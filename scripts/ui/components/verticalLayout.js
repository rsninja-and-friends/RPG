class VerticalLayout extends Component {
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

VerticalLayout.prototype.update = function() {
    // widest width of all children 
    let maxW = 10;
    // height of all children together
    let finalH = this.padding;
    // go through all children
    for (let i = 0; i < this.children.length; i++) {
        let c = this.children[i];
        // if child should be moved
        if(!c.absolutePosition) {
            // if this is the widest child, set parent width to it
            if (c.w > maxW) {
                maxW = c.w;
            }
            // position child
            c.y = finalH + this.y;
            c.x = this.x + this.padding;
            // increase height
            finalH += c.h + this.spacing;
        }
    }
    // adapt dimensions if this should
    if (this.adaptWidth) { this.h = finalH + this.padding - 2; }
    if (this.adaptHeight) { this.w = maxW + this.padding * 2; }
}