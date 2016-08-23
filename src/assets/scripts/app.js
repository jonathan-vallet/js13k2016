(function(window, document, undefined) {
    'use strict';

    var Level = require('./level');
    var Player = require('./player');
    var Text = require('./text');
    
    // var ... Global var of project
    var TILE_WIDTH = 80;
    var TILE_HEIGHT = 40;
    
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
            this.player.position.x -= 0.1;
        } else if(this.player.isMovingRight) {
            this.player.position.x += 0.1;
        }
        if(this.player.isMovingUp) {
            this.player.position.y -= 0.1;
        } else if(this.player.isMovingDown) {
            this.player.position.y += 0.1;
        }
        
        // Draws level at correction position
        context.drawImage(this.level.image,
//                (canvasWidth - TILE_WIDTH) / 2 - (this.player.position.x + this.player.position.y) * TILE_WIDTH/ 2,
//                canvasHeight / 2 - 5 - TILE_HEIGHT * 2 + (this.player.position.x - this.player.position.y) * TILE_HEIGHT / 2
                (canvasWidth - TILE_WIDTH) / 2 - (this.player.position.x + this.player.position.y) * TILE_WIDTH/ 2,
                canvasHeight / 2 - 5 - TILE_HEIGHT * 3 + (this.player.position.x - this.player.position.y) * TILE_HEIGHT / 2
        );
        
        // Sets player position
        //this.player.draw();
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

        this.player.position = level.startCell;
    };

    var level1 = {
        width: 9,
        height: 3,
        startCell: {x: 8, y: 2}
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