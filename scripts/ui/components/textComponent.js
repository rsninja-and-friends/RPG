class TextComponent extends Component {
    constructor(x, y, w, color,size, functionThatReturnsString = function () { return "default text"; }) {
        super(x, y, w, 8*size);
        this.txtFunc = functionThatReturnsString;
        this.color = color;
        this.size = size;
        this.string = "";
        this.showShadow = false;
        this.showBorder = false;
        this.showBackground = false;
    }
}

TextComponent.prototype.update = function() {
    // get the string from the function passed into constructor that returns a string
    this.string = this.txtFunc();
}

TextComponent.prototype.draw = function() {
    // draw text, and adapt height to accommodate text wrapping
    this.h = UIText(this.string,this.x,this.y,this.color,this.size,this.w);
}

// if you want to type less to make a text component that has a constant string
function returnStr(str) {
    return function(){return str;};
}