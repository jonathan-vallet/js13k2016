(function(window, document, undefined) {
    'use strict';

    var Level = require('./level');
    var Player = require('./player');
    var Text = require('./text');
    
    // var ... Global var of project
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
        this.level = new Level();

        //Inits player
        this.player = new Player();
        
        this.level.number = 1;
        
        this.setLevel();
        
        text.show('lvl1-1');
        
        this.loop();
    }

    Game.prototype.loop = function() {
        // Clears canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

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
        
        // Draws level at correction position
        var cellElevation = 1;
        context.drawImage(this.level.image,
                canvasWidth / 2 - (TILE_WIDTH * ((this.player.position.x + this.player.position.y) / 2) + TILE_WIDTH / 2),
                canvasHeight / 2 + this.player.height - (TILE_HEIGHT * (this.player.position.y - (this.player.position.x + this.player.position.y) / 2) + this.level.canvasHeight - this.level.height * TILE_HEIGHT / 2 - TILE_HEIGHT * cellElevation / 2)
        );

        // Sets player position
        context.drawImage(this.player.image, (canvasWidth - this.player.width) / 2, (canvasHeight ) / 2);

        // Loop
        window.requestAnimationFrame(this.loop.bind(this));
    }
    
    Game.prototype.setLevel = function() {
        var cellList = [];
        var level = level1;

        // Gets level design.
        switch(this.level.number) {
            case 1:
                for(var y = 0; y < level.height; ++y) {
                    cellList[y] = [];
                    for(var x = 0; x < level.width; ++x) {
                        cellList[y][x] = 1;
                    }
                }
            break;
            default:
                break;
        }

        // Draws level map
        this.level.cellList = cellList;
        this.level.generateImage();

        // Gets start cell position
        this.player.position = level.startCell;
    };

    var level1 = {
        width: 50,
        height: 3,
        startCell: {x: 0, y: 1}
     };

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
    text.show('home');
    document.getElementById('p').addEventListener('click', function() {
        this.style.display = 'none';
        game.start();
    });
    
}(window, document));