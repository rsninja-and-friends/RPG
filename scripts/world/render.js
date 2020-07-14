function renderLayers() {
    camera.x = 0;
    camera.y = 0
    camera.angle = 0;
    camera.zoom = 1;
    difx = 8;
    dify = 8;
    absDraw = true;

    var xl = worldTiles[0].length;
    var yl = worldTiles.length;

    // positions around a tile that should be checked
    var shadowCheckOffsets = [[1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1]];

    var keys = Object.keys(worldLayers);
    for (var i = 0; i < keys.length; i++) {
        worldLayers[keys[i]] = dMake("canvas");
        worldLayers[keys[i]].width = xl * 16;
        worldLayers[keys[i]].height = yl * 16;
    }

    // ground

    var groundCtx = worldLayers.ground.getContext("2d");
    curCtx = groundCtx;
    // draw ground tiles
    for (var y = 0; y < yl; y++) {
        for (var x = 0; x < xl; x++) {
            if (worldTiles[y][x].layer === layers.ground) {
                worldTiles[y][x].draw();
            }
        }
    }

    var groundImageData = groundCtx.getImageData(0, 0, xl * 16, yl * 16);
    // draw transitions between tiles
    for (var y = 0; y < yl; y++) {
        for (var x = 0; x < xl; x++) {
            var merges = worldTiles[y][x].mergesWith;

            // bottom
            if (y + 1 < yl) {
                if (merges.includes(worldTiles[y + 1][x].tileID)) {
                    drawMerge(groundImageData, worldTiles[y][x], x * 16, (y + 1) * 16, "bottom");
                }
            }

            // top
            if (y - 1 > -1) {
                if (merges.includes(worldTiles[y - 1][x].tileID)) {
                    drawMerge(groundImageData, worldTiles[y][x], x * 16, (y - 1) * 16, "top");
                }
            }
            // right
            if (x + 1 < xl) {
                if (merges.includes(worldTiles[y][x + 1].tileID)) {
                    drawMerge(groundImageData, worldTiles[y][x], (x + 1) * 16, y * 16, "right");
                }
            }

            // left
            if (x - 1 > -1) {
                if (merges.includes(worldTiles[y][x - 1].tileID)) {
                    drawMerge(groundImageData, worldTiles[y][x], (x - 1) * 16, y * 16, "left");
                }
            }

        }
    }

    groundCtx.putImageData(groundImageData, 0, 0);

    // walls

    var wallCtx = worldLayers.walls.getContext("2d");
    curCtx = wallCtx;
    // draw ground tiles
    for (var y = 0; y < yl; y++) {
        for (var x = 0; x < xl; x++) {
            if (worldTiles[y][x].layer === layers.wall) {
                worldTiles[y][x].draw();
            }
        }
    }

    // shadows
    function validPosition(x, y) {
        return x < xl && x > -1 && y < yl && y > -1;
    }
    for (var y = 0; y < yl; y++) {
        for (var x = 0; x < xl; x++) {
            if (worldTiles[y][x].layer === layers.wall) {
                var str = "";
                for (var i = 0; i < 8; i++) {
                    var pos = shadowCheckOffsets[i];
                    if (validPosition(x + pos[0], y + pos[1])) {
                        str += (worldTiles[y + pos[1]][x + pos[0]].layer === layers.wall ? "1" : "0");
                    } else {
                        str += "1";
                    }
                }
                img({ spr: shadows[str], drawLimitSize: 8 }, x * 16, y * 16);
            }
        }
    }

    // objects
    var objectCtx = worldLayers.objects.getContext("2d");
    curCtx = objectCtx;
    for (var i = 0, l = worldObjects.length; i < l; i++) {
        worldObjects[i].draw();
    }

    globalLoading = false;
}

// takes a source tile and does a transition on some data at xPos and yPos in a direction
function drawMerge(data, sourceTile, xPos, yPos, direction) {
    // calculate data offsets
    var yMulti = 4 * data.width;
    var xOff = xPos * 4;
    var yOff = yPos * yMulti;
    // get actual rgba array, not the whole object
    var worldData = data.data;
    var tileData = tileDataCaches[sourceTile.tileID][sourceTile.variation].data;

    // takes a pixel from the source tile, and draws it at the right place in the world data
    function transferImageDataPixel(tx, ty) {
        worldPosition = ty * yMulti + yOff + tx * 4 + xOff;
        tilePosition = ty * 64 + tx * 4;
        worldData[worldPosition] = tileData[tilePosition];
        worldData[worldPosition + 1] = tileData[tilePosition + 1];
        worldData[worldPosition + 2] = tileData[tilePosition + 2];
        worldData[worldPosition + 3] = tileData[tilePosition + 3];
    }

    // draw transition depending on the direction
    switch (direction) {
        case "top":
            for (var y = 15; y > 9; y--) {
                for (var x = 0; x < 16; x++) {
                    if (rand(0, (16 - y) / 2) === 0) {
                        transferImageDataPixel(x, y);
                    }
                }
            }
            break;
        case "bottom":
            for (var y = 0; y < 6; y++) {
                for (var x = 0; x < 16; x++) {
                    if (rand(0, y / 2) === 0) {
                        transferImageDataPixel(x, y);
                    }
                }
            }
            break;
        case "right":
            for (var y = 0; y < 16; y++) {
                for (var x = 0; x < 6; x++) {
                    if (rand(0, x / 2) === 0) {
                        transferImageDataPixel(x, y);
                    }
                }
            }
            break;
        case "left":
            for (var y = 0; y < 16; y++) {
                for (var x = 15; x > 9; x--) {
                    if (rand(0, (16 - x) / 2) === 0) {
                        transferImageDataPixel(x, y);
                    }
                }
            }
            break;
    }
}

// image of each possible shadow arrangement 
var shadows = {};

// pre renders every possible shadow arrangement
function preRenderShadows() {
    for (var i = 0; i < 256; i++) {
        // make key for the shadow
        var str = i.toString(2).padStart(8, "0");
        // create and setup canvas to store shadow
        var canvas = dMake("canvas");
        canvas.width = 22;
        canvas.height = 22;
        var ctx = canvas.getContext("2d");

        // corners
        for (var j = 0; j < 8; j += 2) {
            if (str[j] === "0") {
                ctx.setTransform(1, 0, 0, 1, 11, 11);
                ctx.rotate(j * halfPI / 2);
                ctx.drawImage(sprites.shadowCorner.spr, -11, -11);
                ctx.setTransform(1, 0, 0, 1, 0, 0);
            }
        }

        // sides
        for (var j = 1; j < 8; j += 2) {
            if (str[j] === "0") {
                ctx.setTransform(1, 0, 0, 1, 11, 11);
                ctx.rotate((j - 1) * halfPI / 2);
                ctx.drawImage(sprites.shadowSide.spr, -11, -11);
                ctx.setTransform(1, 0, 0, 1, 0, 0);
            }
        }

        shadows[str] = canvas;
    }
}