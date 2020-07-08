class HouseSmokeStack extends BaseObject {
    constructor(x,y,objectID,variation,rotation=0,meta={}) {
        super(x,y,objectID,variation,rotation,meta);
    }
}

HouseSmokeStack.prototype.imageName = "smokeStack";

HouseSmokeStack.prototype.update = function() {
    // make smoke here
    return false;
};

objectClasses.HouseSmokeStack = HouseSmokeStack;