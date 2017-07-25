

Cheesal.Level4 = function (game) {
    this.game = game;
};

Cheesal.Level4.prototype = {

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
        this.leftledge.scale.setTo(0.2, 0.3);
        this.leftledge.body.immovable = true;

        this.middleledge = this.platforms.create(300, 250, 'ground');
        this.middleledge.scale.setTo(0.125, 0.3);
        this.middleledge.body.immovable = true;

        this.rightledge = this.platforms.create(550, 275, 'ground');
        this.rightledge.scale.setTo(0.125, 0.3);
        this.rightledge.body.immovable = true;

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

        this.shroom = this.game.add.sprite(150, 500, 'shroom');
        this.game.physics.enable(this.shroom, Phaser.Physics.ARCADE);
        this.shroom.scale.setTo(0.4, 0.4);
        this.shroom.body.immovable = true;


        this.boxes = [];
        if(this.game.withBox){
            this.createNewBox(this.player.x - 100,this.player.y);
        }
        this.createNewBox(10,0);

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
            game.add.text(100, 300, "You died.\nYou lost the Level!", style);
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

        if (this.lastBox.y > 284) {
            this.createNewBox(10, 0);
        }

        this.boxes.forEach(this.boxcontrol, this)


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

        if(this.checkOverlap(box, this.shroom)){
            box.body.velocity.y = -500;
        }

        var game = this.game;
        var gameover = this.gameover;
        var master = box;
        this.boxes.forEach(function (next) {
            game.physics.arcade.collide(master, next);
        });
        game.physics.arcade.collide(box, this.trap, function () {
            var style = {font: "bold 72px Raleway", fill: "#000", boundsAlignH: "center", boundsAlignV: "middle"};
            game.add.text(50, 300, "The Cheese is yours.\nYou won the Level!", style);
            gameover = true;
        });
        this.gameover = gameover;
    },

    checkOverlap: function (spriteA, spriteB) {

        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();

        return Phaser.Rectangle.intersects(boundsA, boundsB);

    },

    createNewBox: function (x, y) {
        var box = this.game.add.sprite(x, y, 'box');
        box.scale.setTo(0.2, 0.25);

        this.game.physics.arcade.enable(box);

        box.body.bounce.y = 0.2;
        box.body.gravity.y = 300;
        box.body.collideWorldBounds = true;
        this.boxes.push(box);
        this.lastBox = box;
    },
};
