

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
    if(this.click) {
        UIRect(this.x, this.y,this.w,3,"#000000");
        UIRect(this.x, this.y,3,this.h,"#000000");
    } else {
        UIRect(this.x, this.y + this.h-2,this.w,3,"#000000");
        UIRect(this.x + this.w-3, this.y,3,this.h,"#000000"); 
        UIRect(this.x, this.y,this.w,3,"#373737");
        UIRect(this.x, this.y,3,this.h,"#373737");
    }
    
}

Button.prototype.update = function() {
    this.backgroundColor = colors.background;
    this.hover = false;
    this.click = false;
    if (focusedComponent === this.idNumber) {
        if (mousePress[0]) {
            this.onclick();
        }
        if (mouseDown[0]) {
            this.backgroundColor = colors.click;
            this.click = true;
        } else {
            this.backgroundColor = colors.hover;
            this.hover = true;
        }
    }
    let maxH = 10;
    let finalW = this.padding;
    var off = this.click ? 2 : 0;
    for (let i = 0; i < this.children.length; i++) {
        let c = this.children[i];
        if (c.h > maxH) {
            maxH = c.h;
        }
        c.x = finalW + this.x + off;
        finalW += c.w + 2;
        c.y = this.y + this.padding + off;
    }
    this.w = finalW + this.padding - 2;
    this.h = maxH + this.padding * 2;
}