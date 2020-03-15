var tileDefinitions = [
    // 0 = grass
    function(x,y,type){return new tileGrass(x,y,type,0);},
    // 1 = path
    function(x,y,type){return new tilePath(x,y,type,1);}
];