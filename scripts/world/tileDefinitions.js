var tileDefinitions = [
    // 0 = grass
    function (x, y, type) { return new tileGrass(x, y, type, 0); },
    // 1 = path
    function (x, y, type) { return new tilePath(x, y, type, 1); },
    // 2 = bricks
    function (x, y, type) { return new wallBrick(x, y, type, 2); },
    // 3 = brickPath
    function (x, y, type) { return new tileBrickPath(x, y, type, 3); }
];