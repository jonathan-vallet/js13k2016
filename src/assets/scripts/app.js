(function(window, document, undefined) {
    'use strict';

    // var ... Global var of project
    var TILE_WIDTH = 80;
    var TILE_HEIGHT = 40;
    var drawOffset = 250; // To test, remove after
    
    var Text = function() {
        this.textList = {
                'home': "Stanley vient de démarrer le jeu. Il s'apprête à cliquer sur jouer.",
                'intro1': "Stanley découvre le nouveau monde qui l'entoure. Tout semble parfait par ici. L'impression de 3d, les couleurs.<br />Les développeurs ont assurés, on dirait qu'aucun bug ne saurait survenir par ici.",
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
    
    Text.prototype.display = function(id) {
        var text = this.textList[id];
        
    };
    
    
    /*
     * The world map
     */
    var WorldMap = function() {
        this.moveVerticalDirection = 0;
    };
    
    WorldMap.prototype.create = function() {
        
        //this.cellList = [[3,3,4,4,4], [1,3,3,1,1], [1,1,1,0,1], [1,1,1,1,1]];
        this.cellList = [
             [1,1,1,1,1,1,1,1,1],
             [1,3,3,3,3,3,3,3,1],
             [1,3,5,5.1,5,5,5,3,1],
             [1,3,5,7,7,7,5,3,1],
             [1,3,5,7,9.1,7,5,3,1],
             [1,3,5,7,7,7,5,3,1],
             [1,3,5.1,5,5,5,5,3,1],
             [1,3,3,3,3,3,3,3,1],
             [1,1,1,1,1.1,1,1,1,1]
        ];

        context.clearRect(0, 0, canvas.width, canvas.height);
        
        var worldImage = this.generateImage();
        context.drawImage(worldImage, 0, 0);
    };

    WorldMap.prototype.generateImage = function(offset) {
        // Inits world images. Creates a tmp canvas to draw full world images
        var canvas = document.createElement("canvas");
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        var context = canvas.getContext("2d");

        for(var y in this.cellList) {
            //this.cellList[y].reverse();
            for(var toto in this.cellList[y]) {
                var x = this.cellList[y].length - 1 - parseInt(toto);
                y = parseInt(y);
                var cell = this.cellList[y][x].toString().split('.');
                var cellElevation = parseInt(cell[0]);
                var cellType = parseInt(cell[1]) || 0;
                
                var tileX = TILE_WIDTH * ((x + y) / 2);
                var tileY = TILE_HEIGHT * (y - (x + y) / 2);

                if(cellElevation > 0) {
                    context.fillStyle = '#974';
                    context.beginPath();
                    context.moveTo(tileX - TILE_WIDTH / 2 + drawOffset, tileY + drawOffset);
                    context.lineTo(tileX - TILE_WIDTH / 2 + drawOffset, tileY + drawOffset - TILE_HEIGHT * cellElevation / 2);
                    context.lineTo(tileX + TILE_WIDTH / 2 + drawOffset, tileY + drawOffset - TILE_HEIGHT * cellElevation / 2);
                    context.lineTo(tileX + TILE_WIDTH / 2 + drawOffset, tileY + drawOffset);
                    context.lineTo(tileX + drawOffset, tileY + TILE_HEIGHT / 2 + drawOffset);
                    context.closePath();
                    context.fill();
                }

                tileY -= TILE_HEIGHT * cellElevation / 2;
                
                context.fillStyle = '#5C5';
                context.beginPath();
                context.moveTo(tileX - TILE_WIDTH / 2 + drawOffset, tileY + drawOffset);
                context.lineTo(tileX + drawOffset, tileY + TILE_HEIGHT / 2 + drawOffset);
                context.lineTo(tileX + TILE_WIDTH / 2 + drawOffset, tileY + drawOffset);
                context.lineTo(tileX + drawOffset, tileY - TILE_HEIGHT / 2 + drawOffset);
                context.closePath();
                context.fill();

                // Draw cell item
                switch(cellType) {
                    case 1:
                        // Tree
                        context.fillStyle = '#080';
                        context.beginPath();
                        context.moveTo(tileX - TILE_WIDTH / 5 + drawOffset, tileY + drawOffset);
                        context.lineTo(tileX + TILE_WIDTH / 5 + drawOffset, tileY + drawOffset);
                        context.lineTo(tileX + drawOffset, tileY - TILE_HEIGHT + drawOffset);
                        context.closePath();
                        context.fill();
                    break;
                    default:
                        break;
                }
            }
        }
        var image = new Image();
        image.src = canvas.toDataURL();
        return image;
    };
    
    WorldMap.prototype.bindEvents = function() {
        window.addEventListener('keydown', function(e) {
            if(!this.isMoving) {
                switch(e.which) {
                case 40: // Up
                    break;
                case 38: // Down
                    break;
                }
            }
        }.bind(this), true);

        window.addEventListener('keyup', function(e) {
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
        worldMap = new WorldMap();
        worldMap.bindEvents();

        this.loop();
    }

    Game.prototype.loop = function() {
        window.requestAnimationFrame(this.loop.bind(this));

        worldMap.create();
    }

    // Inits canvas
    var canvas = document.getElementById('glitch');
    canvas.width = 900;
    canvas.height = 800;
    var context = canvas.getContext('2d');
    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;
    var worldMap;
    var game = new Game();
    game.start();
    
}(window, document));