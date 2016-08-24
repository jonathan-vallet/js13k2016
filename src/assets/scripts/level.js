var TILE_WIDTH = 100;
var TILE_HEIGHT = 50;

var Level = function() {
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
            context.fillText(x + ', ' + y, cell.x, cell.y);
            
            // Draw cell item
            switch(cell.type) {
                case 1:
                    // Tree
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

Level.prototype.getCellFromCoordinates = function(x, y) {
    console.log(x, y);
};

module.exports = Level;