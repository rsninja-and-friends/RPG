class HouseEntrance extends BaseObject {
    constructor(x,y,objectID,variation,rotation=0,meta={}) {
        super(x,y,objectID,variation,rotation,meta);
    }
}

HouseEntrance.prototype.imageName = "houseEntrance";

HouseEntrance.prototype.metaArguments = {roomName: metaFieldTypes.string};

HouseEntrance.prototype.update = function() {
    // change room here
    return false;
};

objectClasses.HouseEntrance = HouseEntrance;