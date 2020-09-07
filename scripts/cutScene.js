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
