var TILE_WIDTH = 80;
var TILE_HEIGHT = 40;

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
    
    var context = canvas.getContext("2d");
    for(var y in this.cellList) {
        for(var x in this.cellList[y]) {
            var x = this.cellList[y].length - 1 - parseInt(x);
            y = parseInt(y);
            var cell = this.cellList[y][x].toString().split('.');
            var cellElevation = parseInt(cell[0]);
            var cellType = parseInt(cell[1]) || 0;
            
            var tileX = TILE_WIDTH * ((x + y) / 2) + 40;
            var tileY = TILE_HEIGHT * (y - (x + y) / 2) + canvas.height - this.height * TILE_HEIGHT / 2;

            if(cellElevation > 0) {
                context.fillStyle = '#974';
                context.beginPath();
                context.moveTo(tileX - TILE_WIDTH / 2, tileY);
                context.lineTo(tileX - TILE_WIDTH / 2, tileY - TILE_HEIGHT * cellElevation / 2);
                context.lineTo(tileX + TILE_WIDTH / 2, tileY - TILE_HEIGHT * cellElevation / 2);
                context.lineTo(tileX + TILE_WIDTH / 2, tileY);
                context.lineTo(tileX, tileY + TILE_HEIGHT / 2);
                context.closePath();
                context.fill();
            }

            tileY -= TILE_HEIGHT * cellElevation / 2;
            
            // Draws cell
            context.fillStyle = '#5C5';
            context.beginPath();
            context.moveTo(tileX - TILE_WIDTH / 2, tileY);
            context.lineTo(tileX, tileY + TILE_HEIGHT / 2);
            context.lineTo(tileX + TILE_WIDTH / 2, tileY);
            context.lineTo(tileX, tileY - TILE_HEIGHT / 2);
            context.closePath();
            context.fill();

            // Displays cell coordinates to help debug
            context.fillStyle = '#333';
            context.font = "10px Sans-Serif";
            context.fillText(x + ', ' + y, tileX, tileY);
            
            // Draw cell item
            switch(cellType) {
                case 1:
                    // Tree
                    context.fillStyle = '#080';
                    context.beginPath();
                    context.moveTo(tileX - TILE_WIDTH / 5, tileY);
                    context.lineTo(tileX + TILE_WIDTH / 5, tileY);
                    context.lineTo(tileX, tileY - TILE_HEIGHT);
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

module.exports = Level;