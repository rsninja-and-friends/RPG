class VerticalLayout extends Component {
    constructor(x,y,w,h) {
        super(x,y,w,h);
        this.padding = 2;
        this.spacing = 2;
    }
}

VerticalLayout.prototype.update = function() {
    let maxW = 10;
    let finalH = this.padding;
    for(let i=0;i<this.children.length;i++) {
        let c = this.children[i];
        if(c.w > maxW) {
            maxW = c.w;
        }
        c.y = finalH + this.y;
        finalH += c.h + this.spacing;
        c.x = this.x + this.padding;
    }
    this.h = finalH + this.padding - 2;
    this.w = maxW + this.padding*2;
}