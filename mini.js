function dGet(id) {
    return document.getElementById(id);
}
function dMake(tag) {
    return document.createElement(tag);
}
function createCanvas(id) {
    var tempCanvas = dMake("canvas");
    tempCanvas.id = id;
    tempCanvas.width = canvases.cvs.width;
    tempCanvas.height = canvases.cvs.height;
    tempCanvas.style = "image-rendering:pixelated;image-rendering: crisp-edges;display:none"; //display:none;

    document.body.appendChild(tempCanvas);

    canvases[`${id}cvs`] = dGet(id);
    canvases[`${id}ctx`] = canvases[`${id}cvs`].getContext("2d");
}

function startLoops() {
    try {
        draw;
    } catch (err) {
        console.warn(bug + " no draw function found");
        return null;
    }
    try {
        update;
    } catch (err) {
        console.warn(bug + " no update function found");
        return null;
    }
    try {
        input;
    } catch (err) {
        seperateInputLoop = false;
    }
    onAssetsLoaded();

    requestAnimationFrame(drawLoop);
    setInterval(updateLoop, 1000 / updateFPS);

    if (seperateInputLoop) {
        setInterval(inputLoop, 4);
    }
}

function mousePosition() {
    if (drawMode === 0) {
        return { x: mousePos.x - camera.x, y: mousePos.y - camera.y };
    } else if (drawMode === 1) {
        var xoff = canvases.cvs.width / 2;
        var yoff = canvases.cvs.height / 2;
        return { x: (mousePos.x - xoff) / camera.zoom + xoff - camera.x, y: (mousePos.y - yoff) / camera.zoom + yoff - camera.y };
    } else {
        var xoff = canvases.cvs.width / 2;
        var yoff = canvases.cvs.height / 2;
        var tempPos = { x: (mousePos.x - xoff) / camera.zoom + xoff - camera.x, y: (mousePos.y - yoff) / camera.zoom + yoff - camera.y };

        var center = { x: -camera.x + cw / 2, y: -camera.y + ch / 2 };
        var tempAngle = pointTo(center, tempPos) - camera.angle;
        var tempDist = dist(center, tempPos);

        return { x: center.x + Math.cos(tempAngle) * tempDist, y: center.y + Math.sin(tempAngle) * tempDist };
    }
}

function addStyle() {
    var tempStyle = dMake("style");
    tempStyle.id = "gamejsstyle";
    document.head.appendChild(tempStyle);
    var tempMeta = dMake("meta");
    tempMeta.setAttribute("charset", "utf-8");
    document.head.appendChild(tempMeta);
}

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function radToDeg(rad) {
    return (rad / Math.PI) * 180;
}
function degToRad(deg) {
    return (deg * Math.PI) / 180;
}

function velocity(angle) {
    return { x: Math.sin(angle), y: Math.cos(angle) };
}

function pointTo(point, targetPoint) {
    var adjacent = targetPoint.x - point.x;
    var opposite = targetPoint.y - point.y;
    var h = Math.atan2(opposite, adjacent);
    return h;
}

function loadImagesAndSounds() {
    var curpath = "";
    context = new AudioContext();
    sfxVolumeNode = context.createGain();
    sfxVolumeNode.connect(context.destination);
    bmgVolumeNode = context.createGain();
    bmgVolumeNode.connect(context.destination);
    deeper(images, "image");
    deeper(audio, "sound");
    function deeper(curpos, type) {
        let addedPath = "";
        for (let j = 0; j < curpos.length; j++) {
            if (typeof curpos[j] == "string") {
                if (j == 0) {
                    curpath += curpos[j];
                    addedPath = curpos[j];
                } else {
                    if (type == "image") {
                        let name = curpath + curpos[j];
                        imagePaths.push(name);
                        let temp = new Image();
                        temp.src = name;
                        temp.onerror = function () {
                            console.warn(bug + " " + this.src + " was not found");
                        };
                        temp.onload = function () {
                            spriteLoad(name, temp);
                        };
                        imgs.push(temp);
                    } else if (type == "sound") {
                        audioPaths.push(curpath + curpos[j]);
                        newSound(curpath + curpos[j]);
                    }
                }
            }
            if (typeof curpos[j] == "object") {
                deeper(curpos[j], type);
            }
        }
        curpath = curpath.slice(0, curpath.length - addedPath.length);
    }

    loadingCircle = new Image();
    loadingCircle.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAf0lEQVQ4jc2SuxHAIAxDbY4pMpHmyJSeKGuQKpyj2Hy6qETPQvhQCWRmDRfeZ4cJAGW28mAUyL4Pqmx2nfK+zaR59glRHo5qZi0BaPHmbDhiyuzdsza9wcrtEVtG4Ip+FLCzTM+WneWxPv9gpQUzmhncLPOHUCYfHr4/C4r2dQPfhkeIbjeYWgAAAABJRU5ErkJggg==";
    clickSound = new Audio("data:audio/x-wav;base64,UklGRowBAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YWgBAADa/6T/2/+S/x//pP769Xr4fPh5+H34evh7+Pv6gf18/QIAhQcIDxUZFR4VHhgeEx6TFgkPCgqAAnz49/X18HLu7ubo4eXc5dzj3Gjf5+Fr5G7pce759YECiwwRFBQZlxuXG5cbFRmTFo8RCAoAAPz69/X08G7udO5s7vz1dvj++nv9gP3+/wEAgwKBAogHkBEpLUNG1lzqcPV683r4eu51ZmnVV7w+qypy88fDoKAXlAqKBoUAgIeHlpYsrTu87Ot9/ZIRGxkoKDEtqionIxgZiwfj5lnaz9JN0E3QV9pd3+Tm9fUBAAQFBwWNDBEPFxSYFpsWEA9+/fP1dfNt83bz8fX9+gQFkAwPDxQPEQ+IBwIAdfjv8OLm2+HX3Nrh4+bm63n4BAUUDx0ZqyCrJSkelBGEAnb4a+5a5Njcztxc31jkZunx9QgFGhQfGa0gqCCuIKkgpRsaFIsHdfhj6dfh0NzM19Th6es=");
    let pos = { x: cw / 2 - 100, y: ch / 2 - 100 };
    optionsButtons.screenSize = { x: pos.x + 160, y: pos.y + 12, w: 50, h: 20 };
    optionsButtons.sfx = { x: pos.x + 125, y: pos.y + 40, w: 120, h: 20 };
    optionsButtons.bmg = { x: pos.x + 125, y: pos.y + 70, w: 120, h: 20 };
    loadLoop();
}

function loadLoop() {
    if (Object.keys(sprites).length == imagePaths.length && audioPaths.length == audioLoadedLength) {
        startLoops();
        imagePaths = [];
        audioPaths = [];
        imgs = [];
    } else {
        curCtx.fillStyle = "#2d2d2d";
        curCtx.fillRect(0, 0, cw, ch);
        text(`audio:   ${audioLoadedLength}/${audioPaths.length}`, 10, 30, "white", 2);
        text(`sprites: ${Object.keys(sprites).length}/${imagePaths.length}`, 10, 10, "white", 2);
        curCtx.setTransform(1, 0, 0, 1, Math.round(cw / 2), Math.round(ch / 2));
        curCtx.rotate(loadAng);
        loadAng += 0.1;
        curCtx.drawImage(loadingCircle, Math.round(-8), Math.round(-8));
        curCtx.setTransform(1, 0, 0, 1, 0, 0);
        requestAnimationFrame(loadLoop);
    }
}

function spriteLoad(path, image) {
    let startpos;
    let endpos = path.lastIndexOf(".");
    for (let j = endpos - 1; acceptableChars.includes(path[j]); j--) {
        startpos = j;
    }
    let spriteName = path.slice(startpos, endpos);
    let dsize = Math.max(image.width, image.height) / 2;
    sprites[spriteName] = { spr: image, drawLimitSize: dsize };
}

function newSound(src) {
    let startpos;
    let endpos = src.lastIndexOf(".");
    for (let j = endpos - 1; acceptableChars.includes(src[j]); j--) {
        startpos = j;
    }
    let soundName = src.slice(startpos, endpos);
    sounds[soundName] = { nodes: [], volNodes: [], src: src, type: "sfx", volume: 1 };
    sounds[soundName].nodes = [1];

    let loadingSound = new Audio();
    loadingSound.onerror = function () {
        console.warn(bug + " " + src + " was not found");
    };
    loadingSound.src = src;
    loadingSound.preload = "auto";
    loadingSound.addEventListener(
        "canplaythrough",
        function () {
            audioLoadedLength++;
        },
        false
    );
    sounds[soundName].nodes.push(loadingSound);

    let soundNode = context.createMediaElementSource(loadingSound);
    let gainNode = context.createGain();

    soundNode.connect(gainNode);
    gainNode.connect(sfxVolumeNode);

    abuffer.push(soundNode);
    volumeList.push(gainNode);
    sounds[soundName].volNodes.push(volumeList.length - 1);
}

function addSound(sound) {
    let loadingSound = new Audio();
    loadingSound.src = sound.src;
    loadingSound.preload = "auto";
    sound.nodes.splice(sound.nodes[0], 0, loadingSound);

    let soundNode = context.createMediaElementSource(loadingSound);
    let gainNode = context.createGain();
    gainNode.gain.value = sound.volume;

    soundNode.connect(gainNode);
    gainNode.connect(sound.type == "sfx" ? sfxVolumeNode : bmgVolumeNode);

    abuffer.push(soundNode);
    volumeList.push(gainNode);
    sound.volNodes.push(volumeList.length - 1);

    volumeList[sound.volNodes[sound.volNodes.length - 1]].gain.value = volumeList[sound.volNodes[0]].gain.value;
}

function play(sound) {
    s = sound.nodes;
    if (s[s[0]].ended || !s[s[0]].played.length) {
        s[s[0]].play();
        s[0]++;
        if (s[0] == s.length) {
            s[0] = 1;
        }
    } else {
        addSound(sound);
        s[s[0]].play();
        s[0]++;
        if (s[0] == s.length) {
            s[0] = 1;
        }
    }
}

function setVolume(sound, volume) {
    for (let i = 0, l = sound.volNodes.length; i < l; i++) {
        volumeList[sound.volNodes[i]].gain.value = volume;
    }
}

function setType(sound, newType) {
    for (let i = 0, l = sound.volNodes.length; i < l; i++) {
        volumeList[sound.volNodes[i]].disconnect(sound.type == "sfx" ? sfxVolumeNode : bmgVolumeNode);
        volumeList[sound.volNodes[i]].connect(newType == "sfx" ? sfxVolumeNode : bmgVolumeNode);
    }
    sound.type = newType;
}

function stop(sound) {
    s = sound.nodes;
    for (let i = 1; i < s.length; i++) {
        s[i].pause();
        s[i].currentTime = 0;
    }
}

function handleOptionsInput() {
    let ImTierdMakemenuwork = true;
    if (optionsMenu) {
        if (mouseDown[0]) {
            if (rectpoint(optionsButtons.sfx, mousePos)) {
                volume.sfx = (mousePos.x - (optionsButtons.sfx.x - 60)) / 120;
            }
            if (rectpoint(optionsButtons.bmg, mousePos)) {
                volume.bgm = (mousePos.x - (optionsButtons.bmg.x - 60)) / 120;
            }
        }
    }
    if (mousePos.x > cw - 32 && mousePos.y < 32) {
        if (mousePress[0] && ImTierdMakemenuwork) {
            clickSound.play();
            paused = true;
            optionsMenu = !optionsMenu;
        }
        optionsHover = 25;
    } else {
        optionsHover = 0;
    }
    if (mousePos.x < cw - 32 && mousePos.x > cw - 64 && mousePos.y < 32) {
        pauseHover = 25;
        if (mousePress[0]) {
            clickSound.play();
            paused = !paused;
        }
    } else {
        pauseHover = 0;
    }
}
function addFont() {
    var tempStyle = dMake("style");
    tempStyle.innerHTML = `
    @font-face {
        font-family: "pixelmix";
        src: url(assets/pixelmix.ttf) format("truetype");
        font-weight: 900;
        font-style: normal;
    }
    html {font-family: "pixelmix" !important; font-size: 16px;}
    `;
    document.head.appendChild(tempStyle);
    canvases.ctx.textBaseline = "hanging";
    canvases.ctx.textAlign = "left";
}
var scaleDefault = 1;
function img(img, x, y, angle = 0, sx = scaleDefault, sy = scaleDefault) {
    var half = img.drawLimitSize;
    if ((x + half > drawLimitLeft && x - half < drawLimitRight && y + half > drawLimitTop && y - half < drawLimitBottom) || absDraw) {
        let spr = img.spr;
        if (angle === 0 && sx === 1 && sy === 1) {
            curCtx.drawImage(spr, Math.round(x + camera.x + difx - spr.width / 2), Math.round(y + camera.y + dify - spr.height / 2));
        } else {
            curCtx.setTransform(sx, 0, 0, sy, Math.round(x + camera.x + difx), Math.round(y + camera.y + dify));
            curCtx.rotate(angle);
            curCtx.drawImage(spr, Math.round(-spr.width / 2), Math.round(-spr.height / 2));
            curCtx.setTransform(1, 0, 0, 1, 0, 0);
        }
    }
}

function imgIgnoreCutoff(img, x, y, angle = 0, sx = 1, sy = 1) {
    let spr = img.spr;
    if (angle === 0 && sx === 1 && sy === 1) {
        curCtx.drawImage(spr, Math.round(x + camera.x + difx - spr.width / 2), Math.round(y + camera.y + dify - spr.height / 2));
    } else {
        curCtx.setTransform(sx, 0, 0, sy, Math.round(x + camera.x + difx), Math.round(y + camera.y + dify));
        curCtx.rotate(angle);
        curCtx.drawImage(spr, Math.round(-spr.width / 2), Math.round(-spr.height / 2));
        curCtx.setTransform(1, 0, 0, 1, 0, 0);
    }
}

function rect(x, y, w, h, color) {
    curCtx.fillStyle = color;
    curCtx.fillRect(x - w / 2 + camera.x + difx, y - h / 2 + camera.y + dify, w, h);
}

function rectOutline(x, y, w, h, color) {
    curCtx.strokeStyle = color;
    curCtx.rect(x - w / 2 + camera.x + difx, y - h / 2 + camera.y + dify, w, h);
    curCtx.stroke();
}

function circle(x, y, r, color) {
    curCtx.beginPath();
    curCtx.arc(x + camera.x + difx, y + camera.y + dify, r, 0, 2 * Math.PI, false);
    curCtx.fillStyle = color;
    curCtx.fill();
}

function circleOutline(x, y, r, color) {
    curCtx.beginPath();
    curCtx.arc(x + camera.x + difx, y + camera.y + dify, r, 0, 2 * Math.PI, false);
    curCtx.strokeStyle = color;
    curCtx.stroke();
}

function shape(x, y, relitivePoints, color) {
    x += camera.x + difx;
    y += camera.y + dify;
    curCtx.fillStyle = color;
    curCtx.beginPath();
    curCtx.moveTo(x + relitivePoints[0].x, y + relitivePoints[0].y);
    for (let i = 1, l = relitivePoints.length; i < l; i++) {
        curCtx.lineTo(x + relitivePoints[i].x, y + relitivePoints[i].y);
    }
    curCtx.fill();
}

function text(txt, x, y, color = "black", size = 1, maxWidth = cw) {
    txt = txt.toString();
    curCtx.fillStyle = color;
    curCtx.font = `${Math.round(size) * 8}px pixelmix`;
    //I hate text wrapping now
    var txtList = txt.split("\n"); //split string on enters
    for (let i = 0; i < txtList.length; i++) {
        //go through array of strings
        if (curCtx.measureText(txtList[i]).width > maxWidth) {
            //if the string is too big, divide up into smaller strings
            var tempTxt = txtList[i].split(" "); //split into individual words
            var tempStr = ""; //string for measuring size
            var addAmount = 0; //track where in the txtList we are
            txtList.splice(i, 1); //remove the too long string
            for (let j = 0; j < tempTxt.length; j++) {
                //go through the split up string
                if (curCtx.measureText(tempStr + tempTxt[j] + " ").width < maxWidth) {
                    //if adding a word doesn't make tempStr too long, add it, other wise, add tempStr to txtList;
                    tempStr += tempTxt[j] + " ";
                } else {
                    if (j == 0) {
                        tempStr += tempTxt[j];
                    } //if we are here when j is 0, we have one word that is longer then the maxWidth, so we just draw it
                    txtList.splice(i + addAmount, 0, tempStr); //put tempStr in txtList
                    addAmount++; //move the position we put the tempStr in
                    tempStr = ""; //reset tempStr
                    tempTxt.splice(0, j == 0 ? 1 : j); //delete words that have been used
                    j = -1; //make it so in the next loop, j starts at 0
                }
            }
            if (tempStr.length != 0) {
                txtList.splice(i + addAmount, 0, tempStr); //add any leftover text
            }
        }
    }

    for (let i = 0; i < txtList.length; i++) {
        curCtx.fillText(txtList[i], x + camera.x + difx, y + camera.y + dify + ((i + (drawMode ? 1 : 0)) * 8 * size + size * i));
    }
}

function textWidth(txt, size = 1) {
    txt = txt.toString();
    curCtx.font = `${Math.round(size) * 8}px pixelmix`;
    return curCtx.measureText(txt).width;
}

function centerCameraOn(x, y) {
    camera.x = -x + canvases.cvs.width / 2;
    camera.y = -y + canvases.cvs.height / 2;
}

function moveCamera(x, y) {
    camera.x -= y * Math.sin(camera.angle);
    camera.y -= y * Math.cos(camera.angle);
    camera.x -= x * Math.sin(camera.angle + 1.57079632);
    camera.y -= x * Math.cos(camera.angle + 1.57079632);
}

function imgRotScale(x, y, angle, scale, pic, ctx) {
    //used for camera movement
    ctx.setTransform(scale, 0, 0, scale, x, y);
    ctx.rotate(angle);
    ctx.drawImage(pic, -pic.width / 2, -pic.height / 2);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function drawCursor() {
    if (cursor.sprite && mouseOnCanvas) {
        if (cursor.alignment) {
            canvases.ctx.drawImage(cursor.sprite.spr, mousePos.x - Math.round(cursor.sprite.spr.width / 2), mousePos.y - Math.round(cursor.sprite.spr.height / 2));
        } else {
            canvases.ctx.drawImage(cursor.sprite.spr, mousePos.x, mousePos.y);
        }
        cursor.show = false;
    } else {
        cursor.show = true;
    }
}

function render() {
    if (drawMode === 1) {
        imgRotScale(canvases.cvs.width / 2, canvases.cvs.height / 2, 0, camera.zoom, canvases.buffer1cvs, canvases.ctx);
    }
    if (drawMode === 2) {
        imgRotScale(canvases.cvs.width / 2, canvases.cvs.height / 2, camera.angle, 1, canvases.buffer2cvs, canvases.buffer1ctx);
        imgRotScale(canvases.cvs.width / 2, canvases.cvs.height / 2, 0, camera.zoom, canvases.buffer1cvs, canvases.ctx);
    }
}

function clearCanvases() {
    canvases.ctx.clearRect(0, 0, canvases.cvs.width, canvases.cvs.height);
    canvases.buffer1ctx.clearRect(0, 0, canvases.buffer1cvs.width, canvases.buffer1cvs.height);
    canvases.buffer2ctx.clearRect(0, 0, canvases.buffer2cvs.width, canvases.buffer2cvs.height);
}

function switchDrawMode() {
    if (camera.zoom < 1) {
        camera.zoom = 1;
    }
    if (camera.angle != 0) {
        drawMode = 2;
    } else if (camera.zoom != 1) {
        drawMode = 1;
    } else {
        drawMode = 0;
    }
    switch (drawMode) {
        case 0:
            curCtx = canvases.ctx;
            break;
        case 1:
            curCtx = canvases.buffer1ctx;
            break;
        case 2:
            curCtx = canvases.buffer2ctx;
            break;
    }
}

function resizeBuffers() {
    maxCvsSize = Math.max(canvases.cvs.width, canvases.cvs.height);
    sizeDif = maxCvsSize - Math.min(canvases.cvs.width, canvases.cvs.height);

    var tempSize = maxCvsSize / camera.zoom;
    var tempSizeAndPadding = tempSize + tempSize / 2;

    canvases.buffer1cvs.width = cw;
    canvases.buffer1cvs.height = ch;

    canvases.buffer2cvs.width = tempSizeAndPadding;
    canvases.buffer2cvs.height = tempSizeAndPadding;

    if (drawMode === 2) {
        difx = (canvases.buffer2cvs.width - canvases.cvs.width) / 2;
        dify = (canvases.buffer2cvs.height - canvases.cvs.height) / 2;
    } else {
        difx = 0;
        dify = 0;
    }
    canvases.ctx.imageSmoothingEnabled = false;
    canvases.buffer1ctx.imageSmoothingEnabled = false;
    canvases.buffer2ctx.imageSmoothingEnabled = false;
}

function drawButtons() {
    let pos = { x: cw - 16, y: 16 };
    //options
    rect(pos.x, pos.y, 34, 34, "#9c9c9c");
    let c = optionsHover + 45;
    rect(pos.x, pos.y, 32, 32, `rgb(${c},${c},${c})`);
    c = optionsHover + 69;
    let cc = `rgb(${c},${c},${c})`;
    rect(pos.x, pos.y - 6, 26, 4, cc);
    rect(pos.x - 6, pos.y - 6, 4, 8, cc);
    rect(pos.x, pos.y + 6, 26, 4, cc);
    rect(pos.x + 11, pos.y + 6, 4, 8, cc);
    //pause
    pos.x -= 33;
    rect(pos.x, pos.y, 34, 34, "#9c9c9c");
    c = pauseHover + 45;
    rect(pos.x, pos.y, 32, 32, `rgb(${c},${c},${c})`);
    c = pauseHover + 69;
    cc = `rgb(${c},${c},${c})`;
    if (paused) {
        shape(
            pos.x,
            pos.y,
            [
                { x: -7, y: -10 },
                { x: -7, y: 10 },
                { x: 10, y: 0 }
            ],
            cc
        );
    } else {
        rect(pos.x + 6, pos.y, 6, 20, cc);
        rect(pos.x - 6, pos.y, 6, 20, cc);
    }
}

function drawOptionsMenu() {
    if (optionsMenu) {
        let pos = { x: cw / 2 - 100, y: ch / 2 - 100 };
        rect(cw / 2, ch / 2, 200, 200, "#242424");
        text("sfx", pos.x + 2, pos.y + 30, "white", 2);
        b = optionsButtons.sfx;
        rect(b.x, b.y, b.w, b.h - 10, "#444444");
        rect(b.x - 60 + volume.sfx * 120, b.y, 8, 20, "#444444");
        text("bmg", pos.x + 2, pos.y + 60, "white", 2);
        b = optionsButtons.bmg;
        rect(b.x, b.y, b.w, b.h - 10, "#444444");
        rect(b.x - 60 + volume.bgm * 120, b.y, 8, 20, "#444444");
    }
}
var k = { a: 65, b: 66, c: 67, d: 68, e: 69, f: 70, g: 71, h: 72, i: 73, j: 74, k: 75, l: 76, m: 77, n: 78, o: 79, p: 80, q: 81, r: 82, s: 83, t: 84, u: 85, v: 86, w: 87, x: 88, y: 89, z: 90, 0: 48, 1: 49, 2: 50, 3: 51, 4: 52, 5: 53, 6: 54, 7: 55, 8: 56, 9: 57, BACKTICK: 192, MINUS: 189, EQUALS: 187, OPENSQUARE: 219, ENDSQUARE: 221, SEMICOLON: 186, SINGLEQUOTE: 222, BACKSLASH: 220, COMMA: 188, PERIOD: 190, SLASH: 191, ENTER: 13, BACKSPACE: 8, TAB: 9, CAPSLOCK: 20, SHIFT: 16, CONTROL: 17, ALT: 18, META: 91, LEFTBACKSLASH: 226, ESCAPE: 27, HOME: 36, END: 35, PAGEUP: 33, PAGEDOWN: 34, DELETE: 46, INSERT: 45, PAUSE: 19, UP: 38, DOWN: 40, LEFT: 37, RIGHT: 39, CONTEXT: 93, SPACE: 32, F1: 112, F2: 113, F3: 114, F4: 115, F5: 116, F6: 117, F7: 118, F8: 119, F9: 120, F10: 121, F11: 122, F12: 123 };
var keyPress = [];
var keyDown = [];
var mousePress = [];
var mouseDown = [];
var scroll = 0;
var mousePos = {
    x: 0,
    y: 0
};
var preventedEvents = [false, true, true];

function addListenersTo(elementToListenTo) {
    window.addEventListener("keydown", kdown);
    window.addEventListener("keyup", kup);
    elementToListenTo.addEventListener("mousedown", mdown);
    elementToListenTo.addEventListener("mouseup", mup);
    elementToListenTo.addEventListener("mousemove", mmove);
    elementToListenTo.addEventListener("contextmenu", cmenu);
    elementToListenTo.addEventListener("wheel", scrl);
}
function removeListenersFrom(elementToListenTo) {
    window.removeEventListener("keydown", kdown);
    window.removeEventListener("keyup", kup);
    elementToListenTo.removeEventListener("mousedown", mdown);
    elementToListenTo.removeEventListener("mouseup", mup);
    elementToListenTo.removeEventListener("mousemove", mmove);
    elementToListenTo.removeEventListener("contextmenu", cmenu);
    elementToListenTo.removeEventListener("wheel", scrl);
}
function resetInput() {
    for (var i = 0; i < keyPress.length; i++) {
        if (keyPress[i]) {
            keyPress[i] = 0;
        }
    }
    for (var i = 0; i < mousePress.length; i++) {
        if (mousePress[i]) {
            mousePress[i] = 0;
        }
    }
    scroll = 0;
}
function kdown(e) {
    var h = e.keyCode;
    keyPress[h] = keyPress[h] == [][[]] ? 1 : 0;
    keyDown[h] = 1;
    if (preventedEvents[0]) {
        e.preventDefault();
    }
}
function kup(e) {
    var h = e.keyCode;
    delete keyPress[h];
    delete keyDown[h];
}
function mdown(e) {
    var h = e.button;
    mousePress[h] = mousePress[h] == [][[]] ? 1 : 0;
    mouseDown[h] = 1;
    if (preventedEvents[1]) {
        e.preventDefault();
    }
}
function mup(e) {
    var h = e.button;
    delete mousePress[h];
    delete mouseDown[h];
}
function mmove(e) {
    mousePos.x = e.offsetX;
    mousePos.y = e.offsetY;
}
function cmenu(e) {
    if (preventedEvents[1]) {
        e.preventDefault();
    }
}
function scrl(e) {
    scroll += -1 * (e.deltaY / 100);
    if (preventedEvents[2]) {
        e.preventDefault();
    }
}
function dist(point1, point2) {
    let one = point2.x - point1.x;
    let two = point2.y - point1.y;
    return Math.sqrt(one * one + two * two);
}

function circlecircle(circle1, circle2) {
    if (dist(circle1, circle2) < circle1.r + circle2.r) {
        return true;
    } else {
        return false;
    }
}

function circlepoint(circle, point) {
    if (dist(circle, point) < circle.r) {
        return true;
    } else {
        return false;
    }
}

function rectrect(rect1, rect2) {
    if (rect1.x + rect1.w / 2 >= rect2.x - rect2.w / 2 && rect1.x - rect1.w / 2 <= rect2.x + rect2.w / 2 && rect1.y + rect1.h / 2 >= rect2.y - rect2.h / 2 && rect1.y - rect1.h / 2 <= rect2.y + rect2.h / 2) {
        return true;
    } else {
        return false;
    }
}

function rectpoint(rect, point) {
    if (rect.x + rect.w / 2 >= point.x && rect.x - rect.w / 2 <= point.x && rect.y + rect.h / 2 >= point.y && rect.y - rect.h / 2 <= point.y) {
        return true;
    } else {
        return false;
    }
}

function circlerect(circle, rect) {
    //credit: https://yal.cc/rectangle-circle-intersection-test/
    let rectHalfWidth = rect.w / 2;
    let rectHalfHeight = rect.h / 2;
    let deltaX = circle.x - Math.max(rect.x - rectHalfWidth, Math.min(circle.x, rect.x + rectHalfWidth));
    let deltaY = circle.y - Math.max(rect.y - rectHalfHeight, Math.min(circle.y, rect.y + rectHalfHeight));
    return deltaX * deltaX + deltaY * deltaY < circle.r * circle.r;
}

// create globals
var canvases = { cvs: null, ctx: null, buffer1cvs: null, buffer1ctx: null, buffer2cvs: null, buffer2ctx: null }, // visable and hidden canvases
    cw, // canvas width
    ch, // canvas height
    camera = { zoom: 1, angle: 0, x: 0, y: 0 }, // affects how everything is drawn
    updateFPS = 60,
    gameStarted = false,
    drawMode = 0, // 0=normal, 1=zoomed, 2=zoomed/rotated, set automatically depending on camera
    absDraw = false,
    curCtx, // what canvas to draw to
    maxCvsSize, // used by second buffer
    canvasScale = 1,
    difx = 0, // offsets for drawing
    dify = 0,
    seperateInputLoop = true,
    edge = { top: null, bottom: null, left: null, right: null }, // used by if___OnEdgeBounce, set to canvas size at setup, can be changed whenever
    drawLimitLeft,
    drawLimitRight,
    drawLimitTop,
    drawLimitBottom,
    sizeDif,
    bug = "\uD83D\uDC1B",
    loadingCircle,
    loadAng = 0,
    optionsHover = 0,
    pauseHover = 0,
    optionsMenu = false,
    optionsButtons = {},
    clickSound,
    paused = false,
    screenSize = "1:1",
    autoScale = 1,
    images = [], // put image paths here
    imagePaths = [],
    imgs = [],
    sprites = {}, // loaded images
    audio = [], // put audio paths here
    audioPaths = [],
    sounds = {}, // loaded sounds
    abuffer = [], // audio nodes shoved here
    volumeList = [], // gain nodes shoved here
    audioLoadedLength = 0,
    volume = { sfx: 1, bgm: 1 };

(cursor = { sprite: null, alignment: 1, show: true }), // 0=topleft, 1=centered
    (mouseOnCanvas = false);

const acceptableChars = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890_-. "; //for image names

AudioContext = window.AudioContext || window.webkitAudioContext;
var context;
var sfxVolumeNode;
var bmgVolumeNode;

dGet("game").onmouseout = function () {
    mouseOnCanvas = false;
};
dGet("game").onmouseover = function () {
    mouseOnCanvas = true;
};

//setup canvases and input
function setup(physicsFPS) {
    updateFPS = physicsFPS;

    canvases.cvs = dGet("game");
    canvases.cvs.width = document.body.clientWidth;
    canvases.cvs.height = document.body.offsetHeight < window.innerHeight ? window.innerHeight : document.body.offsetHeight;
    cw = canvases.cvs.width;
    ch = canvases.cvs.height;
    canvases.ctx = canvases.cvs.getContext("2d", { alpha: false });

    canvases.cvs.onmousedown = function () {
        if (!gameStarted) {
            loadImagesAndSounds();
            gameStarted = true;
        }
    };

    createCanvas("buffer1");
    createCanvas("buffer2");

    canvases.ctx.imageSmoothingEnabled = false;
    canvases.buffer1ctx.imageSmoothingEnabled = false;
    canvases.buffer2ctx.imageSmoothingEnabled = false;

    maxCvsSize = Math.max(canvases.cvs.width, canvases.cvs.height);
    sizeDif = maxCvsSize - Math.min(canvases.cvs.width, canvases.cvs.height);
    cw = canvases.cvs.width;
    ch = canvases.cvs.height;

    addFont();
    addStyle();

    addListenersTo(UIBase.element);

    curCtx = canvases.ctx;
    requestAnimationFrame(startButton);
    function startButton() {
        canvases.cvs.width = document.body.clientWidth;
        canvases.cvs.height = (document.body.offsetHeight < window.innerHeight ? window.innerHeight : document.body.offsetHeight) - 1;
        cw = canvases.cvs.width;
        ch = canvases.cvs.height;
        curCtx.fillStyle = "#101010";
        curCtx.fillRect(0, 0, cw, ch);
        circle(cw / 2, ch / 2, 27, "#066312");
        circle(cw / 2, ch / 2, 23, "#149124");
        shape(
            cw / 2,
            ch / 2,
            [
                { x: -7, y: -15 },
                { x: -7, y: 15 },
                { x: 15, y: 0 }
            ],
            "#47f55d"
        );
        if (!gameStarted) {
            requestAnimationFrame(startButton);
        }
    }
}

function drawLoop() {
    canvases.cvs.width = document.body.clientWidth;
    canvases.cvs.height = (document.body.offsetHeight < window.innerHeight ? window.innerHeight : document.body.offsetHeight) - 1;
    cw = canvases.cvs.width;
    ch = canvases.cvs.height;

    switchDrawMode();

    resizeBuffers();

    clearCanvases();

    var limitModifyer = 0;
    if (drawMode == 2) {
        limitModifyer = canvases.buffer2cvs.width - maxCvsSize;
    }
    drawLimitLeft = -camera.x - (drawMode == 2 ? sizeDif : 0) - limitModifyer;
    drawLimitRight = -camera.x + maxCvsSize + (drawMode == 2 ? sizeDif : 0) + limitModifyer;
    drawLimitTop = -camera.y - (drawMode == 2 ? sizeDif : 0) - limitModifyer;
    drawLimitBottom = -camera.y + maxCvsSize + (drawMode == 2 ? sizeDif : 0) + limitModifyer;

    draw();

    render();

    curCtx = canvases.ctx;
    difx = 0;
    dify = 0;
    var camCache = { x: camera.x, y: camera.y };
    var drawModeCache = drawMode;
    camera.x = 0;
    camera.y = 0;
    drawMode = 0;
    absDraw = true;
    try {
        absoluteDraw();
    } catch (err) {}
    absDraw = false;

    let pos = { x: cw / 2 - 100, y: ch / 2 - 100 };
    optionsButtons.sfx = { x: pos.x + 125, y: pos.y + 40, w: 120, h: 20 };
    optionsButtons.bmg = { x: pos.x + 125, y: pos.y + 70, w: 120, h: 20 };

    drawButtons();
    drawOptionsMenu();
    drawCursor();

    drawMode = drawModeCache;

    camera.x = camCache.x;
    camera.y = camCache.y;

    requestAnimationFrame(drawLoop);
}

function updateLoop() {
    if (seperateInputLoop == false) {
        handleOptionsInput();
    }
    sfxVolumeNode.gain.value = volume.sfx;
    bmgVolumeNode.gain.value = volume.bgm;
    if (!paused) {
        update();
    }

    if (seperateInputLoop == false) {
        resetInput();
    }
}

function inputLoop() {
    handleOptionsInput();
    if (!paused) {
        input();
    }

    resetInput();
}

const SPAWN_ATTEMPTS_MAX = 50;

const BATTLE_ENEMIES_MAX = 5;
const BATTLE_FORMATION_OFFSETS = [
    [[0,0]],
    [[0,-1],[0,1]],
    [[0,0],[1,-2],[1,2]],
    [[0,-1],[0,1],[1,-3],[1,3]],
    [[0,0],[1,-2],[1,2],[2,-4],[2,4]]
];
const BATTLE_GROUP_RADIUS = 50;

const PLAYER_ACCELERATION = 0.05;
const PLAYER_FRICTION = 0.3;
const PLAYER_MAX_VEL = 1;
// rounds to nearest 16
function roundToGrid(number) {
    return Math.round(number / 16) * 16;
}

// clamps a value between min and max
function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

// linear interpolation towards somewhere
function lerp(start, end, amt) {
    return (1 - amt) * start + amt * end;
}

// returns a new value with friction applied
function friction(value, amount) {
    if (value > 0) {
        value -= amount;
    }
    if (value < 0) {
        value += amount;
    }
    if (Math.abs(value) < amount * 2) {
        value = 0;
    }
    return value;
}

const tau = Math.PI * 2;
const pi = Math.PI;
const halfPI = pi / 2;
// returns a new angle that gets closer to the target angle
function turn(cur, target, speed) {
    if (target < 0) {
        target = tau + target;
    }
    if (cur % tau > target) {
        if ((cur % tau) - target > pi) {
            cur += speed;
        } else {
            cur -= speed;
        }
    } else {
        if (target - (cur % tau) > pi) {
            cur -= speed;
        } else {
            cur += speed;
        }
    }
    if (Math.abs(cur - target) < speed * 1.1) {
        cur = target;
    }
    if (cur > tau) {
        cur = cur - tau;
    }
    if (cur < 0) {
        cur = tau + cur;
    }
    return cur;
}

// maps one range of values to another
function mapRange(value, valueLow, valueHigh, remappedLow, remappedHigh) {
    return remappedLow + ((remappedHigh - remappedLow) * (value - valueLow)) / (valueHigh - valueLow);
}

var cutSceneFrame = 0; // update count since the cutscene started
var cutScenePlaying = 0; // index of current cutscene

var cutSceneData; // variable that can hold any data needed for a cutscene

var cutScenes = [
    // 0: room transition out
    {
        update: function () {
            player.x += Math.cos(player.angle) / 2;
            player.y += Math.sin(player.angle) / 2;
            if (cutSceneFrame > 20) {
                loadRoom(cutSceneData.room, cutSceneData.entranceID);
                playCutscene(1);
            }
        },
        draw: function () {
            rect(worldW * 8, worldH * 8, worldW * 16, worldH * 16, `rgba(0,0,0,${mapRange(cutSceneFrame, 0, 20, 0, 1)})`);
        }
    },
    // 1: room transition in
    {
        update: function () {
            player.vel = 1;
            player.update();
            if (cutSceneFrame > cutSceneData.walkTime) {
                globalState = states.OVERWORLD;
            }
        },
        draw: function () {
            rect(worldW * 8, worldH * 8, worldW * 16, worldH * 16, `rgba(0,0,0,${mapRange(cutSceneFrame, 0, 20, 1, 0)})`);
        }
    },
    // 2: battle transition in
    {
        update: function () {
            if (cutSceneFrame === 0) {
                var start = { x: -(camera.x - canvases.cvs.width / 2), y: -(camera.y - canvases.cvs.height / 2) };
                this.lerpAmount = { x: (start.x - player.x) / 100, y: (start.y - player.y) / 100 };
            }
            camera.zoom = 3 + cutSceneFrame / 20;
            camera.angle = (1 - Math.cos(((cutSceneFrame / 100) * pi) / 2)) * 3.4;
            centerCameraOn(-(camera.x - canvases.cvs.width / 2) - this.lerpAmount.x, -(camera.y - canvases.cvs.height / 2) - this.lerpAmount.y);
            if (cutSceneFrame > 100) {
                enterBattleWith(cutSceneData);
            }
        },
        draw: function () {
            rect(worldW * 8, worldH * 8, worldW * 16, worldH * 16, `rgba(0,0,0,${mapRange(cutSceneFrame*cutSceneFrame*cutSceneFrame, 0, 1000000, 0, 1)})`);
        }
    }
];

function playCutscene(cutsceneIndex) {
    cutScenePlaying = cutsceneIndex;
    globalState = states.CUTSCENE;
    cutSceneFrame = 0;
}

function handleCutScene(isNewState) {
    if (isNewState) {
        cutSceneFrame = 0;
    }
    cutScenes[cutScenePlaying].update();
    cutSceneFrame++;
}

function drawCutScene() {
    drawOverWorld();
    cutScenes[cutScenePlaying].draw();
}

class Entity {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    // if the entity has collided
    get colliding() {
        var cols = this.collisions;
        for (var i = 0, l = cols.length; i < l; i++) {
            if (rectrect(this, cols[i])) {
                return true;
            }
        }
        return false;
    }

    // returns array of all potential collisions
    get collisions() {
        var cols = [...overworldCollisions, player, ...worldEnemies];
        for (var i = 0, l = cols.length; i < l; i++) {
            if (cols[i].x === this.x && cols[i].y === this.y) {
                cols.splice(i, 1);
                break;
            }
        }
        return cols;
    }
}

class Player extends Entity {
    constructor() {
        super(0, 0, 14, 14);
        this.angle = 0;
        this.vel = 0;
        this.walkCycle = 1;
    }
}

Player.prototype.update = function () {
    // movement
    var wasInput = false;
    var angle = 0;
    var divisor = 0;
    // up
    if (keyDown[k.w]) {
        this.vel += PLAYER_ACCELERATION;
        angle -= Math.PI / 2;
        wasInput = true;
        divisor++;
    }
    // down
    if (keyDown[k.s]) {
        this.vel += PLAYER_ACCELERATION;
        wasInput = true;
        angle += Math.PI / 2;
        divisor++;
    }
    // left
    if (keyDown[k.a]) {
        this.vel += PLAYER_ACCELERATION;
        wasInput = true;
        angle -= Math.PI * (keyDown[k.s] ? -1 : 1);
        divisor++;
    }
    // right
    if (keyDown[k.d]) {
        this.vel += PLAYER_ACCELERATION;
        wasInput = true;

        divisor++;
    }
    // determine angle
    divisor = divisor === 0 ? 1 : divisor;
    angle /= divisor;

    // turn towards target angle
    if (wasInput) {
        this.angle = turn(this.angle, angle, 0.15);
    }

    // limit speed
    this.vel = clamp(this.vel, 0, PLAYER_MAX_VEL);

    // friction
    if (!wasInput) {
        this.vel = friction(this.vel, PLAYER_FRICTION);
    }

    var cols = this.collisions;

    // move x
    this.x += Math.cos(this.angle) * this.vel;
    for (var i = 0, l = cols.length; i < l; i++) {
        if (rectrect(this, cols[i])) {
            this.x -= Math.cos(this.angle) * this.vel;
        }
    }

    // move y
    this.y += Math.sin(this.angle) * this.vel;
    for (var i = 0, l = cols.length; i < l; i++) {
        if (rectrect(this, cols[i])) {
            this.y -= Math.sin(this.angle) * this.vel;
        }
    }

    // increase walk cycle
    this.walkCycle += Math.abs(this.vel / 5);
    // set animation to idle if not moving
    if (this.vel == 0) {
        this.walkCycle = 3;
    }
    // loop cycle
    if (this.walkCycle >= 11) {
        this.walkCycle = 1;
    }

    this.moveCamera();

    this.w = 18;
    this.h = 18;
    for(var i=0,l=worldEnemies.length;i<l;i++) {
        if(rectrect(this, worldEnemies[i])) {
            cutSceneData = i;
            playCutscene(2);
        }
    }
    this.w = 14;
    this.h = 14;
};

Player.prototype.moveCamera = function () {
    camera.zoom = 3;
    var cameraTargetPosition = { x: this.x, y: this.y };

    var w = worldTiles[0].length;
    var h = worldTiles.length;

    // if the room smaller than canvas, set camera to center. Otherwise prevent  camera from going off screen
    if (h * 48 < ch) {
        cameraTargetPosition.y = worldTiles.length * 8;
    } else {
        if (cameraTargetPosition.y < ch / 2 / camera.zoom) {
            cameraTargetPosition.y = ch / 2 / camera.zoom;
        }
        if (cameraTargetPosition.y > h * 16 - ch / 2 / camera.zoom) {
            cameraTargetPosition.y = h * 16 - ch / 2 / camera.zoom;
        }
    }

    // if the room smaller than canvas, set camera to center. Otherwise prevent  camera from going off screen
    if (w * 48 < cw) {
        cameraTargetPosition.x = worldTiles[0].length * 8;
    } else {
        if (cameraTargetPosition.x < cw / 2 / camera.zoom) {
            cameraTargetPosition.x = cw / 2 / camera.zoom;
        }
        if (cameraTargetPosition.x > w * 16 - cw / 2 / camera.zoom) {
            cameraTargetPosition.x = w * 16 - cw / 2 / camera.zoom;
        }
    }

    centerCameraOn(cameraTargetPosition.x, cameraTargetPosition.y);
};

Player.prototype.draw = function () {
    var cycle = Math.floor(this.walkCycle);
    cycle = cycle > 5 ? 11 - cycle : cycle;
    imgIgnoreCutoff(sprites[`player${cycle}`], this.x, this.y, this.angle);
};

var enemyIDs = ["Slime","AngryHedge"];

var enemyClasses = {};

var worldEnemies = [];
var fightEnemies = [];

const enemyMovementTypes = {
    jump: 0,
    walk: 1
};

class Enemy extends Entity {
    constructor(x, y, w, h, variation) {
        super(x, y, w, h);

        this.angle = 0;
        this.speed = 0;
        this.calculateVelocity();

        this.agroed = false;

        this.drawScale = 1;
        this.variation = variation;

        this.updateCount = 0;

        this.spawnerObjectIndex = -1;
    }
}

Enemy.prototype.movementType = enemyMovementTypes.jump;

Enemy.prototype.baseHP = 10;

Enemy.prototype.agroRadius = 200;

Enemy.prototype.imageName = "debug";

Enemy.prototype.baseUpdate = function () {
    if (!this.agroed) {
        if (dist(this, player) < this.agroRadius) {
            this.agroed = true;
        }
    } else {
        var moveX = 0;
        var moveY = 0;

        var cols = this.collisions;
        switch (this.movementType) {
            case enemyMovementTypes.jump:
                this.speed = 1;
                var time = this.updateCount % 50;
                this.drawScale = 1;
                if (time < 25) {
                    moveX = this.velocity.x * (time < 18 ? 1 : 0.5);
                    moveY = this.velocity.y * (time < 18 ? 1 : 0.5);
                    this.drawScale = 1 + Math.sin(time / 7.65) / 2;
                } else {
                    this.angle = turn(this.angle, pointTo(this, player), 0.05);
                    this.calculateVelocity();
                }
                break;
            case enemyMovementTypes.walk:
                this.angle = turn(this.angle, pointTo(this, player), 0.05);
                if(this.speed < 0.8) {
                    this.speed += 0.1;
                }
                this.calculateVelocity();
                moveX = this.velocity.x;
                moveY = this.velocity.y;
                break;
        }

        this.x += moveX;
        for (var i = 0, l = cols.length; i < l; i++) {
            if (rectrect(this, cols[i])) {
                this.x -= moveX;
                if (cols[i].__proto__.constructor.name !== "Object") {
                    cols[i].x += moveX / 2;
                    if(cols[i].colliding) {
                        cols[i].x -= moveX / 2;
                    }
                }
                break;
            }
        }

        this.y += moveY;
        for (var i = 0, l = cols.length; i < l; i++) {
            if (rectrect(this, cols[i])) {
                this.y -= moveY;
                if (cols[i].__proto__.constructor.name !== "Object") {
                    cols[i].y += moveY / 2;
                    if(cols[i].colliding) {
                        cols[i].y -= moveY / 2;
                    }
                }
                break;
            }
        }
    }

    this.updateCount++;

    return false;
};

Enemy.prototype.update = function () {};

Enemy.prototype.calculateVelocity = function () {
    this.velocity = { x: Math.cos(this.angle) * this.speed, y: Math.sin(this.angle) * this.speed };
};

Enemy.prototype.draw = function () {
    imgIgnoreCutoff(sprites[`${this.imageName}${this.variation}`], this.x, this.y, this.angle, this.drawScale, this.drawScale);
};

function updateEnemies() {
    for (var i = 0, l = worldEnemies.length; i < l; i++) {
        if(worldEnemies[i].baseUpdate()) {
            if(worldEnemies[i].spawnerObjectIndex !== -1) {
                worldObjects[worldEnemies[i].spawnerObjectIndex].spawnCount--;
                worldEnemies.splice(i,1);
                i--;
            }
        }
        worldEnemies[i].update();
    }
}

function drawEnemies() {
    for (var i = 0, l = worldEnemies.length; i < l; i++) {
        worldEnemies[i].draw();
    }
}

class Slime extends Enemy {
    constructor(x, y, variation) {
        super(x, y, 14, 14, variation);
    }
}

Slime.prototype.imageName = "slime";

Slime.prototype.movementType = enemyMovementTypes.jump;

Slime.prototype.baseHP = 10;

enemyClasses.Slime = Slime;

class AngryHedge extends Enemy {
    constructor(x, y, variation) {
        super(x, y, 12, 12, variation);
    }
}

AngryHedge.prototype.imageName = "angryHedge";

AngryHedge.prototype.movementType = enemyMovementTypes.walk;

AngryHedge.prototype.baseHP = 10;

enemyClasses.AngryHedge = AngryHedge;

var player = new Player();

var overworldCollisions = [];

function handleOverWorld(isNewState) {
    if (keyPress[k.BACKSLASH]) {
        desiredState = states.BUILDING;
        globalState = states.LOADING;
        globalLoading = false;
    }

    if (!cutScene) {
        for (var i = 0, l = worldObjects.length; i < l; i++) {
            worldObjects[i].update();
        }
        player.update();
        updateEnemies();
    }
}

function drawOverWorld() {
    var x = worldTiles[0].length * 8;
    var y = worldTiles.length * 8;
    imgIgnoreCutoff({ spr: worldLayers.ground, drawLimitSize: 0 }, x, y);
    player.draw();
    drawEnemies();
    imgIgnoreCutoff({ spr: worldLayers.walls, drawLimitSize: 0 }, x, y);
    imgIgnoreCutoff({ spr: worldLayers.objects, drawLimitSize: 0 }, x, y);

    // show collision
    // for(var i=0;i<overworldCollisions.length;i++) {
    //     var c = overworldCollisions[i];
    //     rectOutline(c.x,c.y,c.w,c.h);
    // }
}

var battleEnemies = [];

function enterBattleWith(enemyIndex) {
    battleEnemies = [worldEnemies[enemyIndex]];

    // find close enemies
    for (var i = 0, l = worldEnemies.length; i < l; i++) {
        if (i === enemyIndex) {
            continue;
        }
        if (dist(worldEnemies[enemyIndex], worldEnemies[i]) < BATTLE_GROUP_RADIUS) {
            battleEnemies.push(worldEnemies[i]);
        }
        if (battleEnemies.length === BATTLE_ENEMIES_MAX) {
            break;
        }
    }

    // generate battle map
    worldTiles = [];
    worldObjects = [];
    worldW = Math.floor(cw / 64) + 2;
    worldH = Math.floor(ch / 64) + 2;

    for (var y = 0; y < worldH; y++) {
        var arr = [];
        for (var x = 0; x < worldW; x++) {
            var tileType = tileFromBiome(worldBiome);
            arr.push(new tileClasses[tileIDs[tileType[0]]](x, y, tileType[0], tileType[1], rand(0, 3)));
        }
        worldTiles.push(arr);
    }

    // enemy formation
    var center = { x: worldW * 10, y: worldH * 8 };
    var offsets = BATTLE_FORMATION_OFFSETS[battleEnemies.length - 1];
    for (var i = 0; i < offsets.length; i++) {
        battleEnemies[i].x = center.x + offsets[i][0] * 16;
        battleEnemies[i].y = center.y + offsets[i][1] * 16;
        battleEnemies[i].angle = pi;
        battleEnemies[i].drawScale = 1;
    }

    // player
    player.x = worldW * 6;
    player.y = worldH * 8;
    player.angle = 0;
    player.walkCycle = 3;

    load(states.BATTLE);
    renderLayers();
}

function handleBattle(isNewState) {
    if (!cutScene) {
        for (var i = 0, l = battleEnemies.length; i < l; i++) {
            // battleEnemies[i].baseUpdate();
            // battleEnemies[i].update();
        }
        // player.update();
        camera.zoom = 4;
        centerCameraOn(worldW * 8, worldH * 8);
    }
}

function drawBattle() {
    var x = worldTiles[0].length * 8;
    var y = worldTiles.length * 8;
    imgIgnoreCutoff({ spr: worldLayers.ground, drawLimitSize: 0 }, x, y);
    player.draw();
    for (var i = 0, l = battleEnemies.length; i < l; i++) {
        battleEnemies[i].draw();
    }
    imgIgnoreCutoff({ spr: worldLayers.walls, drawLimitSize: 0 }, x, y);
    imgIgnoreCutoff({ spr: worldLayers.objects, drawLimitSize: 0 }, x, y);
}

var worldTiles = [];
var worldObjects = [];

var worldW;
var worldH;

var worldBiome;

var worldLayers = {
    ground: null,
    walls: null,
    objects: null
};

const biomes = {
    grass: 0,
    grassTown: 1
};

// returns [tile id, variation]
function tileFromBiome(biome) {
    var tileID;
    var tileVariation;
    switch(biome) {
        case biomes.grass:
        case biomes.grassTown:
            tileID = 0;
            tileVariation = rand(0,10) ? 0 : 1;
            break;
    }

    return [tileID,tileVariation];
}

function getRoomObject() {
    var exportObj = {};

    // name
    exportObj.name = dGet("name").value;

    exportObj.biome = worldBiome;

    // dimensions
    exportObj.w = worldTiles[0].length;
    exportObj.h = worldTiles.length;

    // tiles
    var tiles = "";
    for (var y = 0; y < worldH; y++) {
        for (var x = 0; x < worldW; x++) {
            tiles += worldTiles[y][x].data + ",";
        }
    }
    tiles = tiles.substring(0, tiles.length - 1);
    exportObj.tiles = tiles;

    // objects
    var objects = "";
    for (var i = 0, l = worldObjects.length; i < l; i++) {
        objects += worldObjects[i].data + ",";
    }
    objects = objects.substring(0, objects.length - 1);
    exportObj.objects = objects;

    return exportObj;
}

// loads a room, pre renders, and makes collisions
function loadRoom(roomIndex, entranceID = "") {
    globalLoading = true;
    fetch(roomBaseDir + rooms[roomIndex]).then((response) =>
        response.json().then((data) => {
            loadRoomObject(data);
            renderLayers();
            makeRoomCollisions();
            for (var i = 0, l = worldObjects.length; i < l; i++) {
                var o = worldObjects[i];
                if (i + 1 === l) {
                    player.x = 100;
                    player.y = 100;
                }
                if (o.meta.entranceID === entranceID) {
                    player.x = o.x;
                    player.y = o.y;
                    player.angle = o.rotation;
                    player.x += Math.cos(player.angle) * 10;
                    player.y += Math.sin(player.angle) * 10;
                    break;
                }
            }
            for (var i = 0, l = worldObjects.length; i < l; i++) {
                worldObjects[i].initialize();
            }
            globalLoading = false;
        })
    );
}

// parses an object to load a room
function loadRoomObject(json) {
    // name
    dGet("name").value = json.name;

    // dimensions
    var w = json.w;
    dGet("roomW").value = json.w;
    worldW = w;
    var h = json.h;
    dGet("roomH").value = json.h;
    worldH = h;

    worldBiome = json.biome;

    // tiles
    worldTiles = [];
    var jsonTiles = json.tiles.split(",");
    for (var y = 0; y < h; y++) {
        var row = [];
        for (var x = 0; x < w; x++) {
            var data = jsonTiles[x + y * w].split(".");
            var dl = data.length;
            row.push(new tileClasses[tileIDs[parseInt(data[0])]](x, y, parseInt(data[0]), dl > 1 ? parseInt(data[1]) : 0, dl > 2 ? parseInt(data[2]) : 0));
        }
        worldTiles.push(row);
    }

    worldObjects = [];
    var jsonObjects = json.objects.split(",");
    if (jsonObjects.length > 0) {
        if (jsonObjects[0].length > 0) {
            for (var i = 0, l = jsonObjects.length; i < l; i++) {
                var data = jsonObjects[i].split("~");
                worldObjects.push(new objectClasses[objectIDs[parseInt(data[2])]](parseInt(data[0]) + 0.5, parseInt(data[1]) + 0.5, parseInt(data[2]), parseInt(data[3]), parseInt(data[4]), data[5]));
            }
        }
    }
}

// goes through all tiles, and creates collisions for wall tiles
function makeRoomCollisions() {
    overworldCollisions = [];

    // 2d array of booleans for if there is a wall tile
    var wallTiles = [];

    // 2d array of booleans for if a tile has gotten a collision made for it
    var hasCollision = [];

    // fill arrays
    for (var y = 0; y < worldH; y++) {
        var wallsRow = [];
        var colRow = [];
        for (var x = 0; x < worldW; x++) {
            wallsRow.push(worldTiles[y][x].layer === layers.wall ? true : false);
            colRow.push(false);
        }
        wallTiles.push(wallsRow);
        hasCollision.push(colRow);
    }

    // try to make large rectangles that cover multiple walls to make collision more efficient

    for (var y = 0; y < worldH; y++) {
        for (var x = 0; x < worldW; x++) {
            if (!hasCollision[y][x] && wallTiles[y][x]) {
                // find right limit
                var xPos = x;
                while (xPos < worldW && wallTiles[y][xPos]) {
                    xPos++;
                }
                xPos--;

                // find bottom limit
                var yPos = y;
                var fullRow = true;
                // go down row by row
                while (yPos < worldH && wallTiles[yPos][xPos] && fullRow) {
                    yPos++;
                    // go through the whole row, make sure it is full
                    var rowX = xPos;
                    while (rowX > -1 && wallTiles[yPos][rowX]) {
                        rowX--;
                    }
                    // if the row is not full, stop
                    if (rowX + 1 !== x) {
                        fullRow = false;
                        yPos--;
                    }
                }

                // track what tiles have gotten collision
                for (var y2 = y; y2 < yPos + 1; y2++) {
                    for (var x2 = x; x2 < xPos + 1; x2++) {
                        hasCollision[y2][x2] = true;
                    }
                }

                // find collider dimensions
                var colX = (x + xPos + 1) / 2;
                var colY = (y + yPos + 1) / 2;
                var colW = xPos - x + 1;
                var colH = yPos - y + 1;

                // add collider
                overworldCollisions.push({ x: colX * 16, y: colY * 16, w: colW * 16, h: colH * 16 });
            }
        }
    }
}

var buildUIBuilt = false;

var buildSelection = { type: "tile", ID: 0, variance: 0, rotation: 0, menuPos: { x: 0, y: 1 }, objectIndex: -1 };

var buildTool = "pen";

var buildLastPos = { x: 0, y: 0 };

var buildRandomizeAngle = false;

var undo = { states: [], pos: -1, lastStep: "forward", lastActionWasEdit: false, bufferSize: 200 };

var typing = false;

function handleBuild(isNewState) {
    if (isNewState) {
        canvases.cvs.style.cursor = "none";
        // generate build ui
        if (!buildUIBuilt) {
            generateBuildUI();
            buildUIBuilt = true;
        }
        dGet("build").style.display = "block";
        dGet("hideShow").style.display = "block";
        dGet("object").style.display = "block";
        buildSelection.objectIndex = -1;
        trackUndo();
    }

    // exit build
    if (keyPress[k.BACKSLASH]) {
        canvases.cvs.style.cursor = "crosshair";
        dGet("build").style.display = "none";
        dGet("hideShow").style.display = "none";
        dGet("object").style.display = "none";
        load(states.OVERWORLD);
        renderLayers();
        makeRoomCollisions();
    }

    // get args for selected object
    if (buildSelection.objectIndex === -1) {
        objectUIDiv.innerHTML = "";
    } else {
        if (updateCount % 10 == 0) {
            var argsLength = new objectClasses[objectIDs[worldObjects[buildSelection.objectIndex].objectID]](0, 0, 0, 0, 0, "").metaArguments.length;
            for (var i = 0; i < argsLength; i++) {
                var elem = dGet("objectMeta" + i);
                worldObjects[buildSelection.objectIndex].meta[elem.labelName] = parseInt(elem.value).toString().length === elem.value.length ? parseInt(elem.value) : elem.value;
            }
        }
    }

    worldBiome = parseInt(dGet("biome").value);

    buildRandomizeAngle = dGet("randAngle").checked;

    // position selector
    var tableSelStyle = dGet("tableSelection").style;
    tableSelStyle.top = buildSelection.menuPos.y * 43 - 2 + "px";
    tableSelStyle.left = buildSelection.menuPos.x * 42 + "px";

    // select tiles
    if (keyPress[k.UP]) {
        if (tileTableValid(0, -1)) {
            buildSelection.menuPos.y--;
            pressSelectedTile();
        }
    }
    if (keyPress[k.DOWN]) {
        if (tileTableValid(0, 1)) {
            buildSelection.menuPos.y++;
            pressSelectedTile();
        }
    }
    if (keyPress[k.LEFT]) {
        if (tileTableValid(-1, 0)) {
            buildSelection.menuPos.x--;
            pressSelectedTile();
        }
    }
    if (keyPress[k.RIGHT]) {
        if (tileTableValid(1, 0)) {
            buildSelection.menuPos.x++;
            pressSelectedTile();
        }
    }

    // select variance
    var variations = dGet("buildVariations").children[0];
    if (variations !== undefined) {
        for (var i = 1, l = variations.children.length; i < 10 && i <= l; i++) {
            if (keyPress[k[i + ""]]) {
                variations.children[i - 1].children[0].onclick();
            }
        }
    }

    // camera
    if (keyDown[k.a]) {
        moveCamera(-10 / camera.zoom, 0);
    }
    if (keyDown[k.d]) {
        moveCamera(10 / camera.zoom, 0);
    }
    if (keyDown[k.w]) {
        moveCamera(0, -10 / camera.zoom);
    }
    if (keyDown[k.s]) {
        moveCamera(0, 10 / camera.zoom);
    }

    // scroll
    if (scroll && (scroll < 0 ? camera.zoom > 1 : true)) {
        var scrollAmount = 1;
        if (scroll < 0) {
            scrollAmount = -1;
        }

        var factor = 1 - camera.zoom / (camera.zoom + scrollAmount);

        var mPos = mousePosition();
        camera.x -= (mousePos.x - cw / 2) * factor;
        camera.y -= (mousePos.y - ch / 2) * factor;

        camera.zoom += scrollAmount;
    }

    // rotate
    if (keyPress[k.q]) {
        if (--buildSelection.rotation < 0) {
            buildSelection.rotation = 3;
        }
    }
    if (keyPress[k.e]) {
        if (++buildSelection.rotation > 3) {
            buildSelection.rotation = 0;
        }
    }

    // switch tools
    if (keyPress[k.x]) {
        buildTool = "pen";
    }
    if (keyPress[k.c]) {
        buildTool = "bucket";
    }
    if (keyPress[k.v] || keyPress[k.ESCAPE]) {
        buildTool = "pointer";
    }

    // hide object UI
    if (keyPress[k.ESCAPE]) {
        dGet("enemyTable").style.display = "none";
        buildSelection.objectIndex = -1;
        objectUIDiv.innerHTML = "";
    }

    // delete selected object
    if (keyPress[k.BACKSPACE] || (keyPress[k.DELETE] && buildSelection.objectIndex > -1)) {
        worldObjects.splice(buildSelection.objectIndex, 1);
        buildSelection.objectIndex--;
        generateObjectUI();
    }

    if (worldTiles.length > 0) {
        // center
        if (keyPress[k.SHIFT]) {
            centerCameraOn((worldW - 1) * 8, (worldH - 1) * 8);
        }

        var mPos = mousePosition();
        mPos.x = clamp(roundToGrid(mPos.x) / 16, 0, worldW - 1);
        mPos.y = clamp(roundToGrid(mPos.y) / 16, 0, worldH - 1);

        // track undo
        if (mousePress[0]) {
            trackUndo();
        }

        // undo
        if (keyPress[k.z]) {
            if (undo.pos > -1) {
                if (undo.lastActionWasEdit) {
                    undo.states.push(JSON.stringify(getRoomObject()));
                } else if (undo.lastStep === "forward") {
                    undo.pos--;
                }
                loadRoomObject(JSON.parse(undo.states[undo.pos]));
                undo.pos--;
                undo.lastStep = "back";
                undo.lastActionWasEdit = false;

                buildSelection.objectIndex = worldObjects.length - 1;
                generateObjectUI();
            }
        }

        // redo
        if (keyPress[k.y]) {
            if (undo.pos < undo.states.length - 1) {
                if (undo.lastStep === "back") {
                    undo.pos++;
                }
                undo.pos++;
                loadRoomObject(JSON.parse(undo.states[undo.pos]));
                undo.lastStep = "forward";
                undo.lastActionWasEdit = false;

                buildSelection.objectIndex = worldObjects.length - 1;
                generateObjectUI();
            }
        }

        // tools
        switch (buildTool) {
            case "pen":
                if ((mouseDown[0] && (buildLastPos.x !== mPos.x || buildLastPos.y !== mPos.y)) || mousePress[0]) {
                    // if the last mouse position is more than 1 away, make a line between the last and current position
                    if (dist(mPos, buildLastPos) > 1) {
                        var sx = Math.min(buildLastPos.x, mPos.x);
                        var ex = Math.max(buildLastPos.x, mPos.x);
                        var sy = Math.min(buildLastPos.y, mPos.y);
                        var ey = Math.max(buildLastPos.y, mPos.y);

                        for (var y = sy; y <= ey; y++) {
                            for (var x = sx; x <= ex; x++) {
                                if (pDistance(x, y, buildLastPos.x, buildLastPos.y, mPos.x, mPos.y) <= 0.5) {
                                    place(x, y);
                                }
                            }
                        }
                    }
                    // place at the moues position
                    place(mPos.x, mPos.y);
                }
                break;
            case "bucket":
                if (mousePress[0]) {
                    // get world width and height
                    var ww = worldW;
                    var wh = worldH;

                    // get data string of what is to be targeted, and what will replace it;
                    var type = dGet("fillType").value;
                    var target = worldTiles[mPos.y][mPos.x].data;
                    var replace = `${buildSelection.ID}.${buildSelection.variance}.${buildSelection.rotation}`;

                    if (type === "id") {
                        target = target.split(".")[0];
                    }

                    // if the current tile is not what is hovered
                    if (target !== replace) {
                        // create a list of positions to check
                        var q = [];
                        q.push([mPos.x, mPos.y]);

                        // 2d array of booleans for if the tile has been visited
                        var haveGoneTo = [];
                        // 2d array of tile data
                        var worldIDs = [];
                        for (var y = 0; y < wh; y++) {
                            var haveGoneToRow = [];
                            var worldIDsRow = [];
                            for (var x = 0; x < ww; x++) {
                                haveGoneToRow.push(false);
                                if (type === "id") {
                                    worldIDsRow.push(worldTiles[y][x].data.split(".")[0]);
                                } else {
                                    worldIDsRow.push(worldTiles[y][x].data);
                                }
                            }
                            haveGoneTo.push(haveGoneToRow);
                            worldIDs.push(worldIDsRow);
                        }

                        // decrease width and height so we don't have to the operation every loop
                        ww--;
                        wh--;

                        while (q.length > 0) {
                            // get the last position
                            var n = q.pop();
                            // if it has been visited, go to the next in the list
                            if (haveGoneTo[n[1]][n[0]]) {
                                continue;
                            }
                            // replace the tile
                            worldIDs[n[1]][n[0]] = replace;
                            place(n[0], n[1]);
                            haveGoneTo[n[1]][n[0]] = true;

                            // if any tiles around this one are the target, add them to the list to check
                            if (n[1] < wh) {
                                if (worldIDs[n[1] + 1][n[0]] === target) {
                                    q.push([n[0], n[1] + 1]);
                                }
                            }
                            if (n[0] < ww) {
                                if (worldIDs[n[1]][n[0] + 1] === target) {
                                    q.push([n[0] + 1, n[1]]);
                                }
                            }
                            if (n[1] > 0) {
                                if (worldIDs[n[1] - 1][n[0]] === target) {
                                    q.push([n[0], n[1] - 1]);
                                }
                            }
                            if (n[0] > 0) {
                                if (worldIDs[n[1]][n[0] - 1] === target) {
                                    q.push([n[0] - 1, n[1]]);
                                }
                            }
                        }
                    }
                }
                break;
            case "pointer":
                if (mousePress[0]) {
                    var pos = mousePosition();
                    pos.x += 8;
                    pos.y += 8;
                    for (var i = 0, l = worldObjects.length; i < l; i++) {
                        if (rectpoint(worldObjects[i], pos)) {
                            buildSelection.objectIndex = i;
                            generateObjectUI();
                            break;
                        }
                    }
                }
                break;
        }

        // pick
        if (mousePress[2]) {
            var tile = worldTiles[mPos.y][mPos.x];
            buildSelection.type = "tile";
            selectTile(tile.tileID);
            buildSelection.rotation = Math.round((tile.rotation / Math.PI) * 2);
            buildSelection.variance = tile.variation;
        }

        buildLastPos = mPos;
    }
}

function place(x, y) {
    var rotCache = buildSelection.rotation;
    if (buildRandomizeAngle) {
        rotCache = rand(0, 3);
    }
    switch (buildSelection.type) {
        case "tile":
            worldTiles[y][x] = new tileClasses[tileIDs[buildSelection.ID]](x, y, buildSelection.ID, buildSelection.variance, rotCache);
            break;
        case "object":
            buildSelection.objectIndex = worldObjects.length;
            worldObjects.push(new objectClasses[objectIDs[buildSelection.ID]](x + 0.5, y + 0.5, buildSelection.ID, buildSelection.variance, rotCache));
            generateObjectUI();
            break;
    }
}

function trackUndo() {
    if (undo.pos < undo.states.length - 1) {
        undo.states.length = undo.pos + 1;
    }
    undo.states.push(JSON.stringify(getRoomObject()));
    undo.pos++;
    undo.lastStep = "forward";
    undo.lastActionWasEdit = true;

    if (undo.states.length > undo.bufferSize) {
        undo.states.shift();
        undo.pos--;
    }
}

function tileTableValid(xChange, yChange) {
    if (buildSelection.menuPos.y + yChange === 0) {
        return false;
    }
    var row = dGet("buildTable").children[buildSelection.menuPos.y + yChange];
    if (row !== undefined) {
        if (row.children[buildSelection.menuPos.x + xChange] === undefined) {
            return false;
        }
    } else {
        return false;
    }
    return true;
}

// distance from a line to a point
function pDistance(x, y, x1, y1, x2, y2) {
    var A = x - x1;
    var B = y - y1;
    var C = x2 - x1;
    var D = y2 - y1;

    var dot = A * C + B * D;
    var len_sq = C * C + D * D;
    var param = -1;
    if (len_sq != 0) {
        param = dot / len_sq;
    }

    var xx, yy;

    if (param < 0) {
        xx = x1;
        yy = y1;
    } else if (param > 1) {
        xx = x2;
        yy = y2;
    } else {
        xx = x1 + param * C;
        yy = y1 + param * D;
    }

    var dx = x - xx;
    var dy = y - yy;
    return Math.sqrt(dx * dx + dy * dy);
}

function drawBuild() {
    // draw tiles
    for (var y = 0; y < worldH; y++) {
        for (var x = 0; x < worldW; x++) {
            worldTiles[y][x].draw();
        }
    }

    // objects
    difx = -8;
    dify = -8;
    for (var i = 0, l = worldObjects.length; i < l; i++) {
        worldObjects[i].draw();
    }
    difx = 0;
    dify = 0;

    if (worldTiles.length > 0) {
        // draw preview

        if (buildTool === "pointer") {
            if (buildSelection.objectIndex > -1 && buildSelection.objectIndex < worldObjects.length) {
                var o = worldObjects[buildSelection.objectIndex];
                var previewObject = new objectClasses[objectIDs[o.objectID]](o.x / 16 - 0.5, o.y / 16 - 0.5, o.objectID, o.variation, -o.rotation + Math.cos(drawCount / 10) / 5);
                previewObject.draw();
            }
        } else {
            if (buildSelection.type === "tile") {
                var previewTile = new tileClasses[tileIDs[buildSelection.ID]](buildLastPos.x + Math.cos(drawCount / 10) / 10, buildLastPos.y + Math.sin(drawCount / 10) / 10, buildSelection.ID, buildSelection.variance, buildSelection.rotation);
                previewTile.draw();
            } else {
                var previewObject = new objectClasses[objectIDs[buildSelection.ID]](buildLastPos.x + Math.cos(drawCount / 10) / 10, buildLastPos.y + Math.sin(drawCount / 10) / 10, buildSelection.ID, buildSelection.variance, buildSelection.rotation);
                previewObject.draw();
            }
        }
    }
}

function absoluteDrawBuild() {
    switch (buildTool) {
        case "pen":
            img(sprites.buildPen, mousePos.x + 16, mousePos.y + 16, 0, 2, 2);
            break;
        case "bucket":
            img(sprites.buildBucket, mousePos.x + 16, mousePos.y + 16, 0, 2, 2);
            break;
        case "pointer":
            img(sprites.buildPointer, mousePos.x + 16, mousePos.y + 16, 0, 2, 2);
            break;
    }
}

function pressSelectedTile() {
    dGet("buildTable").children[buildSelection.menuPos.y].children[buildSelection.menuPos.x].children[0].onclick();
}

// pen
dGet("selectPen").onclick = function () {
    buildTool = "pen";
};

// bucket
dGet("selectBucket").onclick = function () {
    buildTool = "bucket";
};

// pointer
dGet("selectPointer").onclick = function () {
    buildTool = "pointer";
};

dGet("hideShow").onclick = function () {
    if (this.innerText === "hide") {
        dGet("build").style.display = "none";
        this.innerText = "show";
        this.style.left = "10px";
    } else {
        dGet("build").style.display = "block";
        this.innerText = "hide";
        this.style.left = "475px";
    }
};

// creates a blank room of grass
dGet("newRoom").onclick = function () {
    if (worldTiles.length !== 0) {
        trackUndo();
    }

    worldTiles = [];
    worldObjects = [];
    var w = parseInt(dGet("roomW").value);
    var h = parseInt(dGet("roomH").value);

    for (var y = 0; y < h; y++) {
        var row = [];
        for (var x = 0; x < w; x++) {
            row.push(new TileGrass(x, y, 0, 0, 0));
        }
        worldTiles.push(row);
    }

    buildSelection.objectIndex = -1;

    centerCameraOn(w * 8, h * 8);
};

// help
dGet("help").onclick = function () {
    var stl = dGet("helpDiv").style;
    stl.display = stl.display === "block" ? "none" : "block";
};

// go trough everything to be added to build mode, and put it in the build table
function generateBuildUI() {
    var rowLength = 0;
    var tr = dMake("tr");

    // tiles
    for (var i = 0; i < tileIDs.length; i++) {
        // create button and set the id to to the id of the tile
        var button = dMake("button");
        button.id = "t" + i;
        button.xPos = rowLength;
        button.yPos = dGet("buildTable").childNodes.length;
        // set the onclick to switch the active object to the right tile
        button.onclick = function () {
            buildSelection.menuPos.x = this.xPos;
            buildSelection.menuPos.y = this.yPos;
            selectTile(parseInt(this.id.slice(1)));
        };

        // add cell
        tr.appendChild(makeTableCell(button, sprites[tileClasses[tileIDs[i]].prototype.imageName + "0"].spr.src, tileClasses[tileIDs[i]].prototype.layer ? "#320738" : "#08403a"));

        // once there are 10 cells, create a new row
        rowLength++;
        if (rowLength === 10) {
            dGet("buildTable").appendChild(tr);
            tr = dMake("tr");
            rowLength = 0;
        }
    }

    // objects
    for (var i = 0; i < objectIDs.length; i++) {
        // create button and set the id to to the id of the tile
        var button = dMake("button");
        button.id = "o" + i;
        button.xPos = rowLength;
        button.yPos = dGet("buildTable").childNodes.length;
        // set the onclick to switch the active object to the right tile
        button.onclick = function () {
            buildSelection.menuPos.x = this.xPos;
            buildSelection.menuPos.y = this.yPos;
            selectObject(parseInt(this.id.slice(1)));
        };

        // add cell
        tr.appendChild(makeTableCell(button, sprites[objectClasses[objectIDs[i]].prototype.imageName + "0"].spr.src, "#265917"));

        // once there are 10 cells, create a new row
        rowLength++;
        if (rowLength === 10) {
            dGet("buildTable").appendChild(tr);
            tr = dMake("tr");
            rowLength = 0;
        }
    }

    dGet("buildTable").appendChild(tr);

    dGet("build").style.visibility = "visible";
}

function selectTile(tileID) {
    buildSelection.type = "tile";
    buildSelection.ID = tileID;
    buildSelection.variance = 0;
    buildSelection.rotation = 0;
    buildSelection.menuPos.x = tileID % 10;
    buildSelection.menuPos.y = Math.floor(tileID / 10) + 1;

    var tr = dMake("tr");

    var tileClass = tileClasses[tileIDs[tileID]];

    for (var i = 0, l = tileClass.prototype.typesAmount; i < l; i++) {
        // create button and set the on click to set the correct variance
        var button = dMake("button");
        button.id = "v" + i;
        button.style = "width: 34px; height: 34px; padding:0;";
        button.onclick = function () {
            buildSelection.variance = parseInt(this.id.slice(1));
        };

        // add cell
        tr.appendChild(makeTableCell(button, sprites[tileClass.prototype.imageName + i].spr.src));
    }

    dGet("buildVariations").innerHTML = "";
    dGet("buildVariations").appendChild(tr);

    var tileName = tileIDs[tileID];
    var buildInfoString = `id: ${tileID}\n type: tile\n layer: ${tileClass.prototype.layer}\n name: ${tileName}\n merges with: `;
    var tileMerges = tileClass.prototype.mergesWith;
    for (var m = 0; m < tileMerges.length; m++) {
        buildInfoString += tileIDs[tileMerges[m]] + ", ";
    }
    dGet("buildInfo").innerText = buildInfoString;
}

function selectObject(objectID) {
    buildSelection.type = "object";
    buildSelection.ID = objectID;
    buildSelection.variance = 0;
    buildSelection.rotation = 0;

    var tr = dMake("tr");

    var objectClass = objectClasses[objectIDs[objectID]];

    for (var i = 0, l = objectClass.prototype.typesAmount; i < l; i++) {
        // create button and set the on click to set the correct variance
        var button = dMake("button");
        button.id = "v" + i;
        button.style = "width: 34px; height: 34px; padding:0;";
        button.onclick = function () {
            buildSelection.variance = parseInt(this.id[1]);
        };

        // add cell
        tr.appendChild(makeTableCell(button, sprites[objectClass.prototype.imageName + i].spr.src));
    }

    dGet("buildVariations").innerHTML = "";
    dGet("buildVariations").appendChild(tr);

    var buildInfoString = `id: ${objectID}\n type: object\n name: ${objectIDs[objectID]}\n arguments: `;

    for (var m = 0, ml = objectClass.prototype.metaArguments.length; m < ml; m++) {
        buildInfoString += objectClass.prototype.metaArguments[m][0] + ", ";
    }
    dGet("buildInfo").innerText = buildInfoString;
}

var objectUIDiv = dGet("object");
var objectUIRoomSelect;
var objectArgElementTarget;

function generateObjectUITemplates() {
    objectUIRoomSelect = dMake("select");

    // generate list of rooms
    for (var i = 0; i < rooms.length; i++) {
        var option = dMake("option");
        var lastSlash = rooms[i].lastIndexOf("/");
        option.innerText = lastSlash === -1 ? rooms[i] : rooms[i].substring(lastSlash + 1);
        option.value = i;
        objectUIRoomSelect.appendChild(option);
    }

    // generate table of enemies
    var table = dMake("table");
    var tr = dMake("tr");

    var rowLength = 0;
    for (var i = 0; i < enemyIDs.length; i++) {
        // create button and set the id to to the id of the tile
        var button = dMake("button");
        button.id = "e" + i;
        button.xPos = rowLength;
        button.yPos = table.childNodes.length;
        // set the onclick to switch the value of the button to the correct ID
        button.onclick = function () {
            objectArgElementTarget.value = this.id.slice(1);
        };

        // add cell
        tr.appendChild(makeTableCell(button, sprites[enemyClasses[enemyIDs[i]].prototype.imageName + "0"].spr.src, "#2e2e2e"));

        // once there are 10 cells, create a new row
        rowLength++;
        if (rowLength === 10) {
            table.appendChild.appendChild(tr);
            tr = dMake("tr");
            rowLength = 0;
        }
    }
    table.appendChild(tr);
    dGet("enemyTable").appendChild(table);

    // generate biome types
    var keys = Object.keys(biomes);
    for(var i=0,l=keys.length;i<l;i++) {
        var option = dMake("option");
        option.innerText = keys[i];
        option.value = biomes[keys[i]];
        dGet("biome").appendChild(option);
    }
}

function generateObjectUI() {
    if (buildSelection.objectIndex !== -1) {
        objectUIDiv.innerHTML = "";

        var metaArgs = new objectClasses[objectIDs[worldObjects[buildSelection.objectIndex].objectID]](0, 0, 0, 0, 0, "").metaArguments;

        for (var i = 0; i < metaArgs.length; i++) {
            makeObjectInput(metaArgs[i][0], metaArgs[i][1], i, worldObjects[buildSelection.objectIndex].meta[metaArgs[i][0]]);
        }
    }
}

function makeObjectInput(label, type, id, value) {
    var span = dMake("span");
    span.innerText = label;
    span.style.paddingRight = "20px";
    objectUIDiv.appendChild(span);

    var element;

    switch (type) {
        case metaFieldTypes.string:
            element = dMake("input");
            element.type = "text";
            element.value = value === undefined ? "" : value;
            break;
        case metaFieldTypes.number:
            element = dMake("input");
            element.type = "number";
            element.value = value === undefined ? "0" : value;
            break;
        case metaFieldTypes.room:
            element = dMake("select");
            element.innerHTML = objectUIRoomSelect.innerHTML;
            element.value = value === undefined ? "0" : value;
            break;
        case metaFieldTypes.enemy:
            element = dMake("button");
            element.onclick = function () {
                dGet("enemyTable").style.display = dGet("enemyTable").style.display === "none" ? "block" : "none";
                objectArgElementTarget = element;
            };
            element.innerText = "select";
            element.value = value === undefined ? "0" : value;
            break;
    }

    element.id = "objectMeta" + id;
    element.labelName = label;
    element.onfocus = function () {
        typing = true;
    };
    element.onblur = function () {
        typing = false;
    };
    objectUIDiv.appendChild(element);

    var brrrrrrrrrrr = dMake("br");
    objectUIDiv.appendChild(brrrrrrrrrrr);
}

function makeTableCell(button, image, color = "#00000000") {
    // create cell and set background color based on layer
    var td = dMake("td");
    td.style.backgroundColor = color;

    // set button style
    button.style = "width: 34px; height: 34px; padding:0;";

    // add image to the button
    var img = dMake("img");
    img.style.width = "32px";
    img.style.height = "32px";
    img.src = image;

    // append everything
    button.appendChild(img);
    td.appendChild(button);

    return td;
}

// save
dGet("save").onclick = function () {
    var exportObj = getRoomObject();

    // create download link
    var link = dMake("a");
    link.download = dGet("name").value;
    var blob = new Blob([JSON.stringify(exportObj)], { type: "application/json" });
    link.href = URL.createObjectURL(blob);

    // click the link
    var e = document.createEvent("MouseEvents");
    e.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    link.dispatchEvent(e);
};

// load
dGet("fileUpload").onchange = function () {
    if (dGet("fileUpload").files[0] !== undefined) {
        if (worldTiles.length !== 0) {
            trackUndo();
        }
        fetch(URL.createObjectURL(dGet("fileUpload").files[0])).then((response) =>
            response.json().then((data) => {
                loadRoomObject(data);
                buildSelection.objectIndex = -1;
                generateObjectUI();
                centerCameraOn(0, 0);
            })
        );
    }
};

var rooms = ["test.json", "a.json", "village.json"];

var roomBaseDir = "assets/rooms/";

function renderLayers() {
    camera.x = 0;
    camera.y = 0;
    camera.angle = 0;
    camera.zoom = 1;
    difx = 8;
    dify = 8;
    absDraw = true;

    // positions around a tile that should be checked
    var shadowCheckOffsets = [
        [1, -1],
        [1, 0],
        [1, 1],
        [0, 1],
        [-1, 1],
        [-1, 0],
        [-1, -1],
        [0, -1]
    ];

    var keys = Object.keys(worldLayers);
    for (var i = 0; i < keys.length; i++) {
        worldLayers[keys[i]] = dMake("canvas");
        worldLayers[keys[i]].width = worldW * 16;
        worldLayers[keys[i]].height = worldH * 16;
    }

    // ground

    var groundCtx = worldLayers.ground.getContext("2d");
    curCtx = groundCtx;
    // draw ground tiles
    for (var y = 0; y < worldH; y++) {
        for (var x = 0; x < worldW; x++) {
            if (worldTiles[y][x].layer === layers.ground) {
                worldTiles[y][x].draw();
            }
        }
    }

    var groundImageData = groundCtx.getImageData(0, 0, worldW * 16, worldH * 16);
    // draw transitions between tiles
    for (var y = 0; y < worldH; y++) {
        for (var x = 0; x < worldW; x++) {
            var merges = worldTiles[y][x].mergesWith;

            // bottom
            if (y + 1 < worldH) {
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
            if (x + 1 < worldW) {
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
    for (var y = 0; y < worldH; y++) {
        for (var x = 0; x < worldW; x++) {
            if (worldTiles[y][x].layer === layers.wall) {
                worldTiles[y][x].draw();
            }
        }
    }

    // shadows
    function validPosition(x, y) {
        return x < worldW && x > -1 && y < worldH && y > -1;
    }
    for (var y = 0; y < worldH; y++) {
        for (var x = 0; x < worldW; x++) {
            if (worldTiles[y][x].layer === layers.wall) {
                var str = "";
                for (var i = 0; i < 8; i++) {
                    var pos = shadowCheckOffsets[i];
                    if (validPosition(x + pos[0], y + pos[1])) {
                        str += worldTiles[y + pos[1]][x + pos[0]].layer === layers.wall ? "1" : "0";
                    } else {
                        str += "1";
                    }
                }
                img({ spr: shadows[str], drawLimitSize: 8 }, x * 16, y * 16);
            }
        }
    }

    // objects
    difx = 0;
    dify = 0;
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
        if (str[0] === "0" && str[7] !== "1" && str[1] !== "1") {
            ctx.setTransform(1, 0, 0, 1, 11, 11);
            ctx.drawImage(sprites.shadowCorner.spr, -11, -11);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
        for (var j = 2; j < 8; j += 2) {
            if ((check = str[j] === "0" && str[j - 1] !== "1" && str[j + 1] !== "1")) {
                ctx.setTransform(1, 0, 0, 1, 11, 11);
                ctx.rotate((j * halfPI) / 2);
                ctx.drawImage(sprites.shadowCorner.spr, -11, -11);
                ctx.setTransform(1, 0, 0, 1, 0, 0);
            }
        }

        // sides
        for (var j = 1; j < 8; j += 2) {
            if (str[j] === "0") {
                ctx.setTransform(1, 0, 0, 1, 11, 11);
                ctx.rotate(((j - 1) * halfPI) / 2);
                ctx.drawImage(sprites.shadowSide.spr, -11, -11);
                ctx.setTransform(1, 0, 0, 1, 0, 0);
            }
        }

        shadows[str] = canvas;
    }
}

var tileIDs = ["TileGrass", "TilePath", "TileBrickPath", "WallBrick", "WallHouse"];

var tileClasses = {};

const effects = {
    none: 0,
    colliding: 1,
    speedUp: 2
};

const layers = {
    ground: 0,
    wall: 1
};

var tileDataCaches = [];

class Tile {
    constructor(x, y, tileID, variation, rotation = 0) {
        this.x = x * 16;
        this.y = y * 16;
        this.tileID = tileID;
        this.variation = variation;
        this.rotation = (rotation * Math.PI) / 2;
    }

    get data() {
        var dataStr;
        if (this.rotation !== 0) {
            dataStr = `${this.tileID}.${this.variation}.${~~(this.rotation / halfPI)}`;
        } else if (this.variation !== 0) {
            dataStr = `${this.tileID}.${this.variation}`;
        } else {
            dataStr = `${this.tileID}`;
        }
        return dataStr;
    }
}

Tile.prototype.w = 16;
Tile.prototype.h = 16;

Tile.prototype.imageName = "debug"; // name of image without number at the end

Tile.prototype.typesAmount = 1; // amount of tile visual variations

Tile.prototype.mergesWith = []; // what tile this with visually merge with

Tile.prototype.effect = effects.none; // what effect this tile does

Tile.prototype.layer = layers.ground;

Tile.prototype.draw = function () {
    img(sprites[`${this.imageName}${this.variation}`], this.x, this.y, this.rotation);
};

tileClasses.Tile = Tile;

// gets the image data for each variation of each tile
function generateTileDataCaches() {
    camera.x = 0;
    camera.y = 0;
    camera.angle = 0;
    camera.zoom = 1;
    difx = 0;
    dify = 0;
    absDraw = true;
    for (var i = 0; i < tileIDs.length; i++) {
        var arr = [];
        for (var j = 0, jl = tileClasses[tileIDs[i]].prototype.typesAmount; j < jl; j++) {
            var t = new tileClasses[tileIDs[i]](0.5, 0.5, i, j, 0);
            var tileCanvas = dMake("canvas");
            tileCanvas.width = 16;
            tileCanvas.height = 16;
            var tileCtx = tileCanvas.getContext("2d");
            curCtx = tileCtx;
            t.draw();
            arr.push(tileCtx.getImageData(0, 0, 16, 16));
        }
        tileDataCaches.push(arr);
    }
}

class BaseWall extends Tile {
    constructor(x, y, tileID, variation, rotation = 0) {
        super(x, y, tileID, variation, rotation);
    }
}

BaseWall.prototype.effect = effects.colliding;

BaseWall.prototype.layer = layers.wall;

tileClasses.BaseWall = BaseWall;

class TileBrickPath extends Tile {
    constructor(x, y, tileID, variation, rotation = 0) {
        super(x, y, tileID, variation, rotation);
    }
}

TileBrickPath.prototype.imageName = "brickPath";

TileBrickPath.prototype.typesAmount = 3;

TileBrickPath.prototype.effect = effects.speedUp;

tileClasses.TileBrickPath = TileBrickPath;

class TileGrass extends Tile {
    constructor(x, y, tileID, variation, rotation = 0) {
        super(x, y, tileID, variation, rotation);
    }
}

TileGrass.prototype.imageName = "grass";

TileGrass.prototype.typesAmount = 2;

TileGrass.prototype.mergesWith = [0, 1, 3];

tileClasses.TileGrass = TileGrass;

class TilePath extends Tile {
    constructor(x, y, tileID, variation, rotation = 0) {
        super(x, y, tileID, variation, rotation);
    }
}

TilePath.prototype.imageName = "path";

TilePath.prototype.effect = effects.speedUp;

TilePath.prototype.mergesWith = [3];

tileClasses.TilePath = TilePath;

class WallBrick extends BaseWall {
    constructor(x, y, tileID, variation, rotation = 0) {
        super(x, y, tileID, variation, rotation);
    }
}

WallBrick.prototype.imageName = "brick";

WallBrick.prototype.typesAmount = 4;

tileClasses.WallBrick = WallBrick;

class WallHouse extends BaseWall {
    constructor(x, y, tileID, variation, rotation = 0) {
        super(x, y, tileID, variation, rotation);
    }
}

WallHouse.prototype.imageName = "house";

WallHouse.prototype.typesAmount = 3;

tileClasses.WallHouse = WallHouse;

var objectIDs = ["HouseEntrance", "HouseSmokeStack", "Spawner", "SpawnerSingle"];

var objectClasses = {};

// types of input fields used in build mode for object meta data
const metaFieldTypes = {
    number: 0,
    string: 1,
    enemy: 2,
    room: 3
};

class BaseObject {
    constructor(x, y, objectID, variation, rotation = 0, meta = "") {
        this.x = x * 16;
        this.y = y * 16;
        this.objectID = objectID;
        this.variation = variation;
        this.rotation = (rotation * Math.PI) / 2;
        this.meta = {};
        var metaInfo = meta.split("@");
        for (var i = 0; i < this.metaArguments.length; i++) {
            if (metaInfo[i] === undefined) {
                metaInfo[i] = 0;
            }
            var mLength = metaInfo[i].length;
            if (mLength > 0) {
                if (parseInt(metaInfo[i]).toString().length === mLength) {
                    this.meta[this.metaArguments[i][0]] = parseInt(metaInfo[i]);
                } else {
                    this.meta[this.metaArguments[i][0]] = metaInfo[i];
                }
            }
        }
    }

    get data() {
        var metaStr = "";
        for (var i = 0; i < this.metaArguments.length; i++) {
            metaStr += `${this.meta[this.metaArguments[i][0]]}@`;
        }
        metaStr = metaStr.substring(0, metaStr.length - 1);
        return `${this.x / 16 - 0.5}~${this.y / 16 - 0.5}~${this.objectID}~${this.variation}~${~~(this.rotation / halfPI)}~${metaStr}`;
    }
}

BaseObject.prototype.imageName = "debug"; // name of image without number at the end

BaseObject.prototype.typesAmount = 1; // amount of object visual variations

BaseObject.prototype.metaArguments = []; // what arguments the meta takes in build mode. Example of arguments: [["warpID",metaFieldTypes.number],[" enemySpawn", metaFieldTypes.enemy]];

BaseObject.prototype.w = 16; // dimensions used only for building
BaseObject.prototype.h = 16;

BaseObject.prototype.draw = function () {
    img(sprites[`${this.imageName}${this.variation}`], this.x, this.y, this.rotation);
};

// code the object should run every frame. Return true if the object should be destroyed
BaseObject.prototype.update = function () {
    return false;
};

// code that the object should run once when a room is loaded
BaseObject.prototype.initialize = function () {};

objectClasses.BaseObject = BaseObject;

class HouseEntrance extends BaseObject {
    constructor(x, y, objectID, variation, rotation = 0, meta = "") {
        super(x, y, objectID, variation, rotation, meta);
    }
}

HouseEntrance.prototype.imageName = "houseEntrance";

HouseEntrance.prototype.metaArguments = [
    ["room", metaFieldTypes.room],
    ["entranceID", metaFieldTypes.string]
];

HouseEntrance.prototype.update = function () {
    if (dist(this, player) < 8) {
        player.angle = pointTo(player, this);
        cutSceneData = { room: this.meta.room, entranceID: this.meta.entranceID, walkTime: 20 };
        playCutscene(0);
    }
    return false;
};

objectClasses.HouseEntrance = HouseEntrance;

class Spawner extends BaseObject {
    constructor(x, y, objectID, variation, rotation = 0, meta = "") {
        super(x, y, objectID, variation, rotation, meta);

        this.spawnCount = 0;
    }
}

Spawner.prototype.imageName = "spawner";

Spawner.prototype.metaArguments = [
    ["enemyType", metaFieldTypes.enemy],
    ["spawnCap", metaFieldTypes.number],
    ["framesBetweenSpawns", metaFieldTypes.number],
    ["range", metaFieldTypes.number]
];

Spawner.prototype.update = function () {
    if (updateCount % this.meta.framesBetweenSpawns === 0 && this.spawnCount < this.meta.spawnCap) {
        var randX = rand(this.x - this.meta.range, this.x + this.meta.range);
        var randY = rand(this.y - this.meta.range, this.y + this.meta.range);
        var enemy = new enemyClasses[enemyIDs[this.meta.enemyType]](randX, randY, 0);

        var spawnAttempts = 0;
        while (enemy.colliding && spawnAttempts < SPAWN_ATTEMPTS_MAX) {
            enemy.x = rand(this.x - this.meta.range, this.x + this.meta.range);
            enemy.y = rand(this.y - this.meta.range, this.y + this.meta.range);
            spawnAttempts++;
        }

        if (spawnAttempts < SPAWN_ATTEMPTS_MAX) {
            enemy.spawnerObjectIndex = worldObjects.indexOf(this);
            worldEnemies.push(enemy);
            this.spawnCount++;
        }
    }
    return false;
};

Spawner.prototype.draw = function () {
    if (!globalLoading) {
        img(sprites[`${this.imageName}${this.variation}`], this.x, this.y, this.rotation);
        img(sprites[`${enemyClasses[enemyIDs[this.meta.enemyType | 0]].prototype.imageName}0`], this.x, this.y, 0, 0.75, 0.75);
        circleOutline(this.x, this.y, this.meta.range, "#ffffff");
    }
};

objectClasses.Spawner = Spawner;

class SpawnerSingle extends BaseObject {
    constructor(x, y, objectID, variation, rotation = 0, meta = "") {
        super(x, y, objectID, variation, rotation, meta);
    }
}

SpawnerSingle.prototype.imageName = "spawnerSingle";

SpawnerSingle.prototype.metaArguments = [["enemyType", metaFieldTypes.enemy]];

SpawnerSingle.prototype.initialize = function () {
    worldEnemies.push(new enemyClasses[enemyIDs[this.meta.enemyType]](this.x, this.y, 0));
};

SpawnerSingle.prototype.draw = function () {
    if (!globalLoading) {
        img(sprites[`${this.imageName}${this.variation}`], this.x, this.y, this.rotation);
        img(sprites[`${enemyClasses[enemyIDs[this.meta.enemyType | 0]].prototype.imageName}0`], this.x, this.y, 0, 0.75, 0.75);
        circleOutline(this.x, this.y, this.meta.range, "#ffffff");
    }
};

objectClasses.SpawnerSingle = SpawnerSingle;

class HouseSmokeStack extends BaseObject {
    constructor(x, y, objectID, variation, rotation = 0, meta = "") {
        super(x, y, objectID, variation, rotation, meta);
    }
}

HouseSmokeStack.prototype.imageName = "smokeStack";

HouseSmokeStack.prototype.update = function () {
    // make smoke here
    return false;
};

objectClasses.HouseSmokeStack = HouseSmokeStack;

// when adding components use UIBase.add(e)

// component refers to the objects in js that have custom properties like update
// element refers to the html element each object is using
class BaseComponent {
    constructor(elementName = "div", updateFunc = function () {}) {
        this.element = dMake(elementName);
        this.update = updateFunc;
        this.children = [];
    }

    set class(c) {
        this.element.className = c;
    }
    get class() {
        return this.element.className;
    }
}

BaseComponent.prototype.displayStyle = "block";

BaseComponent.prototype.delete = function () {
    this.parent.element.removeChild(this.element);
    this.parent.children.splice(this.parent.children.indexOf(this), 1);
};

BaseComponent.prototype.add = function (component) {
    component.parent = this;
    this.element.appendChild(component.element);
    this.children.push(component);
};

BaseComponent.prototype.hide = function () {
    this.element.style.display = "none";
};

BaseComponent.prototype.show = function () {
    this.element.style.display = this.displayStyle;
};

BaseComponent.prototype.toggleVisibility = function () {
    if (this.element.style.display === "none") {
        this.show();
    } else {
        this.hide();
    }
};

var UIBase = new BaseComponent("div", function () {
    this.element.style.width = `${cw}px`;
    this.element.style.height = `${ch}px`;
});
UIBase.element.id = "UIBase";
document.body.appendChild(UIBase.element);

function updateUIComponents() {
    UIBase.update();
    updateChildren(UIBase);
}

function updateChildren(component) {
    var children = component.children;
    for (var i = 0, l = children.length; i < l; i++) {
        children[i].update();
        updateChildren(children[i]);
    }
}

var a = new BaseComponent("button");
a.element.innerText = "asdasd";
UIBase.add(new BaseComponent());
UIBase.add(a);
a.add(new BaseComponent("button"));
// files paths of image files
images = [
    "assets/images/",
    [
        "tiles/",
        "debug0.png",
        "grass0.png",
        "grass1.png",
        "path0.png",
        "brick0.png",
        "brick1.png",
        "brick2.png",
        "brick3.png",
        "brickPath0.png",
        "brickPath1.png",
        "brickPath2.png",
        "house0.png",
        "house1.png",
        "house2.png"
    ],
    [
        "objects/",
        "tree0.png",
        "tree1.png",
        "link0.png",
        "link1.png",
        "houseEntrance0.png",
        "smokeStack0.png",
        "spawner0.png",
        "spawnerSingle0.png"
    ],
    [
        "UI/slot",
        "Accessory.png",
        "Weapon.png",
        "Select.png",
        "Frame.png",
        "Head.png",
        "Body.png",
        "Pants.png",
        "Boots.png",
        "Hand.png"
    ],
    [
        "entities/",
        [
            "player",
            "1.png",
            "2.png",
            "3.png",
            "4.png",
            "5.png"
        ],
        [
            "enemies/",
            "slime0.png",
            "angryHedge0.png"
        ]
    ],
    "preview0.png",
    "tempPlayer.png",
    "tempEnemy00.png",
    "buildPen.png",
    "buildBucket.png",
    "buildPointer.png",
    "shadowSide.png",
    "shadowCorner.png"
];

// files paths of audio files
audio = [
    "assets/audio/"
];

var drawCount = 0;
var updateCount = 0;

var globalLoading = true;

const states = {
    TITLE: 0,
    LOADING: 1,
    OVERWORLD: 2,
    BATTLE: 3,
    CUTSCENE: 4,
    BUILDING: 5
};

var globalState = states.LOADING;
var lastGlobalState;

var desiredState = states.OVERWORLD;

var isNewGlobalState;

var cutScene = false;

function update() {

    if (globalState != lastGlobalState) {
        isNewGlobalState = true;
    } else {
        isNewGlobalState = false;
    }
    lastGlobalState = globalState;

    switch (globalState) {
        case states.TITLE:

            break;
        case states.OVERWORLD:
            handleOverWorld(isNewGlobalState);
            break;
        case states.BATTLE:
            handleBattle();
            break;
        case states.LOADING:
            if (isNewGlobalState) {
                dGet("load").style.display = "block";
            }
            if (!globalLoading) {
                dGet("load").style.display = "none";
                globalState = desiredState;
            }
            break;
        case states.CUTSCENE:
            handleCutScene(isNewGlobalState);
            break;
        case states.BUILDING:
            if(!typing) {
                handleBuild(isNewGlobalState);
            }
            // un focus html ui
            if (mousePress[0] || keyPress[k.ESCAPE]) { [].forEach.call(document.getElementsByTagName("button"), e => { e.blur(); });[].forEach.call(document.getElementsByTagName("select"), e => { e.blur(); });[].forEach.call(document.getElementsByTagName("input"), e => { e.blur(); }); }
            break;
    }
    updateUIComponents();
    updateCount++;
}

function draw() {
    switch (globalState) {
        case states.TITLE:

            break;
        case states.OVERWORLD:
            drawOverWorld();
            break;
        case states.BATTLE:
            drawBattle();
            break;
        case states.LOADING:

            break;
        case states.CUTSCENE:
            drawCutScene();
            break;
        case states.BUILDING:
            drawBuild();
            break;
    }
    drawCount++;
}

function absoluteDraw() {
    switch (globalState) {
        case states.TITLE:

            break;
        case states.OVERWORLD:

            break;
        case states.BATTLE:

            break;
        case states.LOADING:

            break;
        case states.CUTSCENE:

            break;
        case states.BUILDING:
            absoluteDrawBuild();
            break;
    }
}

function load(state) {
    desiredState = state;
    globalLoading = true;
    globalState = states.LOADING;
}

function onAssetsLoaded() {
    generateObjectUITemplates();
    generateTileDataCaches();
    preRenderShadows();
    loadRoom(2);
}

setup(60);
