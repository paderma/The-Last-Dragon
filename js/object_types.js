(function () {

battle.objectTypes = {};

var o = battle.objectTypes;

o.dragon = {
    role: "dragon",
    type: "character",
    team: 1,
    spriteSheet: "dragon",
    animated: true,
    weapons: ["fireball"],
    moveRange: 5 
};

o.bear = {
    role: "bear",
    type: "character",
    team: 2,
    spriteSheet: "bear",
    animated: true,
    weapons: ["fireball"],
    moveRange: 5 
};

o.monster = {
    role: "monster",
    type: "character",
    team: 2,
    spriteSheet: "monster",
    animated: true,
    weapons: ["fireball"],
    moveRange: 5 
};

o.fireball = {
    role: "fireball",
    type: "weapon",
    collidable: false,
    spriteSheet: "fireball",
    size: new battle.Size(32, 32),
    animated: false
};

o.explosion = {
    role: "explosion",
    type: "effect",
    spriteSheet: "explosion",
    animated: true,
    animLoop: false,
    animDelay: 100,
    animNumFrames: 6
};

})()
