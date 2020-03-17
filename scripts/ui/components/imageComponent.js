class ImageComponent extends Component {
    constructor(x,y,sprite) {
        super(x,y,sprite.spr.width,sprite.spr.height);
        this.image = sprite.spr;
        this.showBorder = false;
    }
}

ImageComponent.prototype.draw = function() {
    UIImage(this.image,this.x,this.y);
}