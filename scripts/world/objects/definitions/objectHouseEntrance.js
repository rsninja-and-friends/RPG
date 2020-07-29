class HouseEntrance extends BaseObject {
    constructor(x,y,objectID,variation,rotation=0,meta="") {
        super(x,y,objectID,variation,rotation,meta);
    }
}

HouseEntrance.prototype.imageName = "houseEntrance";

HouseEntrance.prototype.metaArguments = [
    ["room",metaFieldTypes.room],
    ["entranceID",metaFieldTypes.string]
];

HouseEntrance.prototype.update = function() {
    if(dist(this,player) < 8) {
        player.angle = pointTo(player,this);
        cutSceneData = {room:this.meta.room,entranceID:this.meta.entranceID,walkTime:20};
        playCutscene(0);
    }
    return false;
};

objectClasses.HouseEntrance = HouseEntrance;