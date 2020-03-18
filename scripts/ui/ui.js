var components = [];

var colors = {
    border: "#555555",
    background: "#1e1e1e",
    hover:"#333333",
    click:"#111111"
};

var focusedComponent = null;

var idCount = 0;

// canvas for drawing ui
var UICanvas = document.createElement("canvas");
var UICtx = UICanvas.getContext("2d");
UICtx.textAlign = "left";
UICtx.textBaseline = "top";

document.getElementsByTagName("style")[0].innerHTML += `@font-face {
    font-family: "pixelmix";
    src: url("./scripts/ui/font/pixelmix.ttf") format("ttf");
}`;

UICtx.font = "6px pixelmix";

// add a shadow toggling function to context2d prototype
UICtx.__proto__.toggleShadow = function (boolOn) {
    if (boolOn) {
        this.shadowOffsetY = 5;
        this.shadowColor = "#000000bb";
        this.shadowBlur = 5;
    } else {
        this.shadowOffsetY = 0;
        this.shadowColor = "#00000000";
        this.shadowBlur = 0;
    }
}

function drawUI() {
    // resize
    UICanvas.width = canvases.cvs.width;
    UICanvas.height = canvases.cvs.height;

    UICtx.imageSmoothingEnabled = false;
    //clear
    UICtx.clearRect(0, 0, UICanvas.width, UICanvas.height);

    drawComponents();

    // draw to screen
    imgIgnoreCutoff({ spr: UICanvas }, UICanvas.width / 2, UICanvas.height / 2, 0, 1, 1);
}

function makeStatsUI() {
    var bar = new HorizontalLayout(0,0,cw,75);
    bar.addChild(new TextComponent(0,6,100,"#ba5956",2,function(){return `hp: ${player.hp}`;}));
    bar.addChild(new TextComponent(0,22,100,"#e3d449",2,function(){return `$ ${player.money}`;}));
    bar.addChild(new TextComponent(0,40,100,"#63e693",2,function(){return `XP: ${player.xp}`;}));
    bar.id = "statsBar";
    bar.adaptWidth = false;
    bar.adaptHeight = false;
    bar.showShadow = false;
    bar.backgroundColor = colors.background + "cc";
    components.push(bar);
}

// rectangle
function UIRect(x, y, w, h, c) {
    UICtx.fillStyle = c;
    UICtx.fillRect(x, y, w, h);
}

// rectangle border
function UIBorder(x, y, w, h, c) {
    UICtx.strokeStyle = c;
    UICtx.beginPath();
    UICtx.rect(x, y, w, h);
    UICtx.stroke();
}

function UIImage(img,x,y) {
   UICtx.drawImage(img,x,y);
}

function UIText(txt,x,y,color="white",size=1,maxWidth=cw) {
    txt = txt.toString();
    UICtx.fillStyle = color;
    UICtx.font = `${Math.round(size)*8}px pixelmix`;
                                                                                        //I hate text wrapping now 
    var txtList = txt.split("\n");                                                      //split string on enters
    for(let i=0;i<txtList.length;i++) {                                                 //go through array of strings
        if(UICtx.measureText(txtList[i]).width>maxWidth) {                              //if the string is too big, divide up into smaller strings
            var tempTxt = txtList[i].split(" ");                                        //split into individual words
            var tempStr="";                                                             //string for measuring size
            var addAmount=0;                                                            //track where in the txtList we are
            txtList.splice(i,1);                                                        //remove the too long string
            for(let j=0;j<tempTxt.length;j++) {                                         //go through the split up string
                if(UICtx.measureText(tempStr + tempTxt[j] + " ").width<maxWidth) {      //if adding a word doesn't make tempStr too long, add it, other wise, add tempStr to txtList;
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
        UICtx.fillText(txtList[i],x+0.5,y+((i+1)*8*size+(size*i)));
    }

    return txtList.length*8*size + size*4;
}