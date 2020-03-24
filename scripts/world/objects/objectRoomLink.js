class objectRoomLink extends baseObject {
    constructor(x,y,type,defName,args) {
        super(x,y,-16,-16,type,defName);
        this.imageName = "link";
        this.id = args[0];  
        this.room = args[1];
        this.playerOn = true;
    }
}

objectRoomLink.prototype.typesAmount = 2;

objectRoomLink.prototype.update = function() {
    if(dist(this,player) < 10) {
        if(this.playerOn === false) {
            loadRoom(rooms[this.room],this.id);
        }
    } else {
        this.playerOn = false;
    }
}

objectRoomLink.prototype.draw = function() {
    img(sprites[`${this.imageName}${this.type}`],this.x,this.y);
    if(globalState === states.build) {
        text(this.id===undefined?"not set" : this.id,this.x-8,this.y-8,"black",2);
    }
}


objectRoomLink.prototype.exportArgs = function() {
    return [this.id,this.room]
}

function addLinkUI(obj,index) {
    var div = document.createElement("div");
    var span = document.createElement("span");
    span.innerText = obj.x + "," + obj.y + ":";
    div.appendChild(span);
    var input = document.createElement("input");
    input.type = "number";
    input.id = "linkID" + index;
    div.appendChild(input);

    input = document.createElement("input");
    input.type = "text";
    input.id = "linkRoom" + index;
    div.appendChild(input);
    
    document.getElementById("linkIDs").appendChild(div);
}