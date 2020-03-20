// returns a 3x3 matrix of coordinates to check for collisions in
function getColliisons(entity) {
    // find position of entity in tile array
    var xpos = roundToGrid(entity.x) / 16;
    var ypos = roundToGrid(entity.y) / 16;
    xpos = clamp(xpos, 1, roomInfo.width - 2);
    ypos = clamp(ypos, 1, roomInfo.height - 2);
    // find tiles around entity
    var returnArray = [];
    for (var yy = -1; yy < 2; yy++) {
        returnArray.push([]);
        for (var xx = -1; xx < 2; xx++) {
            returnArray[yy + 1][xx + 1] = [xpos + xx, ypos + yy];
        }
    }
    return returnArray;
}

function colliding(entity, tilesArray) {
    var halfW = entity.w / 2;
    var halfH = entity.h / 2;

    // if hitting the wall, entity is colliding
    if (entity.x - halfW < -8 || entity.y - halfH < -8 || entity.x + halfW > roomInfo.width * 16 - 8 || entity.y + halfH > roomInfo.height * 16 - 8) { return true; }

    // go through near tiles
    for (var yy = 0; yy < tilesArray.length; yy++) {
        for (var xx = 0; xx < tilesArray[0].length; xx++) {
            var pos = tilesArray[yy][xx];

            // if the tile effect is collide, check for collision
            if (tiles[pos[1]][pos[0]].effect === effects.colliding) {
                if (rectrect(entity, tiles[pos[1]][pos[0]])) {
                    return true;
                }
            }
            
        }
    }

    for(var o=0;o<worldObjects.length;o++) {
        if(rectrect(entity,worldObjects[o])) {
            return true;
        }
    }

    return false;
}