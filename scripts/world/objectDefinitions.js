var objectDefinitions = {
    tree:function (x, y, type) { return new objectTree(x, y, type, "tree"); },
    link:function (x, y, type, args) { return new objectRoomLink(x, y, type, "link", args); }
};

var objDefKeys = Object.keys(objectDefinitions);