var cutSceneFrame = 0; // update count since the cutscene started
var cutScenePlaying = 0; // index of current cutscene

var cutSceneData; // variable that can hold any data needed for a cutscene

var cutScenes = [
    // 0: room transition out
    {update:()=>{
        player.x += Math.cos(player.angle)/2;
        player.y += Math.sin(player.angle)/2;
        if(cutSceneFrame > 20) {
            loadRoom(cutSceneData.room,cutSceneData.entranceID);
            playCutscene(1);
        }
    },
    draw:()=>{
        rect(worldW*8,worldH*8,worldW*16,worldH*16,`rgba(0,0,0,${mapRange(cutSceneFrame,0,20,0,1)})`); 
    }},
    // 1: room transition in
    {update:()=>{
        player.vel = 1;
        player.update();
        if(cutSceneFrame > cutSceneData.walkTime) {
            globalState = states.OVERWORLD;
        }
    },
    draw:()=>{
        rect(worldW*8,worldH*8,worldW*16,worldH*16,`rgba(0,0,0,${mapRange(cutSceneFrame,0,20,1,0)})`); 
    }}
];

function playCutscene(cutsceneIndex) {
    cutScenePlaying = cutsceneIndex;
    globalState = states.CUTSCENE;
    cutSceneFrame = 0;
}

function handleCutScene(isNewState) {
    if(isNewState) {
        cutSceneFrame = 0;
    }
    cutScenes[cutScenePlaying].update();
    cutSceneFrame++;
}

function drawCutScene() {
    drawOverWorld();
    cutScenes[cutScenePlaying].draw();
}