// TODO: Set correction player orientation when drawing (scale -1,1, back image...)

var Player = function() {
    // Gets image
    this.image = document.getElementById('c');
    this.width = this.image.width;
    this.height = this.image.height;
    
    // Binds movement events
    this.bindEvents();
};

Player.prototype.draw = function(coordinates) {
    context.drawImage(this.image, (canvasWidth - this.width) / 2, (canvasHeight ) / 2);
};

Player.prototype.bindEvents = function() {
    window.addEventListener('keydown', function(e) {
        switch(e.which) {
        case 40: // Down
            this.isMovingDown = true;
            this.isMovingUp = false;
            break;
        case 38: // Up
            this.isMovingUp = true;
            this.isMovingDown = false;
            break;
        case 37: // Left
            this.isMovingLeft = true;
            this.isMovingRight = false;
            break;
        case 39: // Right
            this.isMovingLeft = false;
            this.isMovingRight = true;
            break;
        }
    }.bind(this), true);

    window.addEventListener('keyup', function(e) {
        switch(e.which) {
        case 40: // Down
            this.isMovingDown = false;
            break;
        case 38: // Up
            this.isMovingUp = false;
            break;
        case 37: // Left
            this.isMovingLeft = false;
            break;
        case 39: // Right
            this.isMovingRight = false;
            break;
        }
    }.bind(this), true);
};

module.exports = Player;