var battleUI = {};

function toggleBattleUI(shouldShow) {
    battleUI.div.show = shouldShow;
}

function makeBattleUI() {
    // invisible div to make hiding/showing easier
    battleUI.div = new Component(0,0,0,0);

    
    

    // bottom bar
    battleUI.mainBar = new HorizontalLayout(0,ch-100,cw,100);
    battleUI.mainBar.adaptWidth = false;
    battleUI.mainBar.adaptHeight = false;

        // attack button
        var attackAction = new Button(0,ch-75,function(){battleUI.attackSelect.show = !battleUI.attackSelect.show;});
        attackAction.addChild(new TextComponent(0,0,75,"#ba302b",2,returnStr("attack")));
        battleUI.mainBar.addChild(attackAction);

        // attack select
        battleUI.attackSelect = new VerticalLayout(5,ch-400,200,300);
        battleUI.attackSelect.adaptWidth = false;
        battleUI.attackSelect.adaptHeight = false;
        battleUI.attackSelect.absolutePosition = true;
        battleUI.attackSelect.show = false;
        battleUI.mainBar.addChild(battleUI.attackSelect);

            // basic attack
            var basicAttack = new Button(0,0,function(){
                curAttack = attacks.basic;
                curBattleState = bStates.pSelect;
            });
            basicAttack.addChild(new TextComponent(0,0,100,"white",1,returnStr("basic attack")));
            battleUI.attackSelect.addChild(basicAttack);

    battleUI.div.addChild(battleUI.mainBar);
    
    // select enemy message
    battleUI.pSelect = new TextComponent(50,ch-50,300,"white",2,returnStr("Select an enemy to Attack"));
    battleUI.pSelect.showShadow = true;
    battleUI.pSelect.backgroundColor = colors.background;
    battleUI.div.addChild(battleUI.pSelect);
    
    components.push(battleUI.div);
}