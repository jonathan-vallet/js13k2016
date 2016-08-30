var TILE_WIDTH = 100;
var TILE_HEIGHT = 50;
var Text = require('./text');
var text = new Text();

var ITEM_TYPE_KEY = 1;
var ITEM_TYPE_DOOR = 2;

//TODO: Change fill collor for cell/elevation depending of level (desert/sand, ice, grass, castle...)
//TODO: a z-indexed map (one image per cell elevation? to avoid player behind cells still visible. Or avoid player behind cells in game design...
// TODO: split "generateImage" to "drawCell". Will be able to redraw only one cell when an item is picked

var Level = function(number) {
    this.number = number;
    this.init();
};

Level.prototype.init = function() {
    this.step = 0; // Current step in level. Step increase when something is triggered, like show a new text, to avoid multiple trigger
    this.isKeyPicked = false;
    this.isEnded = false;
    
    var cellList = [];
    var levelDesign = LEVEL_LIST[this.number];

    // Gets level design.
    switch(this.number) {
    case 1:
    case 2:
    case 3:
    case 4:
        for(var y = 0; y < levelDesign.height; ++y) {
            cellList[y] = [];
            for(var x = 0; x < levelDesign.width; ++x) {
                var cellValue = 1;
                if(x === levelDesign.keyCell.x && y === levelDesign.keyCell.y) {
                    cellValue += .1 * ITEM_TYPE_KEY;
                } else if(x === levelDesign.keyCell.x && y === levelDesign.keyCell.y) {
                        cellValue += .1 * ITEM_TYPE_KEY;
                    }
                
                if(x === 30 && y === 1) {
                    
                } else if(x === levelDesign.width - 1) {
                    cellValue = 4;
                } else if(x === levelDesign.width - 2 && y === 1) {
                    cellValue += .1 * ITEM_TYPE_DOOR;
                }
                cellList[y][x] = cellValue;
            }
        }
    break;
    default:
        break;
    }

    // Draws level map
    this.cellList = cellList;
    this.startCell = levelDesign.startCell;
    this.generateImage();
};

// Generates level image
Level.prototype.generateImage = function() {
    this.width = this.cellList[0].length;
    this.height = this.cellList.length;

    // Inits level images. Creates a tmp canvas to draw full level images
    this.canvas = document.createElement("canvas");
    
    this.canvas.width = (this.height + this.width) / 2 * TILE_WIDTH;
    this.canvas.height = (this.height + this.width) / 2 * TILE_HEIGHT + TILE_HEIGHT / 2;
    this.canvas.height += TILE_HEIGHT * 10; // Adds height to avoid cell elevation out of bounds
    
    this.context = this.canvas.getContext("2d");
    
    // Debug: fills the map canvas to show where is the whole image
//    this.context.fillStyle = '#aaa';
//    this.context.rect(0, 0, this.canvas.width, this.canvas.height);
//    this.context.fill();
    
    for(var y in this.cellList) {
        for(var x in this.cellList[y]) {
            var x = this.cellList[y].length - 1 - parseInt(x);
            y = parseInt(y);
            
            this.drawCell(x, y);
        }
    }
    
    // Save level image
    var image = new Image();
    image.src = this.canvas.toDataURL();
    this.image = image;
};

Level.prototype.drawCell = function(x, y, withElevation = true) {
    var cell = this.getCell(x, y);

    // Draws cell elevation
    if(withElevation && cell.elevation > 0) {
        this.context.fillStyle = '#974';
        this.context.beginPath();
        this.context.moveTo(cell.x - TILE_WIDTH / 2, cell.y + TILE_HEIGHT * cell.elevation / 2);
        this.context.lineTo(cell.x - TILE_WIDTH / 2, cell.y);
        this.context.lineTo(cell.x + TILE_WIDTH / 2, cell.y);
        this.context.lineTo(cell.x + TILE_WIDTH / 2, cell.y + TILE_HEIGHT * cell.elevation / 2);
        this.context.lineTo(cell.x, cell.y + TILE_HEIGHT / 2 + TILE_HEIGHT * cell.elevation / 2);
        this.context.closePath();
        this.context.fill();
    }

    // Draws cell
    this.context.fillStyle = '#5C5';
    this.context.beginPath();
    this.context.moveTo(cell.x - TILE_WIDTH / 2, cell.y);
    this.context.lineTo(cell.x, cell.y + TILE_HEIGHT / 2);
    this.context.lineTo(cell.x + TILE_WIDTH / 2, cell.y);
    this.context.lineTo(cell.x, cell.y - TILE_HEIGHT / 2);
    this.context.closePath();
    this.context.fill();

    // Displays cell coordinates to help debug
    this.context.fillStyle = '#333';
    this.context.font = "10px Sans-Serif";
    //this.context.fillText(x + ', ' + y, cell.x, cell.y);
    
    // Draw cell item
    switch(cell.type) {
    case 1: // Key
        // Gets image
        var image = document.getElementById('k');
        this.context.drawImage(image, cell.x - image.width / 2, cell.y - TILE_HEIGHT / 4);
        break;
    case 2: // Door
        // Gets image
        var image = document.getElementById('d');
        // TODO: Improve the way to place door...
        this.context.drawImage(image, cell.x + 8, cell.y - image.height - 3);
        break;
    case 3: // Tree
        this.context.fillStyle = '#080';
        this.context.beginPath();
        this.context.moveTo(cell.x - TILE_WIDTH / 5, cell.y);
        this.context.lineTo(cell.x + TILE_WIDTH / 5, cell.y);
        this.context.lineTo(cell.x, cell.y - TILE_HEIGHT);
        this.context.closePath();
        this.context.fill();
    break;
    default:
        break;
    }
};

Level.prototype.getCell = function(x, y) {
    var cell = this.cellList[y][x].toString().split('.');
    var cellElevation = parseInt(cell[0]);
    var cellType = parseInt(cell[1]) || 0;

    var tileX = TILE_WIDTH * ((x + y) / 2) + TILE_WIDTH / 2;
    var tileY = TILE_HEIGHT * (y - (x + y) / 2) + this.canvas.height - this.height * TILE_HEIGHT / 2 - TILE_HEIGHT * cellElevation / 2;

    return {
        x: tileX,
        y: tileY,
        elevation: cellElevation,
        type: cellType
    }
};

Level.prototype.checkCellCollision = function(currentX, currentY, targetX, targetY) {
    // Checks if player is out of bounds. For y, add an offset for player width
    if(targetX <= 0 || targetY <= 0.2 || targetX >= this.width || targetY >= this.height) {
        return true;
    }

    currentX = Math.floor(currentX);
    currentY = Math.floor(currentY);
    targetX = Math.floor(targetX);
    targetY = Math.floor(targetY);
    
    // Checks the cell where the player want to go
    var currentCell = this.cellList[currentY][currentX];
    var targetCell = this.cellList[targetY][targetX];

    // Checks if elevation of target cell is higher or not
    if(Math.floor(currentCell) < Math.floor(targetCell)) {
        return true;
    }

    // Checks if cells contains an item
    targetCell = targetCell.toString().split('.');
    var cellType = parseInt(targetCell[1]) || 0;

    switch(cellType) {
    case ITEM_TYPE_KEY:
        this.cellList[targetY][targetX] = targetCell[0];
        this.isKeyPicked = true;
        if(this.number === 1) {
            text.show('lvl1-6');
            this.step = 40;
        } else if(this.number === 2) {
            text.show('lvl2-2');
            setTimeout(function() {
                text.show('lvl2-3');
            }, 8000);
            this.step = 50;
            document.cookie = 'restart=1';
        }

        this.drawCell(targetX, targetY, false);
        this.image.src = this.canvas.toDataURL('image/png');
        break;
    case ITEM_TYPE_DOOR:
        this.isEnded =true;
        break;
    }
}

Level.prototype.end = function() {
    this.init();
}

var LEVEL_LIST = {
    1: {
        width: 50,
        height: 3,
        startCell: {x: 0, y: 1},
        keyCell: {x: 30, y: 1},
        doorCell: {x: 49, y: 1}
    },
    2: {
        width: 15,
        height: 3,
        startCell: {x: 0, y: 1},
        keyCell: {x: 5, y: 1},
        doorCell: {x: 14, y: 1}
    },
    3: {
        width: 50,
        height: 3,
        startCell: {x: 0, y: 1},
        keyCell: {x: 30, y: 1},
        doorCell: {x: 49, y: 1}
    },
    4: {
        width: 15,
        height: 3,
        startCell: {x: 0, y: 1},
        keyCell: {x: 5, y: 1},
        doorCell: {x: 14, y: 1}
    }
}

module.exports = Level;