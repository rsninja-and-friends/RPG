class Button extends Component {
    constructor(x, y, onclick) {
        super(x, y, 10, 10);
        this.onclick = onclick;
        this.ignoreChildUpdate = true;
        this.padding = 4;
        this.showBorder = false;
        this.hover = false;
        this.click = false;
    }
}

Button.prototype.draw = function() {
    if (this.click) {
        // shadow top and left
        UIRect(this.x, this.y, this.w, 3, "#0a0a0a");
        UIRect(this.x, this.y, 3, this.h, "#0a0a0a");
    } else {
        // shadow bottom and right
        UIRect(this.x, this.y + this.h - 2, this.w, 3, "#0a0a0a");
        UIRect(this.x + this.w - 3, this.y, 3, this.h, "#0a0a0a");
        // highlight top and left
        UIRect(this.x, this.y, this.w, 3, "#373737");
        UIRect(this.x, this.y, 3, this.h, "#373737");
    }
}

Button.prototype.update = function() {
    this.backgroundColor = colors.background;
    this.hover = false;
    this.click = false;
    // if this is focused, handle clicking
    if (focusedComponent === this.idNumber) {
        // call on click when clicked
        if (mousePress[0]) {
            this.onclick();
        }
        // set color depending on hover and click
        if (mouseDown[0]) {
            this.backgroundColor = colors.click;
            this.click = true;
        } else {
            this.backgroundColor = colors.hover;
            this.hover = true;
        }
    }
    // highest height of all children
    let maxH = 10;
    // width of all children together
    let finalW = this.padding;
    // x and y offset for children depending on if this is held down
    let off = this.click ? 2 : 0;
    // go through all children
    for (let i = 0; i < this.children.length; i++) {
        let c = this.children[i];
        // if this is the highest child set this height to it
        if (c.h > maxH) {
            maxH = c.h;
        }
        // position child
        c.x = finalW + this.x + off;
        c.y = this.y + this.padding + off;
        // increase width
        finalW += c.w + 2;
    }
    // adapt dimensions 
    this.w = finalW + this.padding - 2;
    this.h = maxH + this.padding * 2;
}