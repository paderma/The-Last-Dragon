(function () {

battle.Mouse = function (canvas) {
    this.buttonStates = {};
    this.lastButtonStates = {};
    this.mouseX = 0;
    this.mouseY = 0;
    this.canvas = canvas;
    battle.on("mousemove", this.handleMouseMove, canvas, this);
    battle.on("mousedown", this.handleMouseDown, canvas, this);
    battle.on("mouseup", this.handleMouseUp, canvas, this);
}

var Mouse = battle.Mouse;
var proto = battle.Mouse.prototype;

Mouse.buttons = {
    LEFT: 0,
    RIGHT: 2
}

proto.handleMouseMove = function (e) {
    var offset = battle.getOffset(this.canvas);
    this.mouseX = e.clientX - offset.x;
    this.mouseY = e.clientY - offset.y;
}

proto.handleMouseDown = function (e) {
    this.buttonStates[e.button] = true;
    battle.stopEvent(e);
}

proto.handleMouseUp = function (e) {
    this.buttonStates[e.button] = false;
}

proto.isButtonDown = function (button) {
    return this.buttonStates[button];
}

proto.wasButtonClicked = function (button) {
    return (this.buttonStates[button] && !this.lastButtonStates[button]);
}

proto.storeButtonStates = function () {
    for (var key in this.buttonStates) {
        this.lastButtonStates[key] = this.buttonStates[key];
    }
}

})()

