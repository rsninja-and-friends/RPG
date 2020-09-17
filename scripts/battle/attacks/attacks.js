var attacks = {};

function meleeDamage(target, damage) {
    var damageCalc = damage - target.stats.def;
    target.stats.hp -= clamp(damageCalc, 0, damageCalc);
}
