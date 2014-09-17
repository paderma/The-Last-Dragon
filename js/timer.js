(function () {

battle.Timer = function () {
    this.ttl = 0;
    this.elapsed_ms = 0;
};

var proto = battle.Timer.prototype;

proto.start = function (ttl) {
    if (ttl) {
        this.ttl = Number(ttl);
    }
    this.elapsed_ms = 0;
};

proto.update = function (elapsed) {
    this.elapsed_ms += elapsed;
};

proto.reset = function () {
    this.start();
};

proto.expired = function () {
    if (this.ttl > 0) {
        return this.elapsed_ms > this.ttl;
    } 
    return false;
};

})()
