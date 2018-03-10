"use strict";

BasicGame.Game = function (game) {
    this.player = null;
    this.merchant = null;
    this.maxPlayerVelocity = new Phaser.Point(150, 150);
    this.playerDrag = new Phaser.Point(10, 10);
    this.maxAngularVelocity = 50;
};

BasicGame.Game.prototype = {

    create: function () {        
        //creates the background
        this.add.sprite(0, 0, 'ocean');

        //sets up the player sprite and the corresponding physics
        this.player = this.game.add.sprite(this.game.world.centerX * .25, this.game.world.centerY * .25, 'pirate');
        this.player.anchor.setTo(0.5, 0.5);
        this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.player.body.collideWorldBounds = true;
        this.player.body.maxVelocity = this.maxPlayerVelocity;
        this.player.body.drag = this.playerDrag;

        //sets up the merchant ship that the player is hoping to plunder
        this.merchant = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'merchant');
        this.merchant.anchor.setTo(0.5, 0.5);
        this.game.physics.enable(this.merchant, Phaser.Physics.ARCADE);
        this.merchant.body.collideWorldBounds = true;
        this.merchant.body.immovable = true;
        this.merchant.body.setSize(125, 45, 23, 5);
    },

    update: function () {

        //borrowed from the "Angular Velocity" example from http://phaser.io/examples/v2/arcade-physics/angular-velocity        
        this.player.body.angularVelocity = 0;

        if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            this.player.body.angularVelocity = -(this.maxAngularVelocity);
        }
        else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            this.player.body.angularVelocity = this.maxAngularVelocity;
        }

        //accelerates the player's ship forward when they press up on the keyboard
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
            this.game.physics.arcade.accelerationFromRotation(this.player.rotation, 25, this.player.body.acceleration);
        }
        else {
            this.game.physics.arcade.accelerationFromRotation(this.player.rotation, 0, this.player.body.acceleration);
        }

        this.game.physics.arcade.collide(this.player, this.merchant);

        //ensures the path of the player's ship is in front of the ship as it turns
            this.game.physics.arcade.velocityFromAngle(this.player.angle, this.player.body.speed, this.player.body.velocity);
    },
    
    quitGame: function () {
        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        this.state.start('MainMenu');
    }
};
