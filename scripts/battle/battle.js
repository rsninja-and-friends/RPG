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
