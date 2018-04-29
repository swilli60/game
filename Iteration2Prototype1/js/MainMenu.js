"use strict";

GameStates.makeMainMenu = function( game, shared ) {

	//var music = null;
	//var playButton = null;
	let titleText = null;
	let keys = null;
	let description = ["This game takes place on a colony living on a space station en route to their eventual new home planet that space command has charted out, though that new home is several years of travel away. Two players take on the role of two evil masterminds trying to take over the spaceship by means of infiltrating the government and being elected to leader. These masterminds are sworn nemeses and take any opportunity to best the other, or, given the opportunity, take them out of the picture, permanently.",
	null];
	let descriptionIndex = 0;
    
    

    function startGame(pointer) {

        //music.stop();

        //game.state.start('Game');


    }
    
    return {
    
        create: function () {
    
            game.add.sprite(0, 0, 'menuTexture');
            let startButton = game.add.button(game.world.centerX, game.world.centerY + 225, 'start', startGame, this);
            startButton.anchor.setTo(0.5, 0.5);

            let style = { font: "100px Verdana", fill: "#FFFFFF", align: "center", wordWrap: true, wordWrapWidth: game.world.width };
            titleText = game.add.text(game.world.centerX, game.world.centerY - 180, "Nemeses!", style);
            titleText.anchor.setTo(0.5, 0.5);

            let textBox = game.add.graphics(0, 0);
            textBox.beginFill(0x0000FF);
            textBox.drawRoundedRect(5, 225, 790, 235, 9);
            textBox.endFill();

            style = { font: "25px Verdana", fill: "#FFFFFF", align: "center", wordWrap: true, wordWrapWidth: game.world.width };
            textBox.data = game.add.text(game.world.centerX, game.world.centerY + 25, description[0], style);
            textBox.data.anchor.setTo(0.5, 0.5);

            
            style = { font: "20px Verdana", fill: "#FFFFFF", align: "center", wordWrap: true, wordWrapWidth: game.world.width };
            let instructions = game.add.text(game.world.centerX, 585, "Use left and right arrows to navigate instructions.", style);
            instructions.anchor.setTo(0.5, 0.5);

            //this.showButton(infoButton, infoButtonLocation, 'Information', null);

            keys = game.input.keyboard.addKeys({'help': Phaser.KeyCode.H, 'info': Phaser.KeyCode.SPACEBAR, 'previous': Phaser.KeyCode.LEFT, 'next': Phaser.KeyCode.RIGHT});

            //game.add.group();
            //    //game.add.graphics(0, 0);
            //textBox.beginFill(0x0000FF);
            //textBox.drawRoundedRect(5, 225, 790, 235, 9);
            //textBox.endFill();
    
        },
    
        update: function () {
            if (keys.next.isDown)
            { }
            //	Do some nice funky main menu effect here
    
        },

        nextText: function () {
            let a = null;
        }
        
    };
};
