(function () {

battle.ImageLoader = function () {
    this.imgs = {};
    this.loaded = 0;
    this.total = 0;
};

var proto = battle.ImageLoader.prototype;

proto.download = function (imgs, callback, context) {
    this.callback = function () {
        callback.apply(context, arguments);
    };
    for ( var x in imgs) {
        this.total++;
        var image = new Image();
        this.imgs[x] = image;
        battle.on("load", this.handleLoaded, image, this);
        battle.on("error", this.handleError, image, this);
        image.src = imgs[x];
    }
}

proto.increment = function () {
    this.loaded++;
    if (this.loaded >= this.total) {
        this.callback();
    }
}

proto.handleLoaded = function () {
    this.increment();
}

proto.handleError = function () {
    this.increment();
}

proto.getImage = function (key) {
    if (this.imgs[key]) {
        return this.imgs[key];
    }
    return false;
}

})()



