var objectDefinitions = {
    tree:function (x, y, type) { return new objectTree(x, y, type, "tree"); },
    houseSmall:function (x, y, type) { return new objectHouseSmall(x, y, type, "houseSmall"); },
    link:function (x, y, type, args) { return new objectRoomLink(x, y, type, "link", args); },
    enemy:function (x, y, type, args) { return new objectEnemy(x, y, type, "enemy", args); },
};

var objDefKeys = Object.keys(objectDefinitions);