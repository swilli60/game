"use strict";

window.onload = function() {
    
    var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
    function preload() {
        game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
        game.load.image('background', 'assets/background.jpg');
        game.load.audio('door', 'assets/door.mp3');
        game.load.audio('alarm', 'assets/Alarm.mp3');
    }
    
    let player;
    let cursors;
    let searchlight1, searchlight2, searchlight3;
    let searchlights = [searchlight1, searchlight2, searchlight3];
    let door;
    let bodies;
    let alarm;
    let gameOver = false;
    const playerMovementSpeed = 75;//speed at which the player character moves, in pixels/second

    function create() {
        game.add.sprite(0, 0, 'background')
        //Creates a sprite for the player character
        player = game.add.sprite(0, game.world.height / 2, 'dude');

        //set up audio
        door = game.add.audio('door');
        alarm = game.add.audio('alarm');
        alarm.loopFull(.5);

        //Group used to control movement of all moving bodies in game.
        bodies = game.add.group();
        bodies.enableBody = true;
        bodies.add(player);
        
        //Create the searchlights that look for the player
        //Probably could do these three searchlights with fewer lines of code if I had the time
        //to rework it making use of groups more extensively and writing a few more functions.
        searchlight1 = game.add.graphics(game.world.centerX, game.world.centerY);
        searchlight1.beginFill(0xFAFFAF);
        searchlight1.drawCircle(50, 50, 100);
        searchlight1.alpha = 0.5;
        searchlight1.endFill();
        bodies.add(searchlight1);

        searchlight2 = game.add.graphics(game.world.centerX + 150, game.world.centerY + 150);
        searchlight2.beginFill(0xFAFFAF);
        searchlight2.drawCircle(50, 50, 100);
        searchlight2.alpha = 0.5;
        searchlight2.endFill();
        bodies.add(searchlight2);

        searchlight3 = game.add.graphics(game.world.centerX - 150, game.world.centerY - 150);
        searchlight3.beginFill(0xFAFFAF);
        searchlight3.drawCircle(50, 50, 100);
        searchlight3.alpha = 0.5;
        searchlight3.endFill();
        bodies.add(searchlight3);

        // Add some text using a CSS style.
        // Center it in X, and position its top 15 pixels from the top of the world.
        let style = { font: "bold 25px Verdana", fill: "#FF0000", align: "center", wordWrap: true, wordWrapWidth: game.world.width};
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
        //gameOver = true;
        //If the game is over, stop allowing the player to move and play
        if (gameOver === true) {
            //  Stand still
            player.animations.stop();
            player.frame = 4;
        }
        else {
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
            }
            else if (cursors.down.isDown) {
                //  Move down
                player.body.velocity.y = playerMovementSpeed;
            }

            //Determines if player has won the game
            if (player.body.position.x >= 660) {
                gameOver = true;
                playerWon();
            }

            if (gameOver === false) {
                //This line of code contains a modified version of some code borrowed from http://phaser.io/examples/v2/arcade-physics/sprite-vs-
                gameOver = game.physics.arcade.collide([searchlight1, searchlight2, searchlight3], player, playerLost, null, this);
            }
        }

    }

    //called when the player loses the game
    //This code block contains a modified version of code borrowed from http://phaser.io/examples/v2/arcade-physics/sprite-vs-sprite
    function playerLost(obj1, obj2) {

        //  The two objects are colliding
        game.stage.backgroundColor = '#992d2d';
        let style = { font: "75px Verdana", fill: "#000000", align: "center" };
        let text = game.add.text(game.world.centerX, game.world.centerY, "CAUGHT!", style);
        text.anchor.setTo(0.5, 0.5);
        alarm.stop();
        door.play('', 0, .2);
        bodies.forEach(setVelToZero, this);

    }

    //Function to take a body and set its velocity to zero
    function setVelToZero(obj) {
        obj.body.velocity.setTo(0, 0);
    }

    //Called when the player crosses into the river, escaping and ending the game
    function playerWon() {
        game.stage.backgroundColor = '#FFFFFF';
        let style = { font: "75px Verdana", fill: "#000000", align: "center" };
        let text = game.add.text(game.world.centerX, game.world.centerY, "ESCAPE!\nYOU WIN!", style);
        text.anchor.setTo(0.5, 0.5);
        alarm.stop();
        bodies.forEach(setVelToZero, this);
    }

    //This code block contains a modified version of code found at http://phaser.io/examples/v2/arcade-physics/bounce
    function setUpSearchlightPhysics(searchlight)
    {
        //turns on the physics for the searchlight
        game.physics.enable(searchlight, Phaser.Physics.ARCADE)

        //  This makes the game world bounce-able
        searchlight.body.collideWorldBounds = true;

        //  This sets the image bounce energy for the horizontal 
        //  and vertical vectors. "1" is 100% energy return
        searchlight.body.bounce.set(1);
    }
};
