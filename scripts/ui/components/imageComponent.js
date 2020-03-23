class ImageComponent extends Component {
    constructor(x, y, sprite, scale = 1) {
        super(x, y, sprite.spr.width * scale, sprite.spr.height * scale);
        this.image = sprite.spr;
        this.scale = scale;
        this.showBorder = false;
    }
}

ImageComponent.prototype.draw = function() {
    if(this.scale !== 1) {
        UIImageScaled(this.image, this.x, this.y, this.scale);
    } else {
        UIImage(this.image, this.x, this.y);
    }
}