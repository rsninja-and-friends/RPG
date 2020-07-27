class HouseEntrance extends BaseObject {
    constructor(x,y,objectID,variation,rotation=0,meta={}) {
        super(x,y,objectID,variation,rotation,meta);
    }
}

HouseEntrance.prototype.imageName = "houseEntrance";

HouseEntrance.prototype.metaArguments = [["room",metaFieldTypes.room]];

HouseEntrance.prototype.update = function() {
    if(dist(this,player) < 20) {
        player.angle = -pointTo(player,this)+halfPI;
        cutSceneData = this.meta.room;
        playCutscene(0);
    }
    return false;
};

objectClasses.HouseEntrance = HouseEntrance;