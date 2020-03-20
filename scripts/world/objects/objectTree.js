class objectTree extends baseObject {
    constructor(x,y,type,defName,args) {
        super(x,y,20,20,type,defName);
        this.imageName = "tree";
    }
}

objectTree.prototype.typesAmount = 2;