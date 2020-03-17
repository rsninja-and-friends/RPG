class TextComponent extends Component {
    constructor(x, y, w, color,size, functionThatReturnsString = function () { return "default text"; }) {
        super(x, y, w, 6);
        this.txtFunc = functionThatReturnsString;
        this.color = color;
        this.size = size;
        this.string;
        this.showShadow = false;
        this.showBorder = false;
        this.backgroundColor = "#00000000";
    }
}

TextComponent.prototype.update = function() {
    this.string = this.txtFunc();
}

TextComponent.prototype.draw = function() {
    this.h = UIText(this.string,this.x,this.y,this.color,this.size,this.w);
}