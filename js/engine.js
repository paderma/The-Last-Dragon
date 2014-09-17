(function () {
var SCREEN_WIDTH = 1024;
var SCREEN_HEIGHT = 640;
var PLAYER_TEAM = 1;
var ENEMY_TEAM = 2;

battle.Engine = function () {
    this.objects = {};
    this.objectId = "";
    this.playObjectId = "";
    this.canvases = {};
    this.mouse = null;
    this.images = new battle.ImageLoader();
    this.imagesLoaded = false;
    this.pathManager = null;
    this.currentTurn = PLAYER_TEAM;
    this.lastTurn = "";
    this.state = "";
};

var proto = battle.Engine.prototype;

proto.run = function () {
    this.init();
    this.lastUpdate = battle.now();
    var that = this;
    (function gameloop() {
        that.update();
        requestAnimationFrame(gameloop);
    })();
}

proto.init = function () {
    this.canvases["display"] = battle.makeCanvas("display", SCREEN_WIDTH, SCREEN_HEIGHT);
    this.canvases["buffer"] = battle.makeCanvas("buffer", SCREEN_WIDTH, SCREEN_HEIGHT);
    this.mouse = new battle.Mouse(this.canvases["display"]);
    this.images.download({
        "tile": "img/tile.png",
        "dragon": "img/dragon.png",
        "bear": "img/bear.png",
        "monster": "img/monster.png",
        "fireball": "img/fireball.png",
        "target": "img/target.png",
        "explosion": "img/explosion.png"
    }, this.handleImagesLoaded, this);
    this.initMap();
    this.initPathingGrid();
    this.initObjectGrid();
    this.initPlayer();
    this.initEnemy();
}

proto.initPlayer = function () {
    var dragon = battle.makeObject("dragon");
    dragon.setGridPosition(15, 15);
    this.playerObjectId = this.addObject(dragon, PLAYER_TEAM);
}

proto.initEnemy = function() {
    var bear = battle.makeObject("bear");
    bear.setGridPosition(5, 5);
    this.addObject(bear, ENEMY_TEAM);
    var monster = battle.makeObject("monster");
    monster.setGridPosition(25, 5);
    this.addObject(monster, ENEMY_TEAM);
};

proto.initMap = function () {
    this.tileSize = 32;
    var gridWidth = Math.floor(SCREEN_WIDTH / this.tileSize);
    var gridHeight = Math.floor(SCREEN_HEIGHT / this.tileSize);
    this.pathManager = new battle.PathManager(gridWidth, gridHeight);

    this.map = [
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0],
        [0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
        [0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ];
};

proto.initPathingGrid = function() {
    this.pathingGrid = [];
    var width = this.map[0].length;
    var height = this.map.length;
    for (var y = 0; y < height; y++) {
        this.pathingGrid[y] = [];
        for (var x = 0; x < width; x++) {
            this.pathingGrid[y][x] = 0;
        }
    }
};

proto.initObjectGrid = function() {
    this.objectGrid = [];
    var width = this.map[0].length;
    var height = this.map.length;
    for (var y = 0; y < height; y++) {
        this.objectGrid[y] = [];
        for (var x = 0; x < width; x++) {
            this.objectGrid[y][x] = "";
        }
    }
};

proto.registerObjectPosition = function(object) {
    var x = object.gridX;
    var y = object.gridY;
    this.objectGrid[y][x] = object;
    this.map[y][x] = -1;
};

proto.unregisterObjectPosition = function(object) {
    var x = object.gridX;
    var y = object.gridY;
    this.objectGrid[y][x] = "";
    this.map[y][x] = 0;
};

proto.updatePathingGrid = function(path) {
    this.initPathingGrid();
    for (var i in path) {
        var x = path[i][0];
        var y = path[i][1];
        this.pathingGrid[y][x] = 1;
    }
};

proto.drawPathingCells = function(ctx) {
    var height = this.pathingGrid.length;
    var width = this.pathingGrid[0].length;
    for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
            if (this.pathingGrid[y][x] === 1) {
                this.drawCellRect(ctx, x, y, "rgba(50, 50, 55, 0.5)");
            }
        }
    }
};

proto.drawCellRect = function(ctx, x, y, color) {
    var tileSize = this.tileSize;
    var sx = x * tileSize;
    var sy = y * tileSize;
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(50, 50, 255, 0.5)";
    ctx.strokeRect(sx, sy, tileSize, tileSize);
    ctx.fillStyle = color;
    ctx.fillRect(sx, sy, tileSize, tileSize);
};

proto.handleImagesLoaded = function () {
    this.imagesLoaded = true;
}

proto.update = function () {
    if (this.imagesLoaded !== true) {
        return;
    }
    var now = battle.now();
    var elapsed = now - this.lastUpdate;
    this.lastUpdate = now;

    this.lastTurn = this.currentTurn;
    if (this.currentTurn === PLAYER_TEAM) {
        this.handleInput();
    } else if (this.currentTurn === ENEMY_TEAM) {
        var obj = this.getActiveMembers(ENEMY_TEAM)[0];
        if ( obj && !obj.isMoving()) {
            var player = this.getPlayerObject();
            obj.chaseThenFire(player, this);
        }
    }
    this.updatePlayTurn();

    this.updateObjects(elapsed, this);
    var ctx = this.canvases["display"].getContext("2d");
    this.render(ctx);
};

proto.updatePlayTurn = function () {
    if (this.hasActiveTeamMember(PLAYER_TEAM)) {
        this.currentTurn = PLAYER_TEAM;
    } else if (this.hasActiveTeamMember(ENEMY_TEAM)) {
        this.currentTurn = ENEMY_TEAM;
    } else {
        this.initPathingGrid();
        if (this.lastTurn === PLAYER_TEAM) {
            this.currentTurn = ENEMY_TEAM;
            this.activeTeam(ENEMY_TEAM);
        } else if (this.lastTurn === ENEMY_TEAM) {
            this.currentTurn = PLAYER_TEAM;
            this.activeTeam(PLAYER_TEAM);
        }
    }
};

proto.hasActiveTeamMember = function (team) {
    for (var x in this.objects) {
        var obj = this.objects[x];
        if (obj.team === team && !obj.hasState(battle.Object.states.IDLE)) {
            return true;
        }
    }
    return false;
};

proto.getActiveMembers = function (team) {
    var members = [];
    for (var x in this.objects) {
        var obj = this.objects[x];
        if (obj.team === team && !obj.hasState(battle.Object.states.IDLE)) {
            members.push(obj);
        }
    }
    return members;
};

proto.activeTeam = function (team) {
    for (var x in this.objects) {
        var obj = this.objects[x];
        if (obj.team === team && obj.hasState(battle.Object.states.IDLE)) {
            obj.removeState(battle.Object.states.IDLE);
        }
    }
    return false;
};

proto.handleInput = function () {
    var buttons = battle.Mouse.buttons;
    var player = this.getPlayerObject();

    if (this.mouse.wasButtonClicked(buttons.LEFT)) {
        var mgp = this.getMouseGridPosition();
        var obj = this.getObjectAt(mgp.x, mgp.y);
        if (obj) {
            if (obj.role === "dragon") {
                var path = this.pathManager.getMoveRange(this.map, player);
                this.updatePathingGrid(path);
            } else if (obj.team !== player.team) {
                var direction = player.getDirectionTo(obj);
                if (direction) {
                    this.objectAttack(player, direction);
                }
            }
        } else if (this.isPathAt(mgp.x, mgp.y)) {
            var path = this.findPath(player, mgp.x, mgp.y);
            player.followPath(path);
        }
    }

    this.mouse.storeButtonStates();
};

proto.getObjectAt = function(x, y) {
    return this.objectGrid[y][x];
};

proto.isPathAt = function(x, y) {
    return (this.pathingGrid[y][x] === 1);
};

proto.findPath = function (object, goalX, goalY) {
    var sx = object.gridX;
    var sy = object.gridY;
    var path = this.pathManager.findIncompletePath(
                    this.map,
                    sx, sy,
                    goalX,goalY);
    return path;
}

proto.getPlayerObject = function () {
    return this.objects[this.playerObjectId];
}

proto.updateObjects = function (elapsed, engine) {
    for (var x in this.objects) {
        var o = this.objects[x];
        if (o.isDead()) {
            if (o.role == "dragon") {
                this.state = "over";
                break;
            }
            this.removeObject(o);
            continue;
        }
        o.update(elapsed, engine);
        this.unregisterObjectPosition(o);
        this.moveObject(elapsed, o);
        if (this.getObjectAt(o.gridX, o.gridY)) {
            this.dealDamage(o, this.getObjectAt(o.gridX, o.gridY));
        } else {
            this.registerObjectPosition(o);
        }
    }
};

proto.dealDamage = function(attacker, defender) {
    if (attacker.type === "weapon") {
        this.removeObject(attacker);
        if (defender.wound(attacker.damage)) {;
            defender.die();
            this.spawnObject(defender, "explosion");
        } else {
            defender.addState(battle.Object.states.HURTING, 200);
        }
    }
};

proto.moveObject = function (elapsed, o) {
    o.move(elapsed);
};

proto.getMouseGridPosition = function () {
    var tileSize = this.tileSize;
    return {
        x: Math.floor(this.mouse.mouseX / tileSize),
        y: Math.floor(this.mouse.mouseY / tileSize)
    };
};

proto.render = function (ctx) {
    this.drawFloor(ctx);
    this.drawPathingCells(ctx);
    this.drawCursor(ctx);
    this.drawObjects(ctx);
};

proto.drawCursor = function (ctx) {
    var tileSize = this.tileSize;
    var mgp = this.getMouseGridPosition();
    ctx.drawImage(
            this.images.getImage("target"),
            0, 0,
            32, 32,
            mgp.x * tileSize, mgp.y * tileSize, 32, 32);
};

proto.drawFloor = function (ctx) {
    var tileSize = this.tileSize;
    var width = this.map[0].length;
    var height = this.map.length;

    for (var i = 0; i < width; i++) {
        for (var j = 0; j < height; j++) {
            var offset;
            switch (this.map[j][i]) {
                case 0:
                    offset = 0;
                    break;
                case 1: 
                    offset = 1;
                    break;
                default: 
                    offset = 0;
            }
            ctx.drawImage(
                    this.images.getImage("tile"),
                    offset * tileSize, 0, tileSize, tileSize,
                    i * tileSize, j * tileSize,
                    tileSize, tileSize);
        }
    }
}

proto.drawObjects = function (ctx) {
    for (var x in this.objects) {
        var object = this.objects[x];
        if (!object.isDead()) {
            this.drawObject(ctx, object);
        }
    }
}

proto.drawObject = function (ctx, o) {
    ctx.save();
    ctx.translate(o.x + o.size.width / 2, o.y + o.size.height / 2);
    if (o.flipSpriteX) {
        ctx.scale(-1, 1);
    }

    var s = o.getSpriteXY();
    ctx.drawImage(
        this.images.getImage(o.spriteSheet),
        s.x, s.y, 
        o.size.width, o.size.height,
        -(o.size.width / 2), -(o.size.height / 2), o.size.width, o.size.height);

    if (o.hasState(battle.Object.states.HURTING)) {
        this.drawImageOverlay(
            ctx, this.images.getImage(o.spriteSheet),
            s.x, s.y, 
            o.size.width, o.size.height,
            -(o.size.width / 2), -(o.size.height / 2), o.size.width, o.size.height,
            "rgba(186, 51, 35, 0.6)");
    } else if (o.hasState(battle.Object.states.IDLE)) {
        this.drawImageOverlay(
            ctx, this.images.getImage(o.spriteSheet),
            s.x, s.y, 
            o.size.width, o.size.height,
            -(o.size.width / 2), -(o.size.height / 2), o.size.width, o.size.height,
            "rgba(216, 251, 235, 0.4)");
    }
    ctx.restore();
};

proto.drawImageOverlay = function (
    ctx, image, 
    spriteX, spriteY,
    spriteWidth, spriteHeight, 
    destX, destY,
    destWidth, destHeight,
    fillStyle
) {

    var buffer = this.canvases.buffer.getContext("2d");
    buffer.save();
    buffer.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    buffer.drawImage(image,
            spriteX, spriteY, spriteWidth, spriteHeight,
            0, 0, 
            destWidth, destHeight);

    buffer.globalCompositeOperation = "source-in";
    buffer.fillStyle = fillStyle;
    buffer.fillRect(0, 0, destWidth, destHeight);
    buffer.restore();

    ctx.drawImage(this.canvases.buffer, 
            0, 0, destWidth, destHeight,
            destX, destY, 
            destWidth, destHeight);

};

proto.addObject = function(object) {
    this.objectId++;
    var currentObjectId = "o" + this.objectId;

    object.id = currentObjectId;
    this.objects[currentObjectId] = object;
    this.registerObjectPosition(object);
    return currentObjectId;
};

proto.removeObject = function(object) {
    this.unregisterObjectPosition(object);
    delete(this.objects[object.id]);
};

proto.objectAttack = function(object, direction) {
    var weaponType = object.fireWeapon();
    if (!weaponType) {
        return false;
    }
    this.spawnObject(object, weaponType, direction);
};

proto.spawnObject = function(parent, type, direction) {
    if (direction === null) {
        direction = parent.direction;
    }
    var obj = battle.makeObject(type);
    obj.setGridPosition(parent.gridX, parent.gridY);
    obj.setDirection(direction);
    this.addObject(obj);
};
})();
