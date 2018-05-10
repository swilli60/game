"use strict";

GameStates.makeMainMenu = function( game, shared ) {

    var music = null;
	//var playButton = null;
	let titleText = null;
	let keys = null;
	let description = null;
	let story = ["This game takes place on a colony living on a space station en route to their eventual new home planet that space command has charted out, though that new home is several years of travel away. Two players take on the role of two evil masterminds trying to take over the spaceship by means of infiltrating the government and being elected to leader. (1/4)",
        "These masterminds are sworn nemeses and take any opportunity to best the other, or, given the opportunity, take them out of the picture, permanently.(2/4)",
	    "There has been an emergency on-board the colony. During an attack, space pirates blasted a hole in the hull of the colony. Most colonists had evacuated to the inner part of the ship, but a few stragglers were in the section of ship exposed by the blast from the pirates. (3/4)",
        "They are without space suits and must be rescued quickly, before they suffocate and die, but more importantly, before your nemesis does the same and takes credit for it! Become the \“hero\” of the colony, winning the hearts and minds of those who can elect you into power! (4/4)"];
	let controls = ["List controls here.", "Test"];
	let instructions = ["Show instructions here.", "Test"];
	let descriptionIndex = 0;
	let textBox = null;
	let titleSubText = null;
	let subText = null;
    
    

    function startGame(pointer) {

        //music.stop();

        //game.state.start('Game');


    }
    
    return {
    
        create: function () {

            music = game.add.audio('menuTheme');
            music.loopFull();
    
            game.add.sprite(0, 0, 'menuTexture');
            let startButton = game.add.button(game.world.centerX, game.world.centerY + 225, 'start', startGame, this);
            startButton.anchor.setTo(0.5, 0.5);

            let style = { font: "90px Verdana", fill: "#FFFFFF", align: "center", wordWrap: true, wordWrapWidth: game.world.width };
            titleText = game.add.text(game.world.centerX, game.world.centerY - 240, "Nemeses!", style);
            titleText.anchor.setTo(0.5, 0.5);

            subText = "The Story";
            style = { font: "50px Verdana", fill: "#FFFFFF", align: "center", wordWrap: true, wordWrapWidth: game.world.width };
            titleSubText = game.add.text(game.world.centerX, game.world.centerY - 130, subText, style);
            titleSubText.anchor.setTo(0.5, 0.5);

            textBox = game.add.graphics(0, 0);
            textBox.beginFill(0x0000FF);
            textBox.drawRoundedRect(5, 225, 790, 235, 9);
            textBox.endFill();

            description = story;

            style = { font: "25px Verdana", fill: "#FFFFFF", align: "center", wordWrap: true, wordWrapWidth: game.world.width };
            textBox.data = game.add.text(game.world.centerX, game.world.centerY + 35, description[0], style);
            textBox.data.anchor.setTo(0.5, 0.5);

            
            
            style = { font: "20px Verdana", fill: "#FFFFFF", align: "center", wordWrap: true, wordWrapWidth: game.world.width };
            let menuInstructions1 = game.add.text(game.world.centerX, 585, "Use left and right arrows to navigate menu text.", style);
            menuInstructions1.anchor.setTo(0.5, 0.5);
            style = { font: "20px Verdana", fill: "#FFFFFF", align: "left", wordWrap: true, wordWrapWidth: game.world.width };
            let menuInstructions2 = game.add.text(5, 460, "Instructions: Press I\nBackground Story: Press S\nControls: Press C", style);

            keys = game.input.keyboard.addKeys({'controls': Phaser.KeyCode.C, 'story': Phaser.KeyCode.S, 'instructions': Phaser.KeyCode.I, 'prev': Phaser.KeyCode.LEFT, 'next': Phaser.KeyCode.RIGHT});
            description = story;
        },
    
        update: function () {
            if (keys.controls.justDown) {
                //tell player the controls
                description = controls;
                subText = "Controls";
                textBox.data.text = description[0];
                descriptionIndex = 0;
            }
            if (keys.story.justDown) {
                //tell player the background story
                description = story;
                textBox.data.text = description[0];
                descriptionIndex = 0;
            }
            if (keys.instructions.justDown) {
                //tell player how to play
                description = instructions;
                textBox.data.text = description[0];
                descriptionIndex = 0;
            }
            if(keys.next.justDown)
                this.nextText();
            if (keys.prev.justDown)
                this.prevText();
            
    
        },

        nextText: function () {
            if(descriptionIndex < description.length - 1)
                textBox.data.text = description[++descriptionIndex];
        },

        prevText: function () {
            if (descriptionIndex > 0)
                textBox.data.text = description[--descriptionIndex];
        }
        
    };
};
