// make tile layers
function makeTileLayers() {
    globalState = states.world;
    // store drawing info
    var camCache = { x: camera.x, y: camera.y };
    var drawModeCache = drawMode;
    var ctxCache = curCtx;
    camera.x = 8;
    camera.y = 8;
    drawMode = 0;
    absDraw = true;

    // draw tiles once

    // create canvas to draw layer to
    var tempCanv = document.createElement("canvas");
    tempCanv.width = roomInfo.width * 16;
    tempCanv.height = roomInfo.height * 16;
    var tempCtx = tempCanv.getContext("2d");
    curCtx = tempCtx;

    // create canvas to draw a tile to
    var mergeCanvas = document.createElement("canvas");
    mergeCanvas.width = 16;
    mergeCanvas.height = 16;
    mergeCtx = mergeCanvas.getContext("2d");

    var keys = Object.keys(roomInfo.layers);

    for(var l=0;l<keys.length;l++) {
        // draw pass
        for (var y = 0; y < tiles.length; y++) {
            for (var x = 0; x < tiles[0].length; x++) {
                if(tiles[y][x].layer === l) {
                    tiles[y][x].draw();
                }
            }
        }

        // merge pass
        for (var y = 0; y < tiles.length; y++) {
            for (var x = 0; x < tiles[0].length; x++) {
                if(tiles[y][x].layer === l) {
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
        }

        // shadow pass
        if(l === layer.wall) {
            for (var y = 0; y < tiles.length; y++) {
                for (var x = 0; x < tiles[0].length; x++) {
                    if(tiles[y][x].layer === layer.wall) {
                        var shadowKey = "";
                        // top
                        if (y > 0) {
                            shadowKey += tiles[y-1][x].layer !== layer.wall ? "1" : "0";
                        } else { shadowKey += "0";}
                        // right
                        if (x < tiles[0].length - 1) {
                            shadowKey += tiles[y][x+1].layer !== layer.wall ? "1" : "0";
                        } else { shadowKey += "0";}
                        // bottom
                        if (y < tiles.length - 1) {
                            shadowKey += tiles[y+1][x].layer !== layer.wall ? "1" : "0";
                        } else { shadowKey += "0";}
                        // left
                        if (x > 0) {
                            shadowKey += tiles[y][x-1].layer !== layer.wall ? "1" : "0";
                        } else { shadowKey += "0";}
                        var cache = tiles[y][x];
                        tempCtx.drawImage(shadows[shadowKey],cache.x-3,cache.y-3);
                    }
                }
            }
        }

        // object pass
        for (var i = 0; i < worldObjects.length; i++) {
            if(worldObjects[i].layer === l) {
                worldObjects[i].draw();
            }
        }
        

        // cache layer image, so drawing every frame will be faster
        roomInfo.layers[keys[l]] = new Image();
        roomInfo.layers[keys[l]].src = tempCanv.toDataURL("image/png");
        tempCtx.clearRect(0,0,tempCanv.width,tempCanv.height);
    }

    

    // reset drawing info
    camera.x = camCache.x;
    camera.y = camCache.y;
    drawMode = drawModeCache;
    curCtx = ctxCache;
    absDraw = false;

    document.getElementById("load").style.display = "none";
}

var shadowColor = "#000022";
var shadowCanv = document.createElement("canvas");
shadowCanv.width = 22;
shadowCanv.height = 22;
var shadowCtx = shadowCanv.getContext("2d");
var shadows = {};

function generateShadows() {
    for(var i=0;i<16;i++) {
        var key = i.toString(2);
        while(key.length<4) {
            key = "0" + key;
        }
        shadows[key] = null;
    }
    var keys = Object.keys(shadows);
    for(var i=0;i<16;i++) {
        var str = keys[i];
        // top left
        if(str[0]==="1" && str[3]==="1") {
            drawShadow([[0,0,0,0],[1,1,2,2],[0,0,3,3]]);
        }
        // top
        if(str[0]==="1") {
            drawShadow([[3,2,16,1],[3,1,16,1],[3,0,16,1]]);
        }
        // right
        if(str[1]==="1") {
            drawShadow([[19,3,1,16],[20,3,1,16],[21,3,1,16]]);
        }
        // top right
        if(str[0]==="1" && str[1]==="1") {
            drawShadow([[0,0,0,0],[19,1,2,2],[19,0,3,3]]);
        }
        // bottom
        if(str[2]==="1") {
            drawShadow([[3,19,16,1],[3,20,16,1],[3,21,16,1]]);
        }
        // bottom right
        if(str[2]==="1" && str[1]==="1") {
            drawShadow([[0,0,0,0],[19,19,2,2],[19,19,3,3]]);
        }
        // left
        if(str[3]==="1") {
            drawShadow([[2,3,1,16],[1,3,1,16],[0,3,1,16]]);
        }
        // bottom left
        if(str[2]==="1" && str[3]==="1") {
            drawShadow([[0,0,0,0],[1,19,2,2],[0,19,3,3]]);
        }

        shadows[keys[i]] = new Image();
        shadows[keys[i]].src = shadowCanv.toDataURL("image/png");
        shadowCtx.clearRect(0,0,22,22);
    }
}

function drawShadow(arr) {
    shadowCtx.fillStyle = shadowColor+"66";
    shadowCtx.fillRect(arr[0][0],arr[0][1],arr[0][2],arr[0][3]);
    shadowCtx.fillStyle = shadowColor+"44";
    shadowCtx.fillRect(arr[1][0],arr[1][1],arr[1][2],arr[1][3]);
    shadowCtx.fillStyle = shadowColor+"22";
    shadowCtx.fillRect(arr[2][0],arr[2][1],arr[2][2],arr[2][3]);
}