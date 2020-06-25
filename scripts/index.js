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
        "brickPath2.png"
    ],
    [
        "objects/",
        "tree0.png",
        "tree1.png",
        "link0.png",
        "link1.png",
        "houseSmall0.png"
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
    "preview0.png",
    "tempPlayer.png",
    "tempEnemy00.png",
    "buildPen.png",
    "buildBucket.png"
];

// files paths of audio files
audio = [
    "assets/audio/"
];

var drawCount = 0;
var updateCount = 0;

const states = {
    TITLE: 0,
    LOADING: 1,
    OVERWORLD: 2,
    FIGHTING: 3,
    BUILDING: 4
};

var globalState = states.BUILDING;
var lastGlobalState;

var isNewGlobalState;

function update() {

    if(globalState != lastGlobalState) {
        isNewGlobalState = true;
    } else {
        isNewGlobalState = false;
    }
    lastGlobalState = globalState;

    switch(globalState) {
        case states.TITLE:

            break;
        case states.OVERWORLD:

            break;
        case states.FIGHTING:

            break;
        case states.LOADING:

            break;
        case states.BUILDING:
            handleBuild(isNewGlobalState);
            break;
    }
    updateCount++;
}

function draw() {
    switch(globalState) {
        case states.TITLE:

            break;
        case states.OVERWORLD:

            break;
        case states.FIGHTING:

            break;
        case states.LOADING:

            break;
        case states.BUILDING:
            drawBuild();
            break;
    }
    drawCount++;
}

function absoluteDraw() {
    switch(globalState) {
        case states.TITLE:

            break;
        case states.OVERWORLD:

            break;
        case states.FIGHTING:

            break;
        case states.LOADING:

            break;
        case states.BUILDING:
            absoluteDrawBuild();
            break;
    }
}

function onAssetsLoaded() {
}
setup(60);