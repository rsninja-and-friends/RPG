var objectIDs = [
    "HouseEntrance"
];

var objectClasses = {};

// types of input fields used in build mode for object meta data
var metaFieldTypes = {
    number: 0,
    string: 1,
    enemy: 2
};

class BaseObject {
    constructor(x,y,objectID,variation,rotation=0,meta={}) {
        this.x = x*16;
        this.y = y*16;
        this.objectID  = objectID;
        this.variation = variation;
        this.rotation = rotation * Math.PI/2;
        this.meta = meta;
    }

    get data() {
        return `${this.x/16}.${this.y/16}.${this.objectID}.${this.variation}.${~~(this.rotation/halfPI)}.${JSON.stringify(this.meta)}`;   
    }
    
}

BaseObject.prototype.imageName = "debug"; // name of image without number at the end

BaseObject.prototype.typesAmount = 1; // amount of object visual variations

BaseObject.prototype.metaArguments = {}; // what arguments the meta takes in build mode. Example of arguments: {warpID:metaFieldTypes.number, enemySpawn: metaFieldTypes.enemy};

BaseObject.prototype.draw = function() {
    img(sprites[`${this.imageName}${this.variation}`],this.x,this.y,this.rotation);
};

// code the object should run every frame. Return true if the object should be destroyed
BaseObject.prototype.update = function() {return false;};

// code that the object should run once when a room is loaded
BaseObject.prototype.initialize = function() {};

objectClasses.BaseObject = BaseObject;