(function () {
    
battle = {};

battle.now = function () {
    return Date.now();
}

bind = function (context, fn) {
    return function () {
        fn.apply(context, arguments);
    };
}

battle.on = function (type, fn, target, context) {
    target.addEventListener(type, function(e) {
        fn.call(context, e);
    });
};

battle.stopEvent = function (e) {
    e.cancelBubble = true;
    e.stopPropagation();
    e.preventDefault();
}

battle.getOffset = function horde_getOffset (node) {
	var offset = {
		x: node.offsetLeft, y: node.offsetTop
	};
    return offset;
};

battle.directions = {
    DOWN: 0,
    UP: 1,
    LEFT: 2,
    RIGHT: 3,
};

battle.makeCanvas = function (name, width, height) {
    var canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    var stage = document.getElementById("stage");
    stage.appendChild(canvas);
    return canvas
}

battle.makeObject = function (type) {
    var object = new battle.Object();
    for (var attr in battle.objectTypes[type]) {
        object[attr] = battle.objectTypes[type][attr];
    }
    return object;
}

battle.Size = function (width, height) {
    this.width = width;
    this.height = height;
};

})()
