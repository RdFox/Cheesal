Cheesal.Level1 = function (game) {
    this.game = game;
};

Cheesal.Level1.prototype = {

    create: function () {
        this.gameover = false;
        //  We're going to be using physics, so enable the Arcade Physics system
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        //  A simple background for our game
        this.game.stage.backgroundColor = "#FFF";

        this.platforms = this.game.add.group();
        this.platforms.enableBody = true;

        this.ground = this.platforms.create(0, this.game.world.height - 50, 'ground');
        this.ground.scale.setTo(1, 0.5);
        this.ground.body.immovable = true;


        this.topledge = this.platforms.create(0, 150, 'ground');
        this.topledge.scale.setTo(0.3, 0.3);
        this.topledge.body.immovable = true;

        this.bottomledge = this.platforms.create(500, 360, 'ground');
        this.bottomledge.scale.setTo(0.2, 0.3);
        this.bottomledge.body.immovable = true;


        this.player = this.game.add.sprite(32, this.game.world.height - 150, 'mouse');
        this.player.scale.setTo(0.2, 0.2);
        this.game.physics.arcade.enable(this.player);

        this.player.body.bounce.y = 0.2;
        this.player.body.gravity.y = 200;
        this.player.body.collideWorldBounds = true;

        //  Our two animations, walking left and right.
        this.player.animations.add('left', [0, 1, 2], 10, true);
        this.player.animations.add('right', [3, 4, 5], 10, true);

        this.things = [];
        if(this.game.withBox){
            this.createNewThing(this.player.x - 100,this.player.y);
        }
        this.createNewThing(150,0);

        this.trap = this.game.add.sprite(575, 480, 'trap');
        this.trap.scale.setTo(1, 1);
        this.game.physics.enable(this.trap, Phaser.Physics.ARCADE);
        this.trap.body.immovable = true;
        this.trap.body.checkCollision.right = false;
        this.trap.body.checkCollision.left = false;
        this.trap.body.checkCollision.down = false;


        this.cursors = this.game.input.keyboard.createCursorKeys();

    },


    update: function () {
        if (this.gameover) {
            var state = this.state;
            this.game.input.keyboard.onDownCallback = function (e) {
                state.start('Menu');
            };
            return;
        }
        //  Collide the player and the stars with the platforms
        this.game.physics.arcade.collide(this.player, this.platforms);

        var game = this.game;
        var player = this.player;
        var platforms = this.platforms;
        var things = this.things;
        var trap = this.trap;
        var gameover = false;
        this.things.forEach(function (thing) {
            game.physics.arcade.collide(player, thing);
            game.physics.arcade.collide(thing, platforms);

            game.physics.arcade.collide(thing, trap, function () {
                var style = {font: "bold 72px Raleway", fill: "#000", boundsAlignH: "center", boundsAlignV: "middle"};
                game.add.text(50, 200, "The Cheese is yours.\nYou won the Level!", style);
                gameover = true;
            });

            var master = thing;
            things.forEach(function (thing) {
                game.physics.arcade.collide(master, thing);
            });
            if (thing.body.velocity.x > 0) {
                thing.body.velocity.x -= 2;
            }
            if (thing.body.velocity.x < 0) {
                thing.body.velocity.x += 2;
            }

            if ((thing.x - player.x < 150) && (thing.x - player.x > -80) &&
                (thing.y - player.y < 5) && (thing.y - player.y > -14) &&
                (game.input.keyboard.addKey(Phaser.Keyboard.E).isDown)) {
                thing.body.velocity.copyFrom(player.body.velocity);
            }
        });

        this.game.physics.arcade.collide(this.player, this.trap, function () {
            var style = {font: "bold 72px Raleway", fill: "#000", boundsAlignH: "center", boundsAlignV: "middle"};
            game.add.text(100, 200, "You died.\nYou lost the Level!", style);
            gameover = true;
        });

        this.gameover = gameover;
        if (gameover) return;
        //  Reset the players velocity (movement)
        this.player.body.velocity.x = 0;

        /**
         if(this.hold.isDown){
            things.forEach(function(thing){
                console.log(player.x + ":" + player.y + " - " + thing.x + ":" + thing.y);
                var i = player.x - thing.x;
                var j = player.y -  thing.y
                console.log(i+ ":" + j);
                if(-40 < player.x - thing.x && player.x - thing.x < 60 && -5 < player.y - thing.y && player.y - thing.y < 5){

                    thing.body.velocity.x = player.body.velocity.x;
                    thing.body.velocity.y = player.body.velocity.y;
                }
            })
        }
         **/
        if (this.cursors.left.isDown) {
            this.player.body.velocity.x = -150;
            this.player.animations.play('left');
        }
        else if (this.cursors.right.isDown) {
            this.player.body.velocity.x = 150;
            this.player.animations.play('right');
        }
        else {
            this.player.animations.stop();
        }
        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.body.velocity.y = -350;
        }

        if (this.lastThing.y > 284) {
            this.createNewThing(150, 0);
        }
    },

    createNewThing: function (x, y) {
        var thing = this.game.add.sprite(x, y, 'box');
        thing.scale.setTo(0.2, 0.25);

        this.game.physics.arcade.enable(thing);

        thing.body.bounce.y = 0.2;
        thing.body.gravity.y = 300;
        thing.body.collideWorldBounds = true;
        this.things.push(thing);
        this.lastThing = thing;
    },

};
