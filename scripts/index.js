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
    "tempEnemy00.png"
];

// files paths of audio files
audio = [
    "assets/audio/"
];

// enum kinda thing for game states
var states = {
    titleScreen: 0,
    world: 1,
    battle: 2,
    cutscene: 3,
    loading: 4,
    build: 99
}

var drawCount = 0;
var updateCount = 0;

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
        case states.loading:
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
    updateCount++;
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
        // in a battle
        case states.battle:
            drawBattle();
            break;
        // build mode
        case states.build:
            drawBuild();
            break;
    }
    drawCount++;
}

function absoluteDraw() {
    switch (globalState) {
        // title state
        case states.titleScreen:
            break;
        // in world
        case states.world:
            drawWorldAbsolute();
            break;
        // in a battle
        case states.battle:
            drawBattleAbsolute();
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

    tilePaletteObjectStartPos = tilePalette.length;

    for (var i = 0; i < objDefKeys.length; i++) {
        if(objectDefinitions[objDefKeys[i]].length === 3) {
            tilePalette.push(objectDefinitions[objDefKeys[i]](0, 0, 0));
        } else {
            tilePalette.push(objectDefinitions[objDefKeys[i]](0, 0, 0,[]));
        }
    }

    cw = canvases.cvs.width;
    ch = canvases.cvs.height;

    makeStatsUI();

    makeBattleUI();

    makeInventoryUI();

    addEnemiesToBuildUI();

    // test items
    player.inventory.push(new WeaponItem("test","this is a tooltip",rarities.epic,weaponTypes.melee,2,[attacks.basic]));
    player.inventory.push(new WeaponItem("sdaf lkj hgsafdolih fdsa lkjhsadfl kjfhdsalkjhs afdlkuhfd salkusauhf","this is a tooltip",rarities.uncommon,weaponTypes.magic,5465452,[attacks.basic,attacks.slash]));
    player.inventory[1].imageName = "tempEnemy00";
    player.inventory.push(new LootItem("loot item","tooltips yall",rarities.common));
    player.inventory.push(new EquipableItem("definitely boots","According to all known laws of aviation, there is no way a bee should be able to fly. Its wings are too small to get its fat little body off the ground. The bee, of course, flies anyway because bees don't care what humans think is impossible. Yellow, black. Yellow, black. Yellow, black. Yellow, black. Ooh, black and yellow! Let's shake it up a little. Barry! Breakfast is ready! Ooming! Hang on a second. Hello?",rarities.rare,equipTypes.boots));
    player.inventory.push(new SingleUseItem("SingleUseItem item","!@#$%^&*()_+{|}::<>?[\\];',/.`~",rarities.mystical,effects.heal5,effectTargets.player));
    player.inventory[4].imageName = "path0";
    player.inventory.push(new SpecialItem("AAAAAAAAAAA","eh",rarities.special));

    loadRoom(rooms.a);
}
setup(60);