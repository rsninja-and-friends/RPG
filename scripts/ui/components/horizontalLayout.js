class HorizontalLayout extends Component {
    constructor(x,y,w,h) {
        super(x,y,w,h);
        this.padding = 2;
        this.spacing = 2;
    }
}

HorizontalLayout.prototype.update = function() {
    let maxH = 10;
    let finalW = this.padding;
    for(let i=0;i<this.children.length;i++) {
        let c = this.children[i];
        if(c.h > maxH) {
            maxH = c.h;
        }
        c.x = finalW + this.x;
        finalW += c.w + this.spacing;
        c.y = this.y + this.padding;
    }
    this.w = finalW + this.padding - 2;
    this.h = maxH + this.padding*2;
}