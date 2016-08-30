// TODO: Detect cell collisions with borders
// TODO: Detect cell collision with different elevations
// TODO: Manage jump (add a shadow under player to know its real position
// TODO: Improve level step system to remove them from Game class if possible
// TODO: Redraw world map when a key is picked (try to clear/redraw just the cell to avoid whole map generation, or just have another image/canvas with items

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length,c.length);
        }
    }
    return "";
}

(function(window, document, undefined) {
    'use strict';

    var Level = require('./level');
    var Player = require('./player');
    var Text = require('./text');
    
    var TILE_WIDTH = 100;
    var TILE_HEIGHT = 50;
    
    var MOVE_SPEED = 0.1;

    /**
     * Constructor
     */
    function Game() {
        this.backgroundElement = document.getElementById('bg');
        this.displayStartScreen = false;
    };

    Game.prototype.start = function() {
        // Inits level
        var startLevel = getCookie('restart') === '1' ? 3 : 1;
        this.level = new Level(startLevel);

        //Inits player
        this.player = new Player();
        this.player.position = this.level.startCell;
        
        text.show('lvl' + startLevel + '-1');

        this.loop();
    }

    Game.prototype.loop = function() {
        var previousPosition = {
            x: this.player.position.x,
            y: this.player.position.y
        }

        // Updates player position
        if(this.player.isMovingLeft) {
            this.player.position.x -= MOVE_SPEED;
        } else if(this.player.isMovingRight) {
            this.player.position.x += MOVE_SPEED;
        }
        if(this.player.isMovingUp) {
            this.player.position.y -= MOVE_SPEED;
        } else if(this.player.isMovingDown) {
            this.player.position.y += MOVE_SPEED;
        }

        if(previousPosition.x === this.player.position.x && previousPosition.y === this.player.position.y) {
        } else if(this.level.checkCellCollision(previousPosition.x + 0.5, previousPosition.y + 0.5, this.player.position.x + 0.5, this.player.position.y + 0.5)) {
            this.player.position = previousPosition;
        };

        if(this.level.isEnded) {
            ++this.level.number;
            this.level.init();
            this.player.position = this.level.startCell;
            text.show('lvl2-1');
        }
        
        // If player position has not change, do nothing, just loop
        // TODO: find a way to draw world during first loop before the player moves
//        if(previousPosition.x === this.player.position.x && previousPosition.y === this.player.position.y) {
//            // Loop
//            window.requestAnimationFrame(this.loop.bind(this));
//        }
        // Clears canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Checks level step
        if(this.level.number === 1 || this.level.number === 3) {
            if(this.level.step < 10 && this.player.position.x >= 10) {
                text.show('lvl1-2');
                this.level.step = 10
            } else if(this.level.step < 20 && this.player.position.x >= 25) {
                text.show('lvl1-3');
                this.level.step = 20;
            } else if(this.level.step < 25 && !this.level.isKeyPicked && this.player.position.x >= 35) {
                text.show('lvl1-4');
                this.level.step = 25;
            } else if(this.level.step < 30 && !this.level.isKeyPicked && this.player.position.x >= 45) {
                text.show('lvl1-5');
                this.level.step = 30;
            } else if(this.level.step < 50 && this.level.isKeyPicked && this.player.position.x >= 45) {
                text.show('lvl' + this.level.number + '-7');
                this.level.step = 50;
            }
        }

        // Draws level at correction position
        var cellElevation = 1;
        context.drawImage(this.level.image,
                parseInt(canvasWidth / 2 - (TILE_WIDTH * ((this.player.position.x + this.player.position.y) / 2) + TILE_WIDTH / 2)),
                parseInt(canvasHeight / 2 + this.player.height - (TILE_HEIGHT * (this.player.position.y - (this.player.position.x + this.player.position.y) / 2) + this.level.canvas.height - this.level.height * TILE_HEIGHT / 2 - TILE_HEIGHT * cellElevation / 2))
        );

        // Sets player position
        context.drawImage(this.player.image, (canvasWidth - this.player.width) / 2, (canvasHeight ) / 2);

        // Level 2: Make the key glitch
        if (this.level.number === 2 && this.level.step >= 50) {
            var image = document.getElementById('k');
            var cell = this.player.position;
            context.save();
            context.translate((canvasWidth - image.width) / 2, (canvasHeight + this.player.height) / 2);
            context.rotate(Math.random() * Math.PI * 2); 
            context.drawImage(image, 0, 0);
            context.restore();
        }
        
        // Loop
        window.requestAnimationFrame(this.loop.bind(this));
    }
    
    // Inits canvas
    var canvas = document.getElementById('glitch');
    canvas.width = 900;
    canvas.height = 400;
    var context = canvas.getContext('2d');
    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;

    var text = new Text();
    var game = new Game();
    
    // Game start: displays home message and play button.
    text.show('home' + (getCookie('restart')));
    document.getElementById('p').addEventListener('click', function() {
        this.style.display = 'none';
        game.start();
    });
    
}(window, document));