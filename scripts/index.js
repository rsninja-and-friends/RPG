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

    var a = new BaseComponent("button");
    a.element.innerText = "asdasd";
    UIBase.add(new BaseComponent());
    UIBase.add(a);
    a.add(new BaseComponent("button"));
    UIBase.add(new ComponentItemSlot());
    UIItemHeld = UIBase.add(new ComponentItem(new WeaponItem("a","asdsad",rarities.common)));

}

setup(60);