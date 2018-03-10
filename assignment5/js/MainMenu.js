"use strict";

BasicGame.MainMenu = function (game) {

	this.music = null;
	this.startButton = null;

};

BasicGame.MainMenu.prototype = {

    create: function () {
		this.music = this.add.audio('music', 1, true);
		this.music.play();

		this.add.sprite(0, 0, 'ocean');
		this.startButton = this.add.button( 303, 400, 'start', this.startGame, this);

		this.style = { font: "100px Verdana", fill: "#000000", align: "center", wordWrap: true, wordWrapWidth: this.game.world.width };
		this.text = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 100, "Pirates!", this.style);
		this.text.anchor.setTo(0.5, 0.0);
	},

	update: function () {
		//	Do some nice funky main menu effect here
	},

	startGame: function (pointer) {
		//	And start the actual game
		this.state.start('Game');

	}

};
