"use strict";

window.onload = function() {
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".
    
    var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
    function preload() {
        game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
        game.load.image('background', 'assets/background.jpg');
        game.load.audio('door', 'assets/door.mp3');
    }
    
    let player;
    let cursors;
    let searchlight1, searchlight2, searchlight3;
    let searchlights = [searchlight1, searchlight2, searchlight3];
    let door;
    
    function create() {
        game.add.sprite(0, 0, 'background')
        //Creates a sprite for the player character
        player = game.add.sprite(0, game.world.height/2, 'dude');
        door = game.add.audio('door');
        /*
        let random = new Phaser.RandomDataGenerator();
        let circleX = Phaser.RandomDataGenerator.between(0, game.world.width);
        let circleY = Phaser.RandomDataGenerator.between(0, game.world.height);
        */

        searchlight1 = game.add.graphics(game.world.centerX, game.world.centerY);
        searchlight1.beginFill(0xFAFFAF);
        searchlight1.drawCircle(50, 50, 100);
        searchlight1.endFill();

        searchlight2 = game.add.graphics(game.world.centerX + 150, game.world.centerY + 150);
        searchlight2.beginFill(0xFAFFAF);
        searchlight2.drawCircle(50, 50, 100);
        searchlight2.endFill();

        searchlight3 = game.add.graphics(game.world.centerX - 150, game.world.centerY - 150);
        searchlight3.beginFill(0xFAFFAF);
        searchlight3.drawCircle(50, 50, 100);
        searchlight3.endFill();

        // Add some text using a CSS style.
        // Center it in X, and position its top 15 pixels from the top of the world.
        let style = { font: "25px Verdana", fill: "#000000", align: "center", wordWrap: true, wordWrapWidth: game.world.width};
        let text = game.add.text( game.world.centerX, 15, "Use the arrow keys to avoid the searchlights as you make your escape!", style );
        text.anchor.setTo(0.5, 0.0);

        game.physics.startSystem(Phaser.Physics.ARCADE);


        setUpSearchlightPhysics(searchlight1);
        setUpSearchlightPhysics(searchlight2);
        setUpSearchlightPhysics(searchlight3);

        //  This gets the searchlights moving moving
        searchlight1.body.velocity.setTo(100, 100);
        searchlight2.body.velocity.setTo(80, -125);
        searchlight3.body.velocity.setTo(-110, 120);
        

        //This code block contains code borrowed from a Phaser tutorial at https://phaser.io/tutorials/making-your-first-phaser-2-game 
        {
            game.physics.arcade.enable(player);
            player.body.collideWorldBounds = true;
            // Two animations, walking left and right.
            player.animations.add('left', [0, 1, 2, 3], 10, true);
            player.animations.add('right', [5, 6, 7, 8], 10, true);

            //Set up player input
            cursors = game.input.keyboard.createCursorKeys();
        }
    }
    
    function update() {

        //This code block contains code borrowed from a Phaser tutorial at https://phaser.io/tutorials/making-your-first-phaser-2-game 
        //  Reset the players velocity (movement)
        player.body.velocity.x = 0;
        player.body.velocity.y = 0;

        const playerMovementSpeed = 75;

        if (cursors.left.isDown) {
            //  Move to the left
            player.body.velocity.x = -(playerMovementSpeed);

            player.animations.play('left');
        }
        else if (cursors.right.isDown) {
            //  Move to the right
            player.body.velocity.x = playerMovementSpeed;

            player.animations.play('right');
        }
        else {
            //  Stand still
            player.animations.stop();

            player.frame = 4;
        }
        if (cursors.up.isDown) {
            //  Move up
            player.body.velocity.y = -(playerMovementSpeed);

            //player.animations.play('left');
        }
        else if (cursors.down.isDown) {
            //  Move down
            player.body.velocity.y = playerMovementSpeed;

            //player.animations.play('right');
        }
        //This code block contains a modified version of code borrowed from http://phaser.io/examples/v2/arcade-physics/sprite-vs-sprite
        {
            game.physics.arcade.collide([searchlight1, searchlight2, searchlight3], player, collisionHandler, null, this);

        }
        //If player has escaped and won the game
        if (player.body.position.x >= 660)
            playerWin();
    }

    //This code block contains a modified version of code borrowed from http://phaser.io/examples/v2/arcade-physics/sprite-vs-sprite
    function collisionHandler(obj1, obj2) {

        //  The two objects are colliding
        game.stage.backgroundColor = '#992d2d';
        let style = { font: "75px Verdana", fill: "#000000", align: "center" };
        let text = game.add.text(game.world.centerX, game.world.centerY, "CAUGHT!", style);
        text.anchor.setTo(0.5, 0.5);
        door.play();//doesn't get to play because game paused?
        game.paused = true;

    }

    //Called when the player crosses into the river, escaping and ending the game
    function playerWin() {
        game.stage.backgroundColor = '#FFFFFF';
        let style = { font: "75px Verdana", fill: "#000000", align: "center" };
        let text = game.add.text(game.world.centerX, game.world.centerY, "ESCAPE!\nYOU WIN!", style);
        text.anchor.setTo(0.5, 0.5);
        game.paused = true;
    }

    //This code block contains a modified version of code found at http://phaser.io/examples/v2/arcade-physics/bounce
    function setUpSearchlightPhysics(searchlight)
    {
        game.physics.enable(searchlight, Phaser.Physics.ARCADE)

        //  This makes the game world bounce-able
        searchlight.body.collideWorldBounds = true;

        //  This sets the image bounce energy for the horizontal 
        //  and vertical vectors. "1" is 100% energy return
        searchlight.body.bounce.set(1);
    }
};
