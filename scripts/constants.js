const SPAWN_ATTEMPTS_MAX = 50;

const BATTLE_ENEMIES_MAX = 5;
const BATTLE_FORMATION_OFFSETS = [
    [[0,0]],
    [[0,-1],[0,1]],
    [[0,0],[1,-2],[1,2]],
    [[0,-1],[0,1],[1,-3],[1,3]],
    [[0,0],[1,-2],[1,2],[2,-4],[2,4]]
];
const BATTLE_GROUP_RADIUS = 50;

const PLAYER_ACCELERATION = 0.05;
const PLAYER_FRICTION = 0.3;
const PLAYER_MAX_VEL = 1;