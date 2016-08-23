(function(window, document, undefined) {
    'use strict';

    // var ... Global var of project
    var TILE_WIDTH = 80;
    var TILE_HEIGHT = 40;
    
    var Text = function() {
        this.textList = {
                'home': "Stanley vient de démarrer le jeu. Il s'apprête à cliquer sur jouer.",
                'lvl1-1': "Stanley découvre le nouveau monde qui l'entoure. Tout semble parfait par ici. L'impression de 3d, les couleurs... Les développeurs ont assurés, on dirait qu'aucun bug ne saurait survenir par ici.",
                '': '',
                '': '',
                '': '',
                '': '',
                '': '',
                '': '',
                '': '',
                '': '',
        };
        
        this.textWrapper = document.getElementById('t');
    };
    
    Text.prototype.show = function(id) {
        // Sets new text, clears previous displayed text
        this.currentText = this.textList[id];
        this.textWrapper.textContent = '';
        this.showLetter(0);
    };

    Text.prototype.showLetter = function(index) {
        this.textWrapper.textContent = this.textWrapper.textContent + this.currentText[index];;
        if(this.currentText.length > ++index) {
            setTimeout(() => {
                this.showLetter(index);
            }, 10);
        }
    }
    
    /*
     * The level
     */
    var Level = function() {
    };

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

    Game.prototype.bindEvents = function() {
        window.addEventListener('keydown', function(e) {
            switch(e.which) {
            case 40: // Down
                this.player.isMovingDown = true;
                this.player.isMovingUp = false;
                break;
            case 38: // Up
                this.player.isMovingUp = true;
                this.player.isMovingDown = false;
                break;
            case 37: // Left
                this.player.isMovingLeft = true;
                this.player.isMovingRight = false;
                break;
            case 39: // Right
                this.player.isMovingLeft = false;
                this.player.isMovingRight = true;
                break;
            }
        }.bind(this), true);

        window.addEventListener('keyup', function(e) {
            switch(e.which) {
            case 40: // Down
                this.player.isMovingDown = false;
                break;
            case 38: // Up
                this.player.isMovingUp = false;
                break;
            case 37: // Left
                this.player.isMovingLeft = false;
                break;
            case 39: // Right
                this.player.isMovingRight = false;
                break;
            }
        }.bind(this), true);
    };

    /**
     * Constructor
     */
    function Game() {
        this.backgroundElement = document.getElementById('bg');
        this.displayStartScreen = false;
    };

    Game.prototype.start = function() {
        this.bindEvents();
        
        this.level = new Level();

        this.player = new Player();
        this.player.image = document.getElementById('c');
        this.player.width = this.player.image.width;
        this.player.height = this.player.image.height;
        
        console.log(this.player);

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
            (canvasWidth - TILE_WIDTH) / 2 - (this.player.position.x + this.player.position.y) * TILE_WIDTH/ 2,
            canvasHeight / 2 - 5 - TILE_HEIGHT * 2 + (this.player.position.x - this.player.position.y) * TILE_HEIGHT / 2
        );
        
        // Sets player position
        this.player.draw();
        
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
        width: 10,
        height: 3,
        startCell: {x: 1, y: 2}
     };
         
    var Player = function() {
        
    };
    
    Player.prototype.draw = function(coordinates) {
        // TODO: set player direction
        context.drawImage(this.image, (canvasWidth - this.width) / 2, (canvasHeight ) / 2);
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