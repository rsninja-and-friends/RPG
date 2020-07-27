function dGet(id) {return document.getElementById(id);}
function dMake(tag) {return document.createElement(tag);}
function createCanvas(id) {
    var tempCanvas = dMake("canvas");
    tempCanvas.id = id;
    tempCanvas.width = canvases.cvs.width;
    tempCanvas.height = canvases.cvs.height;
    tempCanvas.style = "image-rendering:pixelated;image-rendering: crisp-edges;display:none";//display:none;

    document.body.appendChild(tempCanvas);

    canvases[`${id}cvs`] = dGet(id);
    canvases[`${id}ctx`] = canvases[`${id}cvs`].getContext("2d");
}

function startLoops() {
    try {draw} catch (err){console.warn(bug+" no draw function found");return null;}
    try {update} catch (err){console.warn(bug+" no update function found");return null;}
    try {input} catch (err){seperateInputLoop=false;}
    onAssetsLoaded();

    requestAnimationFrame(drawLoop);
    setInterval(updateLoop,1000/updateFPS);

    if(seperateInputLoop) {
        setInterval(inputLoop,4);
    }
}

function mousePosition() {
    if(drawMode===0) {
        return {x:(mousePos.x)-camera.x,y:(mousePos.y)-camera.y};
    } else if(drawMode===1) {
        var xoff = canvases.cvs.width/2;
        var yoff = canvases.cvs.height/2;
        return {x:((mousePos.x-xoff)/camera.zoom+xoff)-camera.x,y:((mousePos.y-yoff)/camera.zoom+yoff)-camera.y};
    } else {
        var xoff = canvases.cvs.width/2;
        var yoff = canvases.cvs.height/2;
        var tempPos = {x:((mousePos.x-xoff)/camera.zoom+xoff)-camera.x,y:((mousePos.y-yoff)/camera.zoom+yoff)-camera.y};

        var center = {x:-camera.x + cw/2, y:-camera.y + ch/2};
        var tempAngle = pointTo(center,tempPos) - camera.angle; 
        var tempDist = dist(center,tempPos);

        return {x:center.x + (Math.cos(tempAngle) * tempDist),y:center.y + (Math.sin(tempAngle) * tempDist)}
    }
}

function addStyle() {
    var tempStyle = dMake("style");
    tempStyle.id="gamejsstyle";
    document.head.appendChild(tempStyle);
    var tempMeta = dMake("meta");
    tempMeta.setAttribute("charset","utf-8");
    document.head.appendChild(tempMeta);
}

function rand(min,max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function radToDeg(rad) {return rad / Math.PI * 180;}
function degToRad(deg) {return deg * Math.PI / 180;}

function velocity(angle) {
    return {x:Math.sin(angle),y:Math.cos(angle)};
}

function pointTo(point,targetPoint) {
    var adjacent = (targetPoint.x - point.x);
    var opposite = (targetPoint.y - point.y);
    var h = Math.atan2(opposite, adjacent);
    return h;
}

function loadImagesAndSounds() {
    var curpath="";
    context = new AudioContext();
    sfxVolumeNode = context.createGain();
    sfxVolumeNode.connect(context.destination);
    bmgVolumeNode = context.createGain();
    bmgVolumeNode.connect(context.destination);
    deeper(images,"image");
    deeper(audio,"sound");
    function deeper(curpos,type) {
        let addedPath="";
        for(let j=0;j<curpos.length;j++) {
            if(typeof curpos[j]=="string") {
                if(j==0) {
                    curpath+=curpos[j];
                    addedPath = curpos[j];
                } else {
                    if(type=="image") {
                        let name = curpath + curpos[j];
                        imagePaths.push(name);
                        let temp = new Image();
                        temp.src = name;
                        temp.onerror = function () {
                            console.warn(bug+" "+this.src + " was not found");
                        };
                        temp.onload = function() {spriteLoad(name,temp);};
                        imgs.push(temp);
                    } else if(type=="sound") {
                        audioPaths.push(curpath + curpos[j]);
                        newSound(curpath + curpos[j]);
                    }
                }
            }
            if(typeof curpos[j]=="object") {
               deeper(curpos[j],type);
            }
        }
        curpath = curpath.slice(0,curpath.length-addedPath.length);
    }
    
    loadingCircle = new Image();
    loadingCircle.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAf0lEQVQ4jc2SuxHAIAxDbY4pMpHmyJSeKGuQKpyj2Hy6qETPQvhQCWRmDRfeZ4cJAGW28mAUyL4Pqmx2nfK+zaR59glRHo5qZi0BaPHmbDhiyuzdsza9wcrtEVtG4Ip+FLCzTM+WneWxPv9gpQUzmhncLPOHUCYfHr4/C4r2dQPfhkeIbjeYWgAAAABJRU5ErkJggg==";
    clickSound = new Audio("data:audio/x-wav;base64,UklGRowBAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YWgBAADa/6T/2/+S/x//pP769Xr4fPh5+H34evh7+Pv6gf18/QIAhQcIDxUZFR4VHhgeEx6TFgkPCgqAAnz49/X18HLu7ubo4eXc5dzj3Gjf5+Fr5G7pce759YECiwwRFBQZlxuXG5cbFRmTFo8RCAoAAPz69/X08G7udO5s7vz1dvj++nv9gP3+/wEAgwKBAogHkBEpLUNG1lzqcPV683r4eu51ZmnVV7w+qypy88fDoKAXlAqKBoUAgIeHlpYsrTu87Ot9/ZIRGxkoKDEtqionIxgZiwfj5lnaz9JN0E3QV9pd3+Tm9fUBAAQFBwWNDBEPFxSYFpsWEA9+/fP1dfNt83bz8fX9+gQFkAwPDxQPEQ+IBwIAdfjv8OLm2+HX3Nrh4+bm63n4BAUUDx0ZqyCrJSkelBGEAnb4a+5a5Njcztxc31jkZunx9QgFGhQfGa0gqCCuIKkgpRsaFIsHdfhj6dfh0NzM19Th6es=");
    let pos = {x:cw/2-100,y:ch/2-100};
    optionsButtons.screenSize = {x:pos.x+160,y:pos.y+12,w:50,h:20};
    optionsButtons.sfx = {x:pos.x+125,y:pos.y+40,w:120,h:20};
    optionsButtons.bmg = {x:pos.x+125,y:pos.y+70,w:120,h:20};
    loadLoop();
}

function loadLoop() {
    if(Object.keys(sprites).length == imagePaths.length && audioPaths.length == audioLoadedLength) {
        startLoops();
        imagePaths=[];
        audioPaths=[];
        imgs=[];
    } else {
        curCtx.fillStyle="#2d2d2d";
        curCtx.fillRect(0,0,cw,ch);
        text(`audio:   ${audioLoadedLength}/${audioPaths.length}`,10,30,"white",2);
        text(`sprites: ${Object.keys(sprites).length}/${imagePaths.length}`,10,10,"white",2);
        curCtx.setTransform(1, 0, 0, 1, Math.round(cw/2), Math.round(ch/2));
        curCtx.rotate(loadAng);
        loadAng+=0.1;
        curCtx.drawImage(loadingCircle,Math.round(-8),Math.round(-8));
        curCtx.setTransform(1, 0, 0, 1, 0, 0);
        requestAnimationFrame(loadLoop);
    }
}

function spriteLoad(path,image) {
    let startpos;
    let endpos = path.lastIndexOf(".");
    for(let j=endpos-1;acceptableChars.includes(path[j]);j--) {startpos=j;}
    let spriteName = path.slice(startpos,endpos);
    let dsize=Math.max(image.width,image.height)/2;
    sprites[spriteName] = {spr:image,drawLimitSize:dsize};
    
}

function newSound(src) {
    let startpos;
    let endpos = src.lastIndexOf(".");
    for(let j=endpos-1;acceptableChars.includes(src[j]);j--) {startpos=j;}
    let soundName = src.slice(startpos,endpos); 
    sounds[soundName] = {nodes:[],volNodes:[],src:src,type:"sfx",volume:1};
    sounds[soundName].nodes = [1];

    let loadingSound = new Audio();
    loadingSound.onerror = function () {
        console.warn(bug+" "+ src + " was not found");
    };
    loadingSound.src = src;
    loadingSound.preload="auto";
    loadingSound.addEventListener("canplaythrough", function() { 
        audioLoadedLength++;
     }, false);
    sounds[soundName].nodes.push(loadingSound);

    let soundNode = context.createMediaElementSource(loadingSound);
    let gainNode = context.createGain();

    soundNode.connect(gainNode);
    gainNode.connect(sfxVolumeNode);

    abuffer.push(soundNode);
    volumeList.push(gainNode);
    sounds[soundName].volNodes.push(volumeList.length-1);
}

function addSound(sound) {
    let loadingSound = new Audio();
    loadingSound.src = sound.src;
    loadingSound.preload="auto";
    sound.nodes.splice(sound.nodes[0],0,loadingSound);

    let soundNode = context.createMediaElementSource(loadingSound);
    let gainNode = context.createGain();
    gainNode.gain.value=sound.volume;

    soundNode.connect(gainNode);
    gainNode.connect(sound.type=="sfx"?sfxVolumeNode:bmgVolumeNode);

    abuffer.push(soundNode);
    volumeList.push(gainNode);
    sound.volNodes.push(volumeList.length-1);

    volumeList[sound.volNodes[sound.volNodes.length-1]].gain.value = volumeList[sound.volNodes[0]].gain.value
}



function play(sound) {
    s=sound.nodes;
    if(s[s[0]].ended || !(s[s[0]].played.length)) {
        s[s[0]].play();
        s[0]++;
        if(s[0]==s.length) {
            s[0]=1;
        }
    } else {
        addSound(sound);
        s[s[0]].play();
        s[0]++;
        if(s[0]==s.length) {
            s[0]=1;
        }
    }
}

function setVolume(sound,volume) {
    for(let i=0,l=sound.volNodes.length;i<l;i++) {
        volumeList[sound.volNodes[i]].gain.value = volume;
    }
}

function setType(sound,newType) {
    for(let i=0,l=sound.volNodes.length;i<l;i++) {
        volumeList[sound.volNodes[i]].disconnect(sound.type=="sfx"?sfxVolumeNode:bmgVolumeNode);
        volumeList[sound.volNodes[i]].connect(newType=="sfx"?sfxVolumeNode:bmgVolumeNode);
    }
    sound.type = newType;
}

function stop(sound) {
    s=sound.nodes;
    for(let i=1;i<s.length;i++) {
        s[i].pause();
        s[i].currentTime = 0;
    }
}

function handleOptionsInput() {
    let ImTierdMakemenuwork=true;
    if(optionsMenu) {
        if(mouseDown[0]) {
            if(rectpoint(optionsButtons.sfx,mousePos)) {
                volume.sfx = (mousePos.x-(optionsButtons.sfx.x-60))/120;
            }
            if(rectpoint(optionsButtons.bmg,mousePos)) {
                volume.bgm = (mousePos.x-(optionsButtons.bmg.x-60))/120;
            }
        }
    }
    if(mousePos.x>cw-32&&mousePos.y<32) {
        if(mousePress[0]&&ImTierdMakemenuwork) {
            clickSound.play();
            paused=true;
            optionsMenu=!optionsMenu;
        }
        optionsHover = 25;
    } else {
        optionsHover = 0;
    }
    if(mousePos.x<cw-32&&mousePos.x>cw-64&&mousePos.y<32) {
        pauseHover = 25;
        if(mousePress[0]) {
            clickSound.play();
            paused=!paused;
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
function img(img,x,y,angle=0,sx=scaleDefault,sy=scaleDefault) {
    var half = img.drawLimitSize;
    if((x+half>drawLimitLeft&&x-half<drawLimitRight&&y+half>drawLimitTop&&y-half<drawLimitBottom)||absDraw) {
        let spr = img.spr;
        if(angle===0&&sx===1&&sy===1) {
            curCtx.drawImage(spr,Math.round(x+camera.x+difx-(spr.width/2)),Math.round(y+camera.y+dify-(spr.height/2)));
        } else {
            curCtx.setTransform(sx, 0, 0, sy, Math.round(x+camera.x+difx), Math.round(y+camera.y+dify));
            curCtx.rotate(angle);
            curCtx.drawImage(spr,Math.round(-spr.width/2),Math.round(-spr.height/2));
            curCtx.setTransform(1, 0, 0, 1, 0, 0);
        }
    }
}

function imgIgnoreCutoff(img,x,y,angle=0,sx=1,sy=1) {
    let spr = img.spr;
    if(angle===0&&sx===1&&sy===1) {
        curCtx.drawImage(spr,Math.round(x+camera.x+difx-(spr.width/2)),Math.round(y+camera.y+dify-(spr.height/2)));
    } else {
        curCtx.setTransform(sx, 0, 0, sy, Math.round(x+camera.x+difx), Math.round(y+camera.y+dify));
        curCtx.rotate(angle);
        curCtx.drawImage(spr,Math.round(-spr.width/2),Math.round(-spr.height/2));
        curCtx.setTransform(1, 0, 0, 1, 0, 0);
    }
}

function rect(x,y,w,h,color) {
    curCtx.fillStyle = color;
    curCtx.fillRect(x-(w/2)+camera.x+difx,y-(h/2)+camera.y+dify,w,h);
}

function rectOutline(x,y,w,h,color) {
    curCtx.strokeStyle = color;
    curCtx.rect(x-(w/2)+camera.x+difx,y-(h/2)+camera.y+dify,w,h);
    curCtx.stroke();
}

function circle(x,y,r,color) {
    curCtx.beginPath();
    curCtx.arc(x+camera.x+difx, y+camera.y+dify, r, 0, 2 * Math.PI, false);
    curCtx.fillStyle = color;
    curCtx.fill();
}

function shape(x,y,relitivePoints,color) {
    x+=camera.x+difx;
    y+=camera.y+dify;
    curCtx.fillStyle = color;
    curCtx.beginPath();
    curCtx.moveTo(x+relitivePoints[0].x, y+relitivePoints[0].y);
    for(let i=1,l=relitivePoints.length;i<l;i++) {
        curCtx.lineTo(x+relitivePoints[i].x, y+relitivePoints[i].y);
    }
    curCtx.fill();
}

function text(txt,x,y,color="black",size=1,maxWidth=cw) {
    txt = txt.toString();
    curCtx.fillStyle = color;
    curCtx.font = `${Math.round(size)*8}px pixelmix`;
                                                                                        //I hate text wrapping now 
    var txtList = txt.split("\n");                                                      //split string on enters
    for(let i=0;i<txtList.length;i++) {                                                 //go through array of strings
        if(curCtx.measureText(txtList[i]).width>maxWidth) {                             //if the string is too big, divide up into smaller strings
            var tempTxt = txtList[i].split(" ");                                        //split into individual words
            var tempStr="";                                                             //string for measuring size
            var addAmount=0;                                                            //track where in the txtList we are
            txtList.splice(i,1);                                                        //remove the too long string
            for(let j=0;j<tempTxt.length;j++) {                                         //go through the split up string
                if(curCtx.measureText(tempStr + tempTxt[j] + " ").width<maxWidth) {     //if adding a word doesn't make tempStr too long, add it, other wise, add tempStr to txtList;
                    tempStr += tempTxt[j] + " ";
                } else {
                    if(j==0) {tempStr+=tempTxt[j];}                                     //if we are here when j is 0, we have one word that is longer then the maxWidth, so we just draw it
                    txtList.splice(i+addAmount,0,tempStr);                              //put tempStr in txtList
                    addAmount++;                                                        //move the position we put the tempStr in
                    tempStr="";                                                         //reset tempStr
                    tempTxt.splice(0,(j==0?1:j));                                       //delete words that have been used
                    j=-1;                                                               //make it so in the next loop, j starts at 0
                }
            }
            if(tempStr.length!=0) {
                txtList.splice(i+addAmount,0,tempStr);                                  //add any leftover text
            }
        }
    }

    for(let i=0;i<txtList.length;i++) {
        curCtx.fillText(txtList[i],x+camera.x+difx,y+camera.y+dify+((i+(drawMode?1:0))*8*size+(size*i)));
    }
}

function textWidth(txt,size=1) {
    txt = txt.toString();
    curCtx.font = `${Math.round(size)*8}px pixelmix`;
    return curCtx.measureText(txt).width;
}

function centerCameraOn(x,y) {
    camera.x = -x+canvases.cvs.width/2;
    camera.y = -y+canvases.cvs.height/2;
}

function moveCamera(x,y) {
    camera.x -= y * Math.sin(camera.angle);
    camera.y -= y * Math.cos(camera.angle);
    camera.x -= x * Math.sin(camera.angle + 1.57079632);
    camera.y -= x * Math.cos(camera.angle + 1.57079632);
}

function imgRotScale(x,y,angle,scale,pic,ctx) { //used for camera movement
    ctx.setTransform(scale, 0, 0, scale, x, y);
    ctx.rotate(angle);
    ctx.drawImage(pic,-pic.width/2,-pic.height/2);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function drawCursor() {
    if(cursor.sprite&&mouseOnCanvas) {
        if(cursor.alignment) {
            canvases.ctx.drawImage(cursor.sprite.spr,mousePos.x-Math.round(cursor.sprite.spr.width/2),mousePos.y-Math.round(cursor.sprite.spr.height/2));
        } else {
            canvases.ctx.drawImage(cursor.sprite.spr,mousePos.x,mousePos.y);
        }
        cursor.show = false;
    } else {
        cursor.show = true;
    }
}

function render() {
    if(drawMode===1) {
        imgRotScale(canvases.cvs.width/2,canvases.cvs.height/2,0,camera.zoom,canvases.buffer1cvs,canvases.ctx);
    }
    if(drawMode===2) {
        imgRotScale(canvases.cvs.width/2,canvases.cvs.height/2,camera.angle,1,canvases.buffer2cvs,canvases.buffer1ctx);
        imgRotScale(canvases.cvs.width/2,canvases.cvs.height/2,0,camera.zoom,canvases.buffer1cvs,canvases.ctx);
    }
}

function clearCanvases() {
    canvases.ctx.clearRect(0,0,canvases.cvs.width,canvases.cvs.height);
    canvases.buffer1ctx.clearRect(0,0,canvases.buffer1cvs.width,canvases.buffer1cvs.height);
    canvases.buffer2ctx.clearRect(0,0,canvases.buffer2cvs.width,canvases.buffer2cvs.height);
}

function switchDrawMode() {
    if(camera.zoom<1) {camera.zoom=1;}
    if(camera.angle!=0) {
        drawMode=2;
    } else if(camera.zoom!=1) {
        drawMode=1;
    } else {
        drawMode=0;
    }
    switch (drawMode) {
        case 0: curCtx = canvases.ctx; break;
        case 1: curCtx = canvases.buffer1ctx; break;
        case 2: curCtx = canvases.buffer2ctx; break;
    }
}

function resizeBuffers() {
    maxCvsSize=Math.max(canvases.cvs.width,canvases.cvs.height);
    sizeDif=maxCvsSize-Math.min(canvases.cvs.width,canvases.cvs.height);

    var tempSize = maxCvsSize/camera.zoom;
    var tempSizeAndPadding = tempSize + (tempSize/2);

    canvases.buffer1cvs.width = cw;
    canvases.buffer1cvs.height = ch;

    canvases.buffer2cvs.width = tempSizeAndPadding;
    canvases.buffer2cvs.height = tempSizeAndPadding;
    
    if(drawMode===2) {
        difx = (canvases.buffer2cvs.width - canvases.cvs.width)/2;
        dify = (canvases.buffer2cvs.height - canvases.cvs.height)/2;
    } else {
        difx=0;
        dify=0;
    }
    canvases.ctx.imageSmoothingEnabled = false;
    canvases.buffer1ctx.imageSmoothingEnabled = false;
    canvases.buffer2ctx.imageSmoothingEnabled = false;
}

function drawButtons() {
    let pos = {x:cw-16,y:16}; 
    //options
    rect(pos.x,pos.y,34,34,"#9c9c9c");
    let c = optionsHover+45;
    rect(pos.x,pos.y,32,32,`rgb(${c},${c},${c})`);
    c = optionsHover + 69;
    let cc = `rgb(${c},${c},${c})`;
    rect(pos.x,pos.y-6,26,4,cc);
        rect(pos.x-6,pos.y-6,4,8,cc);
    rect(pos.x,pos.y+6,26,4,cc);
        rect(pos.x+11,pos.y+6,4,8,cc);
    //pause
    pos.x-=33;
    rect(pos.x,pos.y,34,34,"#9c9c9c");
    c = pauseHover+45;
    rect(pos.x,pos.y,32,32,`rgb(${c},${c},${c})`);
    c = pauseHover + 69;
    cc = `rgb(${c},${c},${c})`;
    if(paused) {
        shape(pos.x,pos.y,[{x:-7,y:-10},{x:-7,y:10},{x:10,y:0}],cc);
    } else {
        rect(pos.x+6,pos.y,6,20,cc);
        rect(pos.x-6,pos.y,6,20,cc);
    }
}

function drawOptionsMenu() {
    if(optionsMenu) {
        let pos = {x:cw/2-100,y:ch/2-100};
        rect(cw/2,ch/2,200,200,"#242424");
        text("sfx",pos.x+2,pos.y+30,"white",2);
            b = optionsButtons.sfx;
            rect(b.x,b.y,b.w,b.h-10,"#444444");
            rect((b.x-60)+(volume.sfx*120),b.y,8,20,"#444444");
        text("bmg",pos.x+2,pos.y+60,"white",2);
            b = optionsButtons.bmg;
            rect(b.x,b.y,b.w,b.h-10,"#444444");
            rect((b.x-60)+(volume.bgm*120),b.y,8,20,"#444444");
    }
}
var k={a:65,b:66,c:67,d:68,e:69,f:70,g:71,h:72,i:73,j:74,k:75,l:76,m:77,n:78,o:79,p:80,q:81,r:82,s:83,t:84,u:85,v:86,w:87,x:88,y:89,z:90,0:48,1:49,2:50,3:51,4:52,5:53,6:54,7:55,8:56,9:57,BACKTICK:192,MINUS:189,EQUALS:187,OPENSQUARE:219,ENDSQUARE:221,SEMICOLON:186,SINGLEQUOTE:222,BACKSLASH:220,COMMA:188,PERIOD:190,SLASH:191,ENTER:13,BACKSPACE:8,TAB:9,CAPSLOCK:20,SHIFT:16,CONTROL:17,ALT:18,META:91,LEFTBACKSLASH:226,ESCAPE:27,HOME:36,END:35,PAGEUP:33,PAGEDOWN:34,DELETE:46,INSERT:45,PAUSE:19,UP:38,DOWN:40,LEFT:37,RIGHT:39,CONTEXT:93,SPACE:32,F1:112,F2:113,F3:114,F4:115,F5:116,F6:117,F7:118,F8:119,F9:120,F10:121,F11:122,F12:123};
var keyPress = [];
var keyDown = [];
var mousePress = [];
var mouseDown = [];
var scroll = 0;
var mousePos = {
    x:0,
    y:0
};
var preventedEvents = [false,true,true];

function addListenersTo(elementToListenTo) {
    window.addEventListener("keydown",kdown);
    window.addEventListener("keyup",kup);
    elementToListenTo.addEventListener("mousedown",mdown);
    elementToListenTo.addEventListener("mouseup",mup);
    elementToListenTo.addEventListener("mousemove",mmove);
    elementToListenTo.addEventListener("contextmenu",cmenu);
    elementToListenTo.addEventListener("wheel",scrl);
}
function removeListenersFrom(elementToListenTo) {
    window.removeEventListener("keydown",kdown);
    window.removeEventListener("keyup",kup);
    elementToListenTo.removeEventListener("mousedown",mdown);
    elementToListenTo.removeEventListener("mouseup",mup);
    elementToListenTo.removeEventListener("mousemove",mmove);
    elementToListenTo.removeEventListener("contextmenu",cmenu);
    elementToListenTo.removeEventListener("wheel",scrl);
}
function resetInput() {
    for(var i=0;i<keyPress.length;i++){if(keyPress[i]){keyPress[i]=0;}}
    for(var i=0;i<mousePress.length;i++){if(mousePress[i]){mousePress[i]=0;}}
    scroll=0;
}
function kdown(e) {
    var h=e.keyCode;
    keyPress[h]=keyPress[h]==[][[]]?1:0;
    keyDown[h]=1;
    if(preventedEvents[0]) {e.preventDefault()}
}
function kup(e) {
    var h=e.keyCode;
    delete keyPress[h];
    delete keyDown[h];
}
function mdown(e) {
    var h=e.button;
    mousePress[h]=mousePress[h]==[][[]]?1:0;
    mouseDown[h]=1;
    if(preventedEvents[1]) {e.preventDefault()}
}
function mup(e) {
    var h=e.button;
    delete mousePress[h];
    delete mouseDown[h];
}
function mmove(e) {
    mousePos.x=e.offsetX;
    mousePos.y=e.offsetY;  
}
function cmenu(e) {
    if(preventedEvents[1]) {e.preventDefault()}
}
function scrl(e) {
    scroll+=-1*(e.deltaY/100);
    if(preventedEvents[2]) {e.preventDefault()}
}
function dist(point1,point2) {
    let one = (point2.x - point1.x);
    let two = (point2.y - point1.y);
    return Math.sqrt((one*one)+(two*two));
}

function circlecircle(circle1,circle2) {
    if( dist(circle1,circle2) < (circle1.r + circle2.r)) {
		return true;
	} else {
        return false;
    }
}

function circlepoint(circle,point) {
    if( dist(circle,point) < circle.r) {
		return true;
	} else {
        return false;
    }
}

function rectrect(rect1,rect2) {
    if(rect1.x + rect1.w/2 >= rect2.x - rect2.w/2 &&
       rect1.x - rect1.w/2 <= rect2.x + rect2.w/2 &&
       rect1.y + rect1.h/2 >= rect2.y - rect2.h/2 &&
       rect1.y - rect1.h/2 <= rect2.y + rect2.h/2) {
        return true;
    } else {
        return false;
    }
}

function rectpoint(rect,point) {
    if(rect.x + rect.w/2 >= point.x &&
       rect.x - rect.w/2 <= point.x &&
       rect.y + rect.h/2 >= point.y &&
       rect.y - rect.h/2 <= point.y ) {
        return true;
    } else {
        return false;
    }
}

function circlerect(circle,rect) { //credit: https://yal.cc/rectangle-circle-intersection-test/
    let rectHalfWidth  = rect.w/2;
    let rectHalfHeight = rect.h/2;
    let deltaX = circle.x - Math.max(rect.x - rectHalfWidth, Math.min(circle.x, rect.x + rectHalfWidth));
    let deltaY = circle.y - Math.max(rect.y - rectHalfHeight, Math.min(circle.y, rect.y + rectHalfHeight));
    return (deltaX * deltaX + deltaY * deltaY) < (circle.r * circle.r);
}

// create globals
var canvases={cvs:null,ctx:null,buffer1cvs:null,buffer1ctx:null,buffer2cvs:null,buffer2ctx:null}, // visable and hidden canvases
cw, // canvas width
ch, // canvas height
camera={zoom:1,angle:0,x:0,y:0}, // affects how everything is drawn
updateFPS=60,
gameStarted=false,
drawMode=0, // 0=normal, 1=zoomed, 2=zoomed/rotated, set automatically depending on camera
absDraw=false,
curCtx, // what canvas to draw to
maxCvsSize, // used by second buffer
canvasScale=1,
difx=0, // offsets for drawing
dify=0,
seperateInputLoop=true,
edge={top:null,bottom:null,left:null,right:null}, // used by if___OnEdgeBounce, set to canvas size at setup, can be changed whenever
drawLimitLeft,
drawLimitRight,
drawLimitTop,
drawLimitBottom,
sizeDif,
bug="\uD83D\uDC1B",
loadingCircle,
loadAng=0,
optionsHover=0,
pauseHover=0,
optionsMenu=false,
optionsButtons={},
clickSound,
paused=false,
screenSize="1:1",
autoScale=1,

images=[], // put image paths here
imagePaths=[],
imgs=[],
sprites={}, // loaded images

audio=[], // put audio paths here
audioPaths=[],
sounds={}, // loaded sounds
abuffer = [], // audio nodes shoved here
volumeList = [], // gain nodes shoved here
audioLoadedLength=0,
volume={sfx:1,bgm:1};

cursor = {sprite:null,alignment:1,show:true}, // 0=topleft, 1=centered
mouseOnCanvas=false;

const acceptableChars="qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890_-. ";//for image names

AudioContext = window.AudioContext||window.webkitAudioContext;
var context;
var sfxVolumeNode;
var bmgVolumeNode;

dGet("game").onmouseout = function()   {mouseOnCanvas = false;};
dGet("game").onmouseover = function()   {mouseOnCanvas = true;};

//setup canvases and input
function setup(physicsFPS) {
    updateFPS = physicsFPS;
    
    canvases.cvs = dGet("game");
    canvases.cvs.width = document.body.clientWidth;
    canvases.cvs.height = document.body.offsetHeight < window.innerHeight ? window.innerHeight : document.body.offsetHeight;
    cw = canvases.cvs.width;
    ch = canvases.cvs.height;
    canvases.ctx = canvases.cvs.getContext("2d", { alpha: false });

    canvases.cvs.onmousedown = function () {if(!gameStarted){loadImagesAndSounds();gameStarted=true;}};

    createCanvas("buffer1");
    createCanvas("buffer2");

    canvases.ctx.imageSmoothingEnabled = false;
    canvases.buffer1ctx.imageSmoothingEnabled = false;
    canvases.buffer2ctx.imageSmoothingEnabled = false;

    maxCvsSize=Math.max(canvases.cvs.width,canvases.cvs.height);
    sizeDif=maxCvsSize-Math.min(canvases.cvs.width,canvases.cvs.height);
    cw=canvases.cvs.width;
    ch=canvases.cvs.height;

    addFont();
    addStyle();

    addListenersTo(canvases.cvs);

    curCtx = canvases.ctx;
    requestAnimationFrame(startButton);
    function startButton() {
        canvases.cvs.width = document.body.clientWidth;
        canvases.cvs.height = (document.body.offsetHeight < window.innerHeight ? window.innerHeight : document.body.offsetHeight) - 1;
        cw=canvases.cvs.width;
        ch=canvases.cvs.height;
        curCtx.fillStyle="#101010";
        curCtx.fillRect(0,0,cw,ch);
        circle(cw/2,ch/2,27,"#066312");
        circle(cw/2,ch/2,23,"#149124");
        shape(cw/2,ch/2,[{x:-7,y:-15},{x:-7,y:15},{x:15,y:0}],"#47f55d");
        if(!gameStarted) {requestAnimationFrame(startButton);}
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
    if(drawMode==2) {limitModifyer=canvases.buffer2cvs.width-maxCvsSize;}
    drawLimitLeft   = -camera.x - (drawMode==2?sizeDif:0) - limitModifyer;
    drawLimitRight  = -camera.x + maxCvsSize + (drawMode==2?sizeDif:0) + limitModifyer;
    drawLimitTop    = -camera.y -(drawMode==2?sizeDif:0) - limitModifyer;
    drawLimitBottom = -camera.y + maxCvsSize + (drawMode==2?sizeDif:0) + limitModifyer;

    draw();
    
    render();

    curCtx=canvases.ctx;
    difx=0;dify=0;
    var camCache = {x:camera.x,y:camera.y};
    var drawModeCache = drawMode;
    camera.x=0;camera.y=0;
    drawMode=0;
    absDraw=true;
    try{absoluteDraw();} catch (err){}
    absDraw=false;

    let pos = {x:cw/2-100,y:ch/2-100};
    optionsButtons.sfx = {x:pos.x+125,y:pos.y+40,w:120,h:20};
    optionsButtons.bmg = {x:pos.x+125,y:pos.y+70,w:120,h:20};

    drawButtons();
    drawOptionsMenu();
    drawCursor();

    drawMode=drawModeCache;

    camera.x = camCache.x;
    camera.y = camCache.y;

    requestAnimationFrame(drawLoop);
}

function updateLoop() {
    if(seperateInputLoop==false) {
        handleOptionsInput();
    }
    sfxVolumeNode.gain.value = volume.sfx;
    bmgVolumeNode.gain.value = volume.bgm;
    if(!paused) {
        update();
    }

    if(seperateInputLoop==false) {
        resetInput();
    }
}


function inputLoop() {
    handleOptionsInput();
    if(!paused) {
        input();
    }

    resetInput();
}