var objectIDs = [
    "HouseEntrance",
    "HouseSmokeStack"
];

var objectClasses = {};

// types of input fields used in build mode for object meta data
var metaFieldTypes = {
    number: 0,
    string: 1,
    enemy: 2,
    room: 3
};

class BaseObject {
    constructor(x,y,objectID,variation,rotation=0,meta="") {
        this.x = x*16;
        this.y = y*16;
        this.objectID  = objectID;
        this.variation = variation;
        this.rotation = rotation * Math.PI/2;
        this.meta = {};
        var metaInfo = meta.split("@");
        for(var i=0;i<this.metaArguments.length;i++) {
            if(metaInfo[i] === undefined) { metaInfo[i] = 0; }
            var mLength = metaInfo[i].length;
            if(mLength > 0) {
                if(parseInt(metaInfo[i]).toString().length === mLength) {
                    this.meta[this.metaArguments[i][0]] = parseInt(metaInfo[i]);
                } else {
                    this.meta[this.metaArguments[i][0]] = metaInfo[i];
                }
            }
        }
    }

    get data() {
        var metaStr = "";
        for(var i=0;i<this.metaArguments.length;i++) {
            metaStr += `${this.meta[this.metaArguments[i][0]]}@`;
        }
        metaStr = metaStr.substring(0,metaStr.length-1);
        return `${this.x/16-0.5}~${this.y/16-0.5}~${this.objectID}~${this.variation}~${~~(this.rotation/halfPI)}~${metaStr}`;
    }
    
}

BaseObject.prototype.imageName = "debug"; // name of image without number at the end

BaseObject.prototype.typesAmount = 1; // amount of object visual variations

BaseObject.prototype.metaArguments = []; // what arguments the meta takes in build mode. Example of arguments: [["warpID",metaFieldTypes.number],[" enemySpawn", metaFieldTypes.enemy]];

BaseObject.prototype.w = 16; // dimensions used only for building
BaseObject.prototype.h = 16;

BaseObject.prototype.draw = function() {
    img(sprites[`${this.imageName}${this.variation}`],this.x,this.y,this.rotation);
};

// code the object should run every frame. Return true if the object should be destroyed
BaseObject.prototype.update = function() {return false;};

// code that the object should run once when a room is loaded
BaseObject.prototype.initialize = function() {};

objectClasses.BaseObject = BaseObject;