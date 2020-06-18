var enemyDefinitions = [
    //0 - basic enemy
    function(x,y,id,variation) {return new BasicEnemy(x,y,id,variation)}
];

function addEnemiesToBuildUI() {
    var dropDown = document.getElementById("enemySelectList");
    var catalog = document.getElementById("catalog");
    for(var i=0;i<enemyDefinitions.length;i++) {
        var opt = document.createElement("option");
        opt.value = i;
        var tempEnemy = enemyDefinitions[i](0,0,0,0);
        opt.innerHTML = `${tempEnemy.name}`;
        catalog.innerHTML += `<img src="${tempEnemy.getSprite().spr.src}"><span>${tempEnemy.name}</span><br>`;
        dropDown.appendChild(opt);
    }
}