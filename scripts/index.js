// files paths of image files
images = [
    ""
];

// files paths of audio files
audio = [
    ""
];

// enum kinda thing for game states
var states = {
    titleScreen:0,
    exampleState:1
}

// current state
var globalState = states.titleScreen;
// last state
var lastGlobalState;

function update() {
    // if this is the first time updating in this state
    var newState = false;
    
    if(lastGlobalState !== globalState) {
        newState = true;
    }
    lastGlobalState = globalState;

    // run code depending on what state the game is in
    switch(globalState) {
        // title state
        case states.titleScreen:
            handleTitleScreen(newState);
            break;
        // TODO remove
        case states.exampleState:
            handleExample(newState);
            break;
        // if state is set to something that doesn't exist
        default:
            console.warn("in unknown state");
            break;
    }
}

function draw() {
    switch(globalState) {
        // title state
        case states.titleScreen:
            drawTitleScreen();
            break;
        // TODO remove
        case states.exampleState:
            drawExample();
            break;
    }
}

function absoluteDraw() {
    switch(globalState) {
        // title state
        case states.titleScreen:
            break;
    }
}

function onAssetsLoaded() {

}

setup(60);