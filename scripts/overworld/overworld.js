function handleOverWorld(isNewState) {
    if(keyPress[k.BACKSLASH]) {
        desiredState = states.BUILDING;
        globalState = states.LOADING;
        globalLoading = false;
    }

    if (keyDown[k.a]) { moveCamera(-10 / camera.zoom, 0); }
    if (keyDown[k.d]) { moveCamera(10 / camera.zoom, 0); }
    if (keyDown[k.w]) { moveCamera(0, -10 / camera.zoom); }
    if (keyDown[k.s]) { moveCamera(0, 10 / camera.zoom); }

    camera.zoom += scroll;
}

function drawOverWorld() {
    imgIgnoreCutoff({spr:worldLayers.ground,drawLimitSize:0},0,0);
    imgIgnoreCutoff({spr:worldLayers.walls,drawLimitSize:0},0,0);
    imgIgnoreCutoff({spr:worldLayers.objects,drawLimitSize:0},0,0);
}