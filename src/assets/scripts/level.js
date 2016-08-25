var TILE_WIDTH = 100;
var TILE_HEIGHT = 50;

//TODO: Change fill collor for cell/elevation depending of level (desert/sand, ice, grass, castle...)
//TODO: a z-indexed map (one image per cell elevation? to avoid player behind cells still visible. Or avoid player behind cells in game design...
// TODO: split "generateImage" to "drawCell". Will be able to redraw only one cell when an item is picked

var Level = function(number) {
    this.number = number; // Current level number
    this.step = 0; // Current step in level. Step increase when something is triggered, like show a new text, to avoid multiple trigger
    this.init();
};

Level.prototype.init = function() {
    var cellList = [];
    var levelDesign = LEVEL_LIST[this.number];

    // Gets level design.
    switch(this.number) {
        case 1:
            for(var y = 0; y < levelDesign.height; ++y) {
                cellList[y] = [];
                for(var x = 0; x < levelDesign.width; ++x) {
                    cellList[y][x] = 1;
                    if(x === 30 && y === 1 || x === 3 && y === 1) {
                        cellList[y][x] = 1.1;
                    }
                    if(x === 5 && y === 1) {
                        cellList[y][x] = 2;
                    }
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
    var canvas = document.createElement("canvas");
    //TODO: Add cell elevation to canvas size
    canvas.width = (this.height + this.width) / 2 * TILE_WIDTH;
    canvas.height = (this.height + this.width) / 2 * TILE_HEIGHT + TILE_HEIGHT / 2;
    
    this.canvasWidth = canvas.width;
    this.canvasHeight = canvas.height;
    
    var context = canvas.getContext("2d");
    
    context.fillStyle = '#aaa';
    context.rect(0, 0, this.canvasWidth, this.canvasHeight);
    context.fill();
    
    for(var y in this.cellList) {
        for(var x in this.cellList[y]) {
            var x = this.cellList[y].length - 1 - parseInt(x);
            y = parseInt(y);
            
            var cell = this.getCell(x, y);

            // Draws cell elevation
            if(cell.elevation > 0) {
                context.fillStyle = '#974';
                context.beginPath();
                context.moveTo(cell.x - TILE_WIDTH / 2, cell.y + TILE_HEIGHT * cell.elevation / 2);
                context.lineTo(cell.x - TILE_WIDTH / 2, cell.y);
                context.lineTo(cell.x + TILE_WIDTH / 2, cell.y);
                context.lineTo(cell.x + TILE_WIDTH / 2, cell.y + TILE_HEIGHT * cell.elevation / 2);
                context.lineTo(cell.x, cell.y + TILE_HEIGHT / 2 + TILE_HEIGHT * cell.elevation / 2);
                context.closePath();
                context.fill();
            }
            
            // Draws cell
            context.fillStyle = '#5C5';
            context.beginPath();
            context.moveTo(cell.x - TILE_WIDTH / 2, cell.y);
            context.lineTo(cell.x, cell.y + TILE_HEIGHT / 2);
            context.lineTo(cell.x + TILE_WIDTH / 2, cell.y);
            context.lineTo(cell.x, cell.y - TILE_HEIGHT / 2);
            context.closePath();
            context.fill();

            // Displays cell coordinates to help debug
            context.fillStyle = '#333';
            context.font = "10px Sans-Serif";
            //context.fillText(x + ', ' + y, cell.x, cell.y);
            
            // Draw cell item
            switch(cell.type) {
            case 1: // Key
                // Gets image
                var image = document.getElementById('k');
                context.drawImage(image, cell.x - image.width / 2, cell.y - TILE_HEIGHT / 4);
                break;
            case 1: // Tree
                context.fillStyle = '#080';
                context.beginPath();
                context.moveTo(cell.x - TILE_WIDTH / 5, cell.y);
                context.lineTo(cell.x + TILE_WIDTH / 5, cell.y);
                context.lineTo(cell.x, cell.y - TILE_HEIGHT);
                context.closePath();
                context.fill();
            break;
            default:
                break;
            }
        }
    }
    
    // Save level image
    var image = new Image();
    image.src = canvas.toDataURL();
    this.image = image;
};

Level.prototype.getCell = function(x, y) {
    var cell = this.cellList[y][x].toString().split('.');
    var cellElevation = parseInt(cell[0]);
    var cellType = parseInt(cell[1]) || 0;

    var tileX = TILE_WIDTH * ((x + y) / 2) + TILE_WIDTH / 2;
    var tileY = TILE_HEIGHT * (y - (x + y) / 2) + this.canvasHeight - this.height * TILE_HEIGHT / 2 - TILE_HEIGHT * cellElevation / 2;

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
    // TODO: Get cell list, split to get cell type. If cell is a key, pick the key, refresh level map, display text
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

    // Checks if cells contains a key
    targetCell = targetCell.toString().split('.');
    var cellType = parseInt(targetCell[1]) || 0;
    if(cellType === 1) {
        this.cellList[targetY][targetX] = targetCell[0];
        // TODO: Generate only the current cell on the image
        this.generateImage();
    }
}

var LEVEL_LIST = {
    1: {
        width: 50,
        height: 3,
        startCell: {x: 0, y: 1}
    }
}

module.exports = Level;