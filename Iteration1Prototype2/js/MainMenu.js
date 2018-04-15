"use strict";

BasicGame.MainMenu = function (game) {

	this.music = null;
	this.startButton = null;

};

BasicGame.MainMenu.prototype = {

    create: function () {
		//this.music = this.add.audio('music', 1, true);
		//this.music.play();

		this.add.sprite(0, 0, 'menuTexture');
		this.startButton = this.add.button(this.game.world.centerX, this.game.world.centerY + 225, 'start', this.startGame, this);
		this.startButton.anchor.setTo(0.5, 0.5);

		this.style = { font: "100px Verdana", fill: "#000000", align: "center", wordWrap: true, wordWrapWidth: this.game.world.width };
		this.text = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 180, "Find the Circles!", this.style);
		this.text.anchor.setTo(0.5, 0.5);

		this.textBox = this.game.add.graphics(0, 0);
		this.textBox.beginFill(0x0000FF);
		this.textBox.drawRoundedRect(5, 225, 790, 235, 9);
		this.textBox.endFill();

		this.style = { font: "25px Verdana", fill: "#FFFFFF", align: "center", wordWrap: true, wordWrapWidth: this.game.world.width };
		this.text = this.game.add.text(this.game.world.centerX, this.game.world.centerY + 25, "Use the mouse to select two points that will form the basis for a line that will reveal part of the game board. The smaller and harder to find circles are worth more points! There are four circles. The player with the most points once all circles have been found wins!", this.style);
		this.text.anchor.setTo(0.5, 0.5);
	},

	update: function () {
		//	Do some nice funky main menu effect here
	},

	startGame: function (pointer) {
		//	And start the actual game
		this.state.start('Game');

	}

};
