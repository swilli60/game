"use strict";

BasicGame.Game = function (game) {
    this.LINE_WIDTH = 25;

    this.ding = null;

    this.turnCounter = 1;

    this.p1Color = 0x00FF00;//green
    this.p1Score = 0;

    this.p2Color = 0xFF0000;//red
    this.p2Score = 0;

    this.color = this.p1Color;

    this.sprite = null;
    this.mask = null;


    this.maskedObjects = null;
    this.circles = null;
    this.line = null;

    this.leftIntersection = false;
    this.rightIntersection = false;
    this.allCirclesFound = false;
    

    //Each even entry is a circle point value, and the following odd number is the corresponding diameter.
    this.circleInfo = [5, 25, 3, 50, 2, 75, 1, 100];

    //array for holding Phaser.Circle objects that have been assigned a location on the game board.
    this.circleGeometries = [];

    this.startPoint = null; //Phaser.Point object indicating the start of a line.
    this.isDrawing = false; //indicates if the player has clicked to indicate the location of the first point on a line
    this.initDrawX = null; //the x-coordinate of the starting point from which a line will be drawn on the mask layer
    this.initDrawY = null; //the y-coordinate of the starting point from which a line will be drawn on the mask layer
    this.endDrawX = null; //the x-coordinate of the terminal point to which a line will be drawn on the mask layer
    this.endDrawY = null; //the y-coordinate of the termianl point to which a line will be drawn on the mask layer
    //the line segment represented by the above coordinates will be extended to the ends of the game world.

    this.circle = null;
    this.circle1 = null;

    this.style = null;
    this.text = null;
    
    this.intersects = null;

    //Indicates the player's selection of two points and the tentative line that
    //would be formed between them on screen.
    this.tracingCircleStationary = null;
    this.tracingCircleMobile = null;
    this.tracingLine = null;

    //Group for the above three Phaser.Graphics objects.
    this.tracingGraphics = null;
   
	this.gameOverMessageShown = false;
};

BasicGame.Game.prototype = {

    
    create: function () {
        this.ding = this.game.add.audio('ding');

        this.mask = this.game.add.graphics(0, 0);

        //creates the background
        this.sprite = this.add.sprite(0, 0, 'menuTexture');

        //Group for objects which will be behind the mask
        this.maskedObjects = this.game.add.group();
        
        //Group for circle Graphics objects
        this.circles = this.game.add.group();

        //group for objects that need to be masked
        this.maskedObjects.add(this.sprite);
        this.circle = this.game.add.graphics(0, 0);
        this.circle.beginFill(0xFFFFFF);
		
        let j = 0;
        let points = 0;
        let diameter = 0;
        for(j = 0; j < this.circleInfo.length; j++){
            points = this.circleInfo[j];
            diameter = this.circleInfo[++j];
            new this.Circle(points, diameter, this.circleGeometries, this.game);
        }

        for(j = 0; j < this.circleGeometries.length; j++){
            this.circle.drawCircle(this.circleGeometries[j].circle.x, this.circleGeometries[j].circle.y, this.circleGeometries[j].circle.diameter);
        }
                
        this.circle.endFill();
		
        this.circles.add(this.circle);
        this.maskedObjects.add(this.circles);

            //	Shapes drawn to the Graphics object must be filled.
        this.mask.beginFill(0xFFFFFF);

            //	Here we'll draw a dummy circle of zero size so the mask will be active and cover the game board
        this.mask.drawCircle(100, 100, 0);

            //	And apply it to the Sprite
        this.maskedObjects.mask = this.mask;

        this.game.input.addMoveCallback(this.move, this);

        this.mask.lineStyle(this.LINE_WIDTH, this.color, 0.5);

        this.line = new this.Lines(this.game, this.LINE_WIDTH);
        this.line.set(0, 0, 0, 0);
    },

    update: function () {
        
    },

    render: function () {
        this.game.debug.text("Player 1 Score ", 100, 550);
        this.game.debug.text(this.p1Score, 250, 550);
        this.game.debug.text("Player 2 Score ", 550, 550);
        this.game.debug.text(this.p2Score, 700, 550);
    },

    Circle: function (points, diameter, circles, game) {
        this.points = points;
        //this.diameter = diameter;
        this.circle = null;
        this.found = false;
        let randX = null;
        let randY = null;
        let intersects = false;
        do{//find a random circle that does not intersect with others
            intersects = false;
            randX = Phaser.Math.random(0, game.width);
            randY = Phaser.Math.random(0, game.height);
            this.circle = new Phaser.Circle(randX, randY, diameter);
            for (let i = 0; i < circles.length; i++){
                intersects = (intersects || Phaser.Circle.intersects(this.circle, circles[i].circle));
            }
        }
        while(intersects);
        circles.push(this);
        //circles.push(circle);
    },

    Lines: function (game, width) {
        this.lineCenter = null;
        this.lineRight = null;
        this.lineLeft = null;
        this.LINE_WIDTH = width;
        this.game = game;

        //beginning and endpoints of the line that will be generated
        this.begin = null;
        this.end = null;

        //Max length that a line drawn from any point will need to be to completely traverse the screen.
        let maxLength = Phaser.Math.hypot(this.game.height, this.game.width);

        //Calculates the path of a line between two points and returns a Phaser.Line object along that path extending at least to the edges of the world.
        this.calculateLine = function (x1, y1, x2, y2) {
            let initialLine = new Phaser.Line(x1, y1, x2, y2);

            //Create a line in the opposite direction
            let oppAngle = initialLine.angle;
            oppAngle += Phaser.Math.PI2 / 2;
            let oppLine = new Phaser.Line();
            oppLine.fromAngle(x1, y1, oppAngle, maxLength);

            //starting points of the final line that will be returned
            let x = oppLine.end.x;
            let y = oppLine.end.y;

            //create the desired line.
            let finalLine = new Phaser.Line();
            return finalLine.fromAngle(x, y, initialLine.angle, 2 * maxLength);
        };
        
        //Draws this line object (Phaser.Line) to graphicsObj (Phaser.Graphics)
        this.draw = function(graphicsObj){
            graphicsObj.moveTo(this.lineCenter.start.x, this.lineCenter.start.y);
            graphicsObj.lineTo(this.lineCenter.end.x, this.lineCenter.end.y);
        };

        //used to set the user-selected points which form the basis of the line
        //and begin the process of generating a line which can be used for detecting
        //intersection with circles.
        this.set = function (x1, y1, x2, y2) {
            this.lineCenter = this.calculateLine(x1, y1, x2, y2);
            this.begin = new Phaser.Point(this.lineCenter.start);
            this.end = new Phaser.Point(this.lineCenter.end);
            this.parallel(x1, y1);
        };

        //forms the parallel lines beside the original to be used for intersection detection.
        this.parallel = function (x, y) {
            let rightPerp = new Phaser.Line();
            rightPerp.fromAngle(this.lineCenter.start.x, this.lineCenter.start.y, this.lineCenter.angle + Phaser.Math.HALF_PI, this.LINE_WIDTH / 2);
            let parallelBegin = rightPerp.end;
            this.lineRight = new Phaser.Line();
            this.lineRight.fromAngle(parallelBegin.x, parallelBegin.y, this.lineCenter.angle, maxLength * 2);

            let leftPerp = new Phaser.Line();
            leftPerp.fromAngle(this.lineCenter.start.x, this.lineCenter.start.y, this.lineCenter.angle - Phaser.Math.HALF_PI, this.LINE_WIDTH / 2);
            parallelBegin = leftPerp.end;
            this.lineLeft = new Phaser.Line();
            this.lineLeft.fromAngle(parallelBegin.x, parallelBegin.y, this.lineCenter.angle, maxLength * 2);
        };
    },

    move: function (pointer, x, y, wasMouseClicked) {
        if (wasMouseClicked) {
            if (this.allCirclesFound) {
				this.quitGame();
			}
            if (this.isDrawing === true) {
                this.leftIntersection = Phaser.Circle.intersectsLine(this.circleGeometries[3].circle, this.line.lineLeft);
                this.rightIntersection = Phaser.Circle.intersectsLine(this.circleGeometries[3].circle, this.line.lineRight);
                this.line.set(this.initDrawX, this.initDrawY, x, y);
                this.line.draw(this.mask);
                this.tracingGraphics.destroy();
                this.isDrawing = false;//finished drawing a line for this turn.
                
                
                let i = 0;
                this.allCirclesFound = true;

                for(i = 0; i < this.circleGeometries.length; i++){
                    if (Phaser.Circle.intersectsLine(this.circleGeometries[i].circle, this.line.lineLeft) ||
                        Phaser.Circle.intersectsLine(this.circleGeometries[i].circle, this.line.lineRight)) {
                        if ((this.circleGeometries[i]).found === false) {
                            (this.circleGeometries[i]).found = true;
                            this.ding.play();
                            if (this.turnCounter % 2 === 1)
                                this.p1Score += this.circleGeometries[i].points;
                            else
                                this.p2Score += this.circleGeometries[i].points;
                        }
                    }
                    //if any circles have their found flag set to false, allCirclesFound will become false and the game will continue
                    this.allCirclesFound = this.allCirclesFound && this.circleGeometries[i].found;
                }
                this.turnCounter++;
                if (this.turnCounter % 2 === 1)//Now it's other player's turn.
                    this.color = this.p1Color;
                else
                    this.color = this.p2Color;
            }
            else {
                this.initDrawX = x;
                this.initDrawY = y;
                this.isDrawing = true;

                //This group houses Phaser.Graphics objects used to show the player where their tentative line
                //will fall before committing.
                this.tracingGraphics = this.game.add.group();

                //Shows where the player clicked to begin drawing from
                this.tracingCircleStationary = this.game.add.graphics(0, 0);
                this.tracingCircleStationary.beginFill(this.color);
                this.tracingCircleStationary.drawCircle(x, y, this.LINE_WIDTH);
                this.tracingCircleStationary.endFill();
                this.tracingGraphics.add(this.tracingCircleStationary);

                //Shows where the second point will go to form a line if the player clicks the mouse
                this.tracingCircleMobile = this.game.add.graphics(x, y);
                this.tracingCircleMobile.beginFill(this.color);
                this.tracingCircleMobile.drawCircle(0, 0, this.LINE_WIDTH);
                this.tracingCircleMobile.endFill();
                this.tracingGraphics.add(this.tracingCircleMobile);

                this.tracingGraphics.alpha = 0.5;
            }
        }
        else if (this.isDrawing === true) {
            //These lines (Phaser.Line objects) are used for intersection detection with Phaser.Circle objects and determining
            //where to draw the appropriate Phaser.Graphics lines in the mask layer.
            this.line.set(this.initDrawX, this.initDrawY, x, y);

            //Traces out the tentative line that would be formed by the two points currently indicated
            //by the player.
            if(this.tracingLine != null)
                this.tracingLine.destroy();
            this.tracingLine = this.game.add.graphics(0, 0);
            this.tracingGraphics.add(this.tracingLine);

            //Moves the mobile tracing circle and the tracing line to follow the mouse cursor
            this.tracingCircleMobile.x = x;
            this.tracingCircleMobile.y = y;
            this.tracingLine.lineStyle(this.LINE_WIDTH, this.color, 0.5);
            this.line.draw(this.tracingLine);
        }
        if (this.allCirclesFound && !this.gameOverMessageShown) {
            if (this.p1Score > this.p2Score) {
                this.style = { font: "75px Verdana", fill: "#FFFF", align: "center", wordWrap: true, wordWrapWidth: this.game.world.width };
                this.text = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 100, "Player 1 wins!", this.style);
                this.text.anchor.setTo(0.5, 0.5);
            }
            else {
                this.style = { font: "75px Verdana", fill: "#FFFF", align: "center", wordWrap: true, wordWrapWidth: this.game.world.width };
                this.text = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 100, "Player 2 wins!", this.style);
                this.text.anchor.setTo(0.5, 0.5);
            }
            this.style = { font: "75px Verdana", fill: "#FFFF", align: "center", wordWrap: true, wordWrapWidth: this.game.world.width };
            this.text = this.game.add.text(this.game.world.centerX, this.game.world.centerY, "Click to play again.", this.style);
            this.text.anchor.setTo(0.5, 0.5);
			this.gameOverMessageShown = true;
        }
    },

    quitGame: function () {
        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
		this.p1Score = 0;
		this.p2Score = 0;
		this.gameOverMessageShown = false;
		this.allCirclesFound = false;
		//this.circles.destroy() should go here, but doesn't seem to do anything within quitGame()
        this.state.start('MainMenu');
    }
};
