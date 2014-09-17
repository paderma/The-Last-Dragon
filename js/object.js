(function () {

battle.Object = function () {
    this.id = "";
    this.team = null;
    this.type = "character";
    this.role = "";
    this.spriteSheet = "";

    this.x = 0;
    this.y = 0;
    this.gridX = 0;
    this.gridY = 0;
    this.collidable = true;
    this.direction = battle.directions.DOWN;

    this.flipSpriteX = false;
    this.size = new battle.Size(32, 32);

    this.moveRange = 2;
    this.path = null;
    this.step = -1;
    this.states = [];

    this.damage = 1;
    this.hitPoints = 3;
    this.wounds = 0;
    this.alive = true;

    this.frameIndex = 0;
    this.animNumFrames = 2;
    this.animated = true;
    this.animLoop = true;
    this.animElapsed = 0;
    this.animDelay = 200;

    this.moveElapsed = 0;
    this.moveDelay = 150;

    this.weapons = [];
    this.cooldown = false;
    this.cooldownElapsed = 0;
    this.cooldownDelay = 200;
}

battle.Object.states = {
    IDLE: 0,
    HURTING: 1
};

var proto = battle.Object.prototype;

proto.update = function (elapsed, engine) {

    this.updateStates(elapsed);

    if (this.animated) {
        this.animElapsed += elapsed;
        if (this.animElapsed >= this.animDelay) {
            this.animElapsed = 0;
            this.frameIndex++;
            if (this.frameIndex > this.animNumFrames - 1) {
                if (this.animLoop) {
                    this.frameIndex = 0;
                } else {
                    this.die();
                }
            }
        }
    }

    if (this.cooldown === true) {
        this.cooldownElapsed += elapsed;
        if (this.cooldownElapsed >= this.cooldownDelay) {
            this.cooldownElapsed = 0;
            this.cooldown = false;
        }
    }

};

proto.execute = function(method, args) {
    if (this[method]) {
        return this[method].apply(this,args);
    }
};

proto.move = function (elapsed) {
    this.moveElapsed += elapsed;
    if (this.moveElapsed >= this.moveDelay) {
        this.moveElapsed = 0;
        if (this.type === "character") {
            this.nextStep();
        } else if (this.type === "weapon") {
            this.nextStepOnDirection();
        }
    }
};

proto.nextStep = function() {
    if (this.isMoving()) {
        this.updatePositionOnGrid();
        if (this.hasNextStep()) {
            this.step += 1;
            this.updateMovement();
        } else if (this.stop_pathing_callback){
            this.stop_pathing_callback();
        } else {
            this.stopMoving();
        }
    }
};

proto.isMoving = function () {
    return !(this.path === null);
};

proto.stopMoving = function () {
    this.path = null;
    this.addState(battle.Object.states.IDLE);
};

proto.updatePositionOnGrid = function() {
    this.setGridPosition(this.path[this.step][0], this.path[this.step][1]);
};

proto.updateMovement = function() {
    var p = this.path;
        i = this.step;

    if (p[i][0] < p[i-1][0]) {
        this.setDirection(battle.directions.LEFT);
    } else if (p[i][0] > p[i-1][0]) {
        this.setDirection(battle.directions.RIGHT);
    } else if (p[i][1] < p[i-1][1]) {
        this.setDirection(battle.directions.UP);
    } else if (p[i][1] > p[i-1][1]) {
        this.setDirection(battle.directions.DOWN);
    }
};

proto.nextStepOnDirection = function () {
    if (this.direction === battle.directions.LEFT) {
        this.setGridPosition(this.gridX - 1, this.gridY);
    } else if (this.direction === battle.directions.RIGHT) {
        this.setGridPosition(this.gridX + 1, this.gridY);
    } else if (this.direction === battle.directions.UP) {
        this.setGridPosition(this.gridX, this.gridY - 1);
    } else if (this.direction === battle.directions.DOWN) {
        this.setGridPosition(this.gridX, this.gridY + 1);
    }
};

proto.setDirection = function(direction) {
    this.direction = direction;
}

proto.setGridPosition = function(gridX, gridY) {
    this.gridX = gridX;
    this.gridY = gridY;
    this.setPosition(gridX * 32, gridY * 32);
    
};

proto.setPosition = function(x, y) {
    this.x = x;
    this.y = y;
};

proto.followPath = function (path) {
    if (path.length > 1) {
        this.path = path;
        this.step = 0;
    }
}

proto.onStopPathing = function (callback) {
    this.stop_pathing_callback = callback;
};

proto.hasNextStep = function () {
    return this.step < this.path.length - 1;
}

proto.getSpriteXY = function () {
    this.flipSpriteX = false;

    if (this.animated) {
        var offset = this.type === "character" ? this.direction : 0;
        if (offset === battle.directions.RIGHT) {
            offset = battle.directions.LEFT;
            this.flipSpriteX = true;
        }
        return { 
            x: this.frameIndex * this.size.width, 
            y: offset * this.size.height
        };
    } else {
        return { x: 0, y: 0 };
    }
};

proto.fireWeapon = function () {
    if (this.cooldown || this.weapons.length < 1) {
        return false;
    }
    return this.weapons[0];
};

proto.updateStates = function (elapsed) {
    for (var x in this.states) {
        var s = this.states[x];
        s.timer.update(elapsed);
        if (s.timer.expired()) {
            this.removeStateById(x);
        }
    }
};

proto.hasState = function (state) {
    for (var x in this.states) {
        if (this.states[x].type === state) {
            return true;
        }
    }
    return false;
};

proto.addState = function (state, ttl) {
    if (this.hasState(state)) {
        return false;
    }
    var t = new battle.Timer();
    t.start(ttl);
    this.states.push({
        type: state,
        timer: t
    });
};

proto.removeState = function (state) {
    for (var x in this.states) {
        if (this.states[x].type === state) {
            this.removeStateById(x);
        }
    }
};

proto.removeStateById = function (id) {
    delete(this.states[id]);
};

proto.getDirectionTo = function (target) {
    if (this.gridX === target.gridX) {
        if (this.gridY < target.gridY) {
            return battle.directions.DOWN;
        } else {
            return battle.directions.UP;
        }
    } else if (this.gridY === target.gridY) {
        if (this.gridX < target.gridX) {
            return battle.directions.RIGHT;
        } else {
            return battle.directions.LEFT;
        }
    } else {
        return false;
    }
};

proto.isNear = function (target, distance) {
    var dx, dy, near = false;

    dx = Math.abs(this.gridX - target.gridX);
    dy = Math.abs(this.gridY - target.gridY);

    if (dx <= distance && dy <= distance) {
        near = true;
    }
    return near;
};

proto.chaseThenFire = function (target, engine) {
    var moveRange = engine.pathManager.getMoveRange(engine.map, this);
    engine.updatePathingGrid(moveRange);

    var chasePath = engine.findPath(this, target.gridX, target.gridY).slice(0, this.moveRange);
    this.followPath(chasePath);
    this.onStopPathing(function () {
        if (this.isNear(target, 5)) {
            var direction = this.getDirectionTo(target);
            console.log(direction);
            if (direction !== false) {
                engine.objectAttack(this, direction);
            }
        }
        this.stopMoving();
    });
};

proto.wound = function (damage) {
    this.wounds += damage;
    if (this.wounds >= this.hitPoints) {
        return true;
    } else {
        return false;
    }
};

proto.die = function () {
    this.alive = false;
};

proto.isDead = function () {
    return !this.alive;
};

})()

