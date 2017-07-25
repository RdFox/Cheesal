Cheesal.Preloader = function (game) {
    this.background = null;
    this.preloadBar = null;
    this.ready = false;
};

Cheesal.Preloader.prototype = {

    preload: function () {

        //	These are the assets we loaded in Boot.js
        //	A nice sparkly background and a loading progress bar
        this.background = this.add.sprite(0, 0, 'preloaderBackground');
        this.preloadBar = this.add.sprite(300, 400, 'preloaderBar');

        //	This sets the preloadBar sprite as a loader sprite.
        //	What that does is automatically crop the sprite from 0 to full-width
        //	as the files below are loaded in.
        this.load.setPreloadSprite(this.preloadBar);

       this.game.load.image('ground', 'assets/game/platform.png');

        this.game.load.spritesheet('mouse', 'assets/game/mouse.png', 540,250);
        this.game.load.image('box', 'assets/game/box.png');
        this.game.load.image('trap', 'assets/game/trap.png');
        this.game.load.image('hole', 'assets/game/hole.png');
        this.game.load.image('shroom', 'assets/game/shroom.png');


    },

    create: function () {

        //	Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
        this.preloadBar.cropEnabled = false;

    },

    update: function () {

        this.ready = true;
        this.state.start('Menu');

    }

};
