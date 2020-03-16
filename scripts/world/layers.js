// make tile layers
function makeTileLayers() {
    // store drawing info
    var camCache = { x: camera.x, y: camera.y };
    var drawModeCache = drawMode;
    var ctxCache = curCtx;
    camera.x = 8;
    camera.y = 8;
    drawMode = 0;
    absDraw = true;

    // draw tiles once
    //  = new Image(roomInfo.width*16,roomInfo.height*16);

    var tempCanv = document.createElement("canvas");
    tempCanv.width = roomInfo.width * 16;
    tempCanv.height = roomInfo.height * 16;
    var tempCtx = tempCanv.getContext("2d");
    curCtx = tempCtx;

    var mergeCanvas = document.createElement("canvas");
    mergeCanvas.width = 16;
    mergeCanvas.height = 16;
    mergeCtx = mergeCanvas.getContext("2d");

    // draw pass
    for (var y = 0; y < tiles.length; y++) {
        for (var x = 0; x < tiles[0].length; x++) {
            tiles[y][x].draw();
        }
    }

    // merge pass
    for (var y = 0; y < tiles.length; y++) {
        for (var x = 0; x < tiles[0].length; x++) {

            // top
            if (y > 0) {
                if (tiles[y][x].mergesWith.includes(tiles[y - 1][x].tileID)) {
                    curCtx = mergeCtx;
                    var paletteTile = tilePalette[tiles[y][x].tileID];
                    paletteTile.x = 0;
                    paletteTile.y = 0;
                    paletteTile.type = tiles[y][x].type;
                    mergeCtx.clearRect(0, 0, 16, 16);
                    paletteTile.draw();
                    for (var i = 0; i < 16; i++) {
                        mergeCtx.clearRect(i, 0, 1, rand(12, 15));
                    }
                    curCtx = tempCtx;
                    img({ spr: mergeCanvas }, x * 16, (y - 1) * 16);
                }
            }
            // bottom
            if (y < tiles.length - 1) {
                if (tiles[y][x].mergesWith.includes(tiles[y + 1][x].tileID)) {
                    curCtx = mergeCtx;
                    var paletteTile = tilePalette[tiles[y][x].tileID];
                    paletteTile.x = 0;
                    paletteTile.y = 0;
                    paletteTile.type = tiles[y][x].type;
                    mergeCtx.clearRect(0, 0, 16, 16);
                    paletteTile.draw();
                    for (var i = 0; i < 16; i++) {
                        mergeCtx.clearRect(i, rand(1, 4), 1, 16);
                    }
                    curCtx = tempCtx;
                    img({ spr: mergeCanvas }, x * 16, (y + 1) * 16);
                }
            }
            // left
            if (x > 0) {
                if (tiles[y][x].mergesWith.includes(tiles[y][x - 1].tileID)) {
                    curCtx = mergeCtx;
                    var paletteTile = tilePalette[tiles[y][x].tileID];
                    paletteTile.x = 0;
                    paletteTile.y = 0;
                    paletteTile.type = tiles[y][x].type;
                    mergeCtx.clearRect(0, 0, 16, 16);
                    paletteTile.draw();
                    for (var i = 0; i < 16; i++) {
                        mergeCtx.clearRect(0, i, rand(12, 15), 1);
                    }
                    curCtx = tempCtx;
                    img({ spr: mergeCanvas }, (x - 1) * 16, y * 16);
                }
            }
            // right
            if (x < tiles[0].length - 1) {
                if (tiles[y][x].mergesWith.includes(tiles[y][x + 1].tileID)) {
                    curCtx = mergeCtx;
                    var paletteTile = tilePalette[tiles[y][x].tileID];
                    paletteTile.x = 0;
                    paletteTile.y = 0;
                    paletteTile.type = tiles[y][x].type;
                    mergeCtx.clearRect(0, 0, 16, 16);
                    paletteTile.draw();
                    for (var i = 0; i < 16; i++) {
                        mergeCtx.clearRect(rand(1, 4), i, 16, 1);
                    }
                    curCtx = tempCtx;
                    img({ spr: mergeCanvas }, (x + 1) * 16, y * 16);
                }
            }
        }
    }

    roomInfo.layers.floor = tempCanv;

    // reset drawing info
    camera.x = camCache.x;
    camera.y = camCache.y;
    drawMode = drawModeCache;
    curCtx = ctxCache;
    absDraw = false;
}