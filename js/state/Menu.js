Cheesal.Menu = function (game) {
    this.game = game;
};

Cheesal.Menu.prototype = {

    create: function () {
        this.game.withBox = false;
        this.game.input.keyboard.onDownCallback = function (e) {
        };
        //  A simple background for our game
        this.game.stage.backgroundColor = "#FFF";

        this.lev1 = this.game.add.sprite(370, 425, 'hole');
        this.game.physics.enable(this.lev1, Phaser.Physics.ARCADE);
        this.lev1.scale.setTo(0.4, 0.4);
        this.lev1.body.immovable = true;

        this.lev2 = this.game.add.sprite(170, 425, 'hole');
        this.game.physics.enable(this.lev2, Phaser.Physics.ARCADE);
        this.lev2.scale.setTo(0.4, 0.4);
        this.lev2.body.immovable = true;

        this.lev3 = this.game.add.sprite(230, 275, 'hole');
        this.game.physics.enable(this.lev3, Phaser.Physics.ARCADE);
        this.lev3.scale.setTo(0.4, 0.4);
        this.lev3.body.immovable = true;

        this.lev4 = this.game.add.sprite(480, 275, 'hole');
        this.game.physics.enable(this.lev4, Phaser.Physics.ARCADE);
        this.lev4.scale.setTo(0.4, 0.4);
        this.lev4.body.immovable = true;

        this.lev5 = this.game.add.sprite(300, 75, 'hole');
        this.game.physics.enable(this.lev5, Phaser.Physics.ARCADE);
        this.lev5.scale.setTo(0.4, 0.4);
        this.lev5.body.immovable = true;

        this.platforms = this.game.add.group();
        this.platforms.enableBody = true;

        this.ground = this.platforms.create(0, this.game.world.height - 50, 'ground');
        //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
        this.ground.scale.setTo(1, 0.5);
        this.ground.body.immovable = true;

        this.topledge = this.platforms.create(20, 200, 'ground');
        this.topledge.scale.setTo(0.7, 0.3);
        this.topledge.body.immovable = true;

        this.bottomledge = this.platforms.create(180, 400, 'ground');
        this.bottomledge.scale.setTo(0.7, 0.3);
        this.bottomledge.body.immovable = true;

        var title = {font: "bold 42px Raleway", fill: "#000", boundsAlignH: "center", boundsAlignV: "middle"};
        this.game.add.text(350, 0, "Cheesal!", title);
        var normal = {font: "bold 22px Raleway", fill: "#000", boundsAlignH: "center", boundsAlignV: "middle"};
        this.game.add.text(180, 50, "Do you want to play a Game? Get the Cheese!", normal);
        this.game.add.text(600, 430, "Controls:\n→ right - ← left\n↑ jump - E drag\nspacebar into ", normal);

        var grafitti = {font: "bold 40px Calligraffitti", fill: "#600", boundsAlignH: "center", boundsAlignV: "middle"};
        this.game.add.text(200, 550, "The Cheese is a lie!", grafitti);

        var number = {font: "bold 42px Calligraffitti", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle"};
        this.game.add.text(this.lev1.x + this.lev1.width / 2 - 20, this.lev1.y + this.lev1.height / 2 - 20, " 1 ", number);
        this.game.add.text(this.lev2.x + this.lev2.width / 2 - 20, this.lev2.y + this.lev2.height / 2 - 20, " 2 ", number);
        this.game.add.text(this.lev3.x + this.lev3.width / 2 - 20, this.lev3.y + this.lev3.height / 2 - 20, " 3 ", number);
        this.game.add.text(this.lev4.x + this.lev4.width / 2 - 20, this.lev4.y + this.lev4.height / 2 - 20, " 4 ", number);
        this.game.add.text(this.lev5.x + this.lev5.width / 2 - 20, this.lev5.y + this.lev5.height / 2 - 20, " 5 ", number);

        this.player = this.game.add.sprite(25, 500, 'mouse');
        this.player.scale.setTo(0.2, 0.2);
        this.game.physics.arcade.enable(this.player);

        this.player.body.bounce.y = 0.2;
        this.player.body.gravity.y = 200;
        this.player.body.collideWorldBounds = true;

        //  Our two animations, walking left and right.
        this.player.animations.add('left', [0, 1, 2], 10, true);
        this.player.animations.add('right', [3, 4, 5], 10, true);

        this.box = this.game.add.sprite(15, 140, 'box');
        this.box.scale.setTo(0.2, 0.25);
        this.game.physics.arcade.enable(this.box);
        this.box.body.bounce.y = 0.2;
        this.box.body.gravity.y = 300;
        this.box.body.collideWorldBounds = true;


        this.cursors = this.game.input.keyboard.createCursorKeys();

        this.spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    },


    update: function () {
        //  Collide the player and the stars with the platforms
        this.game.physics.arcade.collide(this.player, this.platforms);

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

        if (this.checkOverlap(this.player, this.lev1) && (this.spaceKey.isDown)) {
            if (this.checkOverlap(this.box, this.lev1)) this.game.withBox = true;
            this.state.start('Level1');
        }
        if (this.checkOverlap(this.player, this.lev2) && (this.spaceKey.isDown)) {
            if (this.checkOverlap(this.box, this.lev2)) this.game.withBox = true;
            this.state.start('Level2');
        }
        if (this.checkOverlap(this.player, this.lev3) && (this.spaceKey.isDown)) {
            if (this.checkOverlap(this.box, this.lev3)) this.game.withBox = true;
            this.state.start('Level3');
        }
        if (this.checkOverlap(this.player, this.lev4) && (this.spaceKey.isDown)) {
            if (this.checkOverlap(this.box, this.lev4)) this.game.withBox = true;
            this.state.start('Level4');
        }
        if (this.checkOverlap(this.player, this.lev5) && (this.spaceKey.isDown)) {
            if (this.checkOverlap(this.box, this.lev5)) this.game.withBox = true;
            this.state.start('Level5');
        }

        this.boxcontrol();
    },

    boxcontrol: function () {
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

    },

    checkOverlap: function (spriteA, spriteB) {

        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();

        return Phaser.Rectangle.intersects(boundsA, boundsB);

    }
};
