"use strict";

GameStates.makeGame = function( game, shared ) {
    // Create your own variables.
    var bouncy = null;
    
    function quitGame() {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        game.state.start('MainMenu');

    }
    
    return {
    
        create: function () {
    
            //game.state.start('MainMenu');
        },
    
        update: function () {
    
           
        }
    };
};
