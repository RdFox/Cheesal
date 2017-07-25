

Cheesal.Level2 = function (game) {
    this.game = game;
};

Cheesal.Level2.prototype = {

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
        
        this.leftledge = this.platforms.create(0, 150, 'ground');
        this.leftledge.scale.setTo(0.25, 0.3);
        this.leftledge.body.immovable = true;

        this.rightledge = this.platforms.create(400, 150, 'ground');
        this.rightledge.scale.setTo(0.4, 0.3);
        this.rightledge.body.immovable = true;

        this.tophole = this.game.add.sprite(420, 25, 'hole');
        this.game.physics.enable(this.tophole, Phaser.Physics.ARCADE);
        this.tophole.scale.setTo(0.4, 0.4);
        this.tophole.body.immovable = true;

        this.bottomhole = this.game.add.sprite(200, 425, 'hole');
        this.game.physics.enable(this.bottomhole, Phaser.Physics.ARCADE);
        this.bottomhole.scale.setTo(0.4, 0.4);
        this.bottomhole.body.immovable = true;

        this.player = this.game.add.sprite(32, this.game.world.height - 150, 'mouse');
        this.player.scale.setTo(0.2, 0.2);
        this.game.physics.arcade.enable(this.player);

        this.player.body.bounce.y = 0.2;
        this.player.body.gravity.y = 200;
        this.player.body.collideWorldBounds = true;

        //  Our two animations, walking left and right.
        this.player.animations.add('left', [0, 1, 2], 10, true);
        this.player.animations.add('right', [3, 4, 5], 10, true);

        this.trap = this.game.add.sprite(575, 480, 'trap');
        this.trap.scale.setTo(1, 1);
        this.game.physics.enable(this.trap, Phaser.Physics.ARCADE);
        this.trap.body.immovable = true;
        this.trap.body.checkCollision.right = false;
        this.trap.body.checkCollision.left = false;
        this.trap.body.checkCollision.down = false;
        
        this.box = this.game.add.sprite(20, 0, 'box');
        this.box.scale.setTo(0.2, 0.25);
        this.game.physics.arcade.enable(this.box);
        this.box.body.bounce.y = 0.2;
        this.box.body.gravity.y = 300;
        this.box.body.collideWorldBounds = true;

        if(this.game.withBox){
            this.extrabox = this.game.add.sprite(150, this.game.world.height - 150, 'box');
            this.extrabox.scale.setTo(0.2, 0.25);
            this.game.physics.arcade.enable(this.extrabox);
            this.extrabox.body.bounce.y = 0.2;
            this.extrabox.body.gravity.y = 300;
            this.extrabox.body.collideWorldBounds = true;
        }


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
        //  Collide the player and the stars with the platforms
        this.game.physics.arcade.collide(this.player, this.platforms);

        var game = this.game;
        var gameover = false;
        this.game.physics.arcade.collide(this.player, this.trap, function () {
            var style = {font: "bold 72px Raleway", fill: "#000", boundsAlignH: "center", boundsAlignV: "middle"};
            game.add.text(100, 250, "You died.\nYou lost the Level!", style);
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
        if (this.checkOverlap(this.player, this.bottomhole) && (this.spaceKey.isDown)) {
            this.player.x = this.tophole.x;
            this.player.y = this.tophole.y +50;
            if(this.checkOverlap(this.box, this.bottomhole)){
                this.box.x = this.tophole.x +150;
                this.box.y = this.tophole.y +50;
            }
            if(this.game.withBox && this.checkOverlap(this.extrabox, this.bottomhole)){
                this.extrabox.x = this.tophole.x +150;
                this.extrabox.y = this.tophole.y +50;
            }
        }
        if (this.checkOverlap(this.player, this.tophole) && (this.spaceKey.isDown)) {
            this.player.x = this.bottomhole.x;
            this.player.y = this.bottomhole.y +50;
            if(this.checkOverlap(this.box, this.tophole)){
                this.box.x = this.bottomhole.x +150;
                this.box.y = this.bottomhole.y +50;
            }
            if(this.game.withBox && this.checkOverlap(this.extrabox, this.tophole)){
                this.extrabox.x = this.bottomhole.x +150;
                this.extrabox.y = this.bottomhole.y +50;
            }
        }
        this.boxcontrol(this.box);
        if(this.game.withBox){
            this.boxcontrol(this.extrabox);
        }

    },

    boxcontrol: function (box){
        this.game.physics.arcade.collide(this.player, box);
        this.game.physics.arcade.collide(box, this.platforms);

        if (box.body.velocity.x > 0) {
            box.body.velocity.x -= 2;
        }
        if (box.body.velocity.x < 0) {
            box.body.velocity.x += 2;
        }

        if ((box.x - this.player.x < 150) && (box.x - this.player.x > -80) &&
            (box.y - this.player.y < 5) && (box.y - this.player.y > -14) &&
            (this.game.input.keyboard.addKey(Phaser.Keyboard.E).isDown)) {
            box.body.velocity.copyFrom(this.player.body.velocity);
        }

        var game = this.game;
        var gameover = this.gameover;
        game.physics.arcade.collide(box, this.trap, function () {
            var style = {font: "bold 72px Raleway", fill: "#000", boundsAlignH: "center", boundsAlignV: "middle"};
            game.add.text(50, 250, "The Cheese is yours.\nYou won the Level!", style);
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
