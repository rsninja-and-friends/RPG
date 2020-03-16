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
        "brick3.png"
    ],
    "tempPlayer.png"
];

// files paths of audio files
audio = [
    ""
];

// enum kinda thing for game states
var states = {
    titleScreen: 0,
    world: 1,
    battle: 2,
    cutscene: 3,
    build: 99
}

// current state
var globalState = states.world;
// last state
var lastGlobalState;

function update() {
    // if this is the first time updating in this state
    var newState = false;

    if (lastGlobalState !== globalState) {
        newState = true;
    }
    lastGlobalState = globalState;

    // run code depending on what state the game is in
    switch (globalState) {
        // title state
        case states.titleScreen:
            handleTitleScreen(newState);
            break;
        // in world
        case states.world:
            handleWorld(newState);
            break;
        //in a battle
        case states.battle:
            handleBattle(newState);
            break;
        // build mode
        case states.build:
            handleBuild(newState);
            break;
        // if state is set to something that doesn't exist
        default:
            console.warn("in unknown state");
            break;
    }
}

function draw() {
    switch (globalState) {
        // title state
        case states.titleScreen:
            drawTitleScreen();
            break;
        // in world
        case states.world:
            drawWorld();
            break;
        // build mode
        case states.build:
            drawBuild();
            break;
    }
}

function absoluteDraw() {
    switch (globalState) {
        // title state
        case states.titleScreen:
            break;
        // build mode
        case states.build:
            drawBuildAbsolute();
            break;
    }
}

function onAssetsLoaded() {
    generateShadows();
    for (var i = 0; i < tileDefinitions.length; i++) {
        tilePalette.push(tileDefinitions[i](0, 0, 0));
    }
    loadRoom(rooms.default);
}

setup(60);