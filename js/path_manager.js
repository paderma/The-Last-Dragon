(function () {

var Node = function (value, x, y, parent) {
    this.value = value;
    this.x = x;
    this.y = y;
    this.parent = parent || null;
    this.f = 0;
    this.g = 0;
};

Node.prototype.getDistance = function (node) {
    return (Math.abs(this.x - node.x) + Math.abs(this.y - node.y));
}

var Map = function (grid) {
    this.grid = grid;
    this.width = grid[0].length;
    this.height = grid.length;
};

Map.prototype.makeNode = function (x, y, parent) {
    var value = x + (this.width * y);
    return new Node(value, x, y, parent);
}

Map.prototype.isWalkable = function (node) {
    var x = node.x;
    var y = node.y;
    if (this.grid[y] && this.grid[y][x] !== 0) {
        return false;
    }
    return (x >= 0 && x < this.width && y >= 0 && y < this.height);
};

Map.prototype.getNeighbours = function (node) {
    var neighbours = [];
    var axisX = [0, 1, 0, -1];
    var axisY = [-1, 0, 1, 0];
    for (var i = 0; i < axisX.length; i++) {
        var n = this.makeNode(node.x + axisX[i], node.y + axisY[i], node);
        if (this.isWalkable(n)) {
            neighbours.push(n);
        }
    }
    return neighbours;
}

battle.PathManager = function (width, height) {
    this.width = width;
    this.height = height;
    this.blankGrid = [];
    this.initBlankGrid();
};

var proto = battle.PathManager.prototype;

proto.initBlankGrid = function () {
    for (var y = 0; y < this.height; y++) {
        this.blankGrid[y] = [];
        for (var x = 0; x < this.width; x++) {
            this.blankGrid[y][x] = 0;
        }
    }
};

proto.findPath = function (grid, startX, startY, goalX, goalY) {
    this.map = new Map(grid);

    var start = this.map.makeNode(startX, startY);
    var goal = this.map.makeNode(goalX, goalY);
    var openList = [start];
    var closedList = {};
    closedList[start.value] = true;

    var len = 0;
    while (len = openList.length) {
        var minF = {
            index: -1,
            f: Infinity
        }
        for (var i = 0; i < len; i++) {
            if (openList[i].f < minF.f) {
                minF.f = openList[i].f;
                minF.index = i;
            }
        }
        var node = openList.splice(minF.index, 1)[0];
        if (node.value === goal.value) {
            var results = [];
            do {
                results.push([node.x, node.y]);
            } while (node = node.parent);
            results.reverse();
            return results;
        } else {
            var neighbours = this.map.getNeighbours(node);
            for (var i = 0; i < neighbours.length; i++) {
                var n = neighbours[i];
                if (!closedList[n.value]) {
                    n.g = node.g + n.getDistance(node);
                    n.f = n.g + n.getDistance(goal);
                    openList.push(n);
                    closedList[n.value] = true;
                }
            }
        }
    }
    return null;
};

proto.findIncompletePath = function (grid, startX, startY, goalX, goalY) {
    this.grid = grid;
    var perfect, x, y,
        incomplete = [];

    perfect = this.findPath(this.blankGrid, startX, startY, goalX, goalY);

    for (var i = perfect.length - 1; i > 0; i--) {
        x = perfect[i][0];
        y = perfect[i][1];
        if (this.grid[y][x] === 0) {
            incomplete = this.findPath(this.grid, startX, startY, x ,y);
            break;
        }
    }
    return incomplete;
};

proto.getMoveRange = function(grid, object) {
    this.map = new Map(grid);
    var start = this.map.makeNode(object.gridX, object.gridY);
    var maxDepth = object.moveRange;
    var path = [[start.x, start.y]];

    var nodes = [start];
    var visitedNodes = {};
    visitedNodes[start.value] = true;

    var d = 0;
    while (d < maxDepth) {
        d++; 
        var newNodes = [];
        for (var i = 0; i < nodes.length; i++) {
            var neighbours = this.map.getNeighbours(nodes[i]);
            for (var j = 0; j < neighbours.length; j++) {
                var n = neighbours[j];
                if (!visitedNodes[n.value] && this.map.isWalkable(n)) {
                    path.push([n.x, n.y]);
                    newNodes.push(n);
                    visitedNodes[n.value] = true;
                }
            }
        }
        nodes = newNodes;
    }
    return path;
};

})()
