var Cheesal = {
    oriented: false
};

Cheesal.Boot = function (game) {

};

Cheesal.Boot.prototype = {

    init: function () {
        this.input.maxPointers = 1;

        //  Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
        this.stage.disableVisibilityChange = true;

        if (this.game.device.desktop) {
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            // this.scale.setMinMax(480, 270, 1920, 1080);
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
            this.scale.setScreenSize(true);
            this.scale.refresh();
        }
        else {
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            // this.scale.setMinMax(480, 270, 1920, 1080);
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
            this.scale.forceOrientation(true, false);
            // this.scale.setResizeCallback(this.gameResized, this);
            this.scale.enterIncorrectOrientation.add(this.enterIncorrectOrientation, this);
            this.scale.leaveIncorrectOrientation.add(this.leaveIncorrectOrientation, this);
            this.scale.setScreenSize(true);
            this.scale.refresh();
        }


    },

    preload: function () {

        //  Here we load the assets required for our preloader (in this case a background and a loading bar)
        this.load.image('preloaderBackground', 'assets/preloader/preloader_background.jpg');
        this.load.image('preloaderBar', 'assets/preloader/preloadr_bar.png');

    },

    create: function () {
        this.state.start('Preloader');
    },

    enterIncorrectOrientation: function () {
        Cheesal.orientated = false;
        document.getElementById('orientation').style.display = 'block';
    },

    leaveIncorrectOrientation: function () {
        Cheesal.orientated = true;
        document.getElementById('orientation').style.display = 'none';

    }
};
