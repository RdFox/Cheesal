Cheesal.Level3 = function (game) {
    this.game = game;
};

Cheesal.Level3.prototype = {

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


        this.topledge = this.platforms.create(0, 300, 'ground');
        this.topledge.scale.setTo(0.7, 0.3);
        this.topledge.body.immovable = true;

        this.hole = this.game.add.sprite(50, 175, 'hole');
        this.game.physics.enable(this.hole, Phaser.Physics.ARCADE);
        this.hole.scale.setTo(0.4, 0.4);
        this.hole.body.immovable = true;

        this.player = this.game.add.sprite(50, 170 , 'mouse');
        this.player.scale.setTo(0.2, 0.2);
        this.game.physics.arcade.enable(this.player);
        this.player.body.bounce.y = 0.2;
        this.player.body.gravity.y = 200;
        this.player.body.collideWorldBounds = true;
        this.player.animations.add('left', [0, 1, 2], 10, true);
        this.player.animations.add('right', [3, 4, 5], 10, true);

        if(this.game.withBox){
            this.box = this.game.add.sprite(170, 170, 'box');
            this.box.scale.setTo(0.2, 0.25);
            this.game.physics.arcade.enable(this.box);
            this.box.body.bounce.y = 0.2;
            this.box.body.gravity.y = 300;
            this.box.body.collideWorldBounds = true;
        }

        this.trap = this.game.add.sprite(575, 480, 'trap');
        this.trap.scale.setTo(1, 1);
        this.game.physics.enable(this.trap, Phaser.Physics.ARCADE);
        this.trap.body.immovable = true;
        this.trap.body.checkCollision.right = false;
        this.trap.body.checkCollision.left = false;
        this.trap.body.checkCollision.down = false;


        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    },


    update: function () {
        if (this.gameover) {
            var state = this.state;
            this.game.input.keyboard.onDownCallback = function (e) {
                state.start('Menu');
            };
            return;
        }
        this.game.physics.arcade.collide(this.player, this.platforms);
        var game = this.game;
        var gameover = this.gameover;
        this.game.physics.arcade.collide(this.player, this.trap, function () {
            var style = {font: "bold 72px Raleway", fill: "#000", boundsAlignH: "center", boundsAlignV: "middle"};
            game.add.text(100, 30, "You died.\nYou lost the Level!", style);
            gameover = true;
        });

        this.gameover = gameover;
        if (gameover) return;
        //  Reset the players velocity (movement)
        this.player.body.velocity.x = 0;

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
        if(this.spaceKey.isDown && this.checkOverlap(this.player, this.hole)){
            this.state.start('Menu');
        }
        if(this.game.withBox) {
            this.boxcontrol();
        }
    },

    boxcontrol: function (){
        this.game.physics.arcade.collide(this.player, this.box);
        this.game.physics.arcade.collide(this.box, this.platforms);

        if (this.box.body.velocity.x > 0) {
            this.box.body.velocity.x -= 2;
        }
        if (this.box.body.velocity.x < 0) {
            this.box.body.velocity.x += 2;
        }

        if ((this.box.x - this.player.x < 150) && (this.box.x - this.player.x > -80) &&
            (this.box.y - this.player.y < 5) && (this.box.y - this.player.y > -14) &&
            (this.game.input.keyboard.addKey(Phaser.Keyboard.E).isDown)) {
            this.box.body.velocity.copyFrom(this.player.body.velocity);
        }
        
        var game = this.game;
        var gameover = this.gameover;
        game.physics.arcade.collide(this.box, this.trap, function () {
            var style = {font: "bold 72px Raleway", fill: "#000", boundsAlignH: "center", boundsAlignV: "middle"};
            game.add.text(50, 30, "The Cheese is yours.\nYou won the Level!", style);
            gameover = true;
        });
        this.gameover = gameover;
    },

    checkOverlap: function (spriteA, spriteB) {

        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();

        return Phaser.Rectangle.intersects(boundsA, boundsB);

    }
};
