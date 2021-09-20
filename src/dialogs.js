

export default {
    // called when the plugin is loaded by the PluginManager
    boot: function () {
        var eventEmitter = this.systems.events;
        eventEmitter.on('destroy', this.destroy, this);
    },

    //  Called when a Scene shuts down, it may then come back again later
    // (which will invoke the 'start' event) but should be considered dormant.
    shutdown: function () {
        if (this.timedEvent) this.timedEvent.remove();
        if (this.text) this.text.destroy();
    },

    // called when a Scene is destroyed by the Scene Manager
    destroy: function () {
        this.shutdown();
        this.scene = undefined;
    },

    // Initialize the dialog modal
    init: function (scene) {
        // Check to see if any optional parameters were passed
        let opts = {};
        // set properties from opts object or use defaults
        this.borderThickness = opts.borderThickness || 3;
        this.borderColor = opts.borderColor || 0x907748;
        this.borderAlpha = opts.borderAlpha || 1;
        this.windowAlpha = opts.windowAlpha || 0.8;
        this.windowColor = opts.windowColor || 0x303030;
        this.windowHeight = opts.windowHeight || 150;
        this.padding = opts.padding || 32;
        this.dialogSpeed = opts.dialogSpeed || 3;

        this.eventCounter = 0;
        this.visible = true;
        this.text;
        this.dialog;
        this.graphics;
        this.avatar;
        // Create the dialog window
        this._createWindow(scene);
    },

    // Hide/Show the dialog window
    toggleWindow: function () {
        this.visible = !this.visible;
        if (this.text) this.text.visible = this.visible;
        if (this.graphics) this.graphics.visible = this.visible;
    },

    // Slowly displays the text in the window to make it appear annimated
    _animateText: function () {
        this.eventCounter++;
        this.text.setText(this.text.text + this.dialog[this.eventCounter - 1]);
        if (this.eventCounter === this.dialog.length) {
            this.timedEvent.remove();
        }
    },

    // Sets the text for the dialog window
    setText: function (scene, text) {
        // Reset the dialog
        this.eventCounter = 0;
        this.dialog = text.split('');
        if (this.timedEvent) this.timedEvent.remove();

        var tempText = '';
        this._setText(tempText, scene);

        var sound = new Audio('https://api.streamelements.com/kappa/v2/speech?voice=Mia&text='+ encodeURIComponent(text));
        sound.play()

        this.timedEvent = scene.time.addEvent({
            delay: 150 - (this.dialogSpeed * 30),
            callback: this._animateText,
            callbackScope: this,
            loop: true
        });
    },

    // Sets and array of text and display them deleyed

    setTexts: function (scene, texts, character) {
        //this.setText(scene, texts[0])
        if (this.timedEvent) this.timedEvent.remove();

        var self =  this;

        texts.forEach((text,i) => {
            scene.time.delayedCall( i * 3000, function() { 
                this.setText(scene, text)
                
                // close after 3 secounds
                if(i == texts.length -1){
                    console.log('close')
                    scene.time.delayedCall( 3000, function() {
                        self.toggleWindow();
                        if (self.timedEvent) self.timedEvent.remove();
                        if (self.text) self.text.destroy();
                        if (self.avatar) self.avatar.destroy();
                     }, [], this);
                }

            }, [], this);

           
        });

        this._createAvatar(scene, character);

    },


    // Calcuate the position of the text in the dialog window
    _setText: function (text, scene) {
        // Reset the dialog
        if (this.text) this.text.destroy();

        var x = this.padding + 120;
        var y = this._getGameHeight(scene) - this.windowHeight - this.padding + 10;

        this.text = scene.make.text({
            x,
            y,
            text,
            style: {
                wordWrap: { width: this._getGameWidth(scene) - (this.padding * 2) - 25 }
            }
        });
    },

    // Creates the dialog window
    _createWindow: function (scene) {
        var gameHeight = this._getGameHeight(scene);
        var gameWidth = this._getGameWidth(scene);
        var windowDimensions = this._calculateWindowDimensions(gameWidth, gameHeight);
        this.graphics = scene.add.graphics();

        this._createOuterWindow(windowDimensions);
        this._createInnerWindow(windowDimensions);
    },

    // Gets the width of the game (based on the scene)
    _getGameWidth: function (scene) {
        return scene.sys.game.config.width;
    },

    // Gets the height of the game (based on the scene)
    _getGameHeight: function (scene) {
        return scene.sys.game.config.height;
    },

    // Calculates where to place the dialog window based on the game size
    _calculateWindowDimensions: function (width, height) {
        var x = this.padding;
        var y = height - this.windowHeight - this.padding;
        var rectWidth = width - (this.padding * 2);
        var rectHeight = this.windowHeight;
        return {
            x,
            y,
            rectWidth,
            rectHeight
        };
    },

    // Creates the inner dialog window (where the text is displayed)
    _createInnerWindow: function ({ x, y, rectWidth, rectHeight }) {
        this.graphics.fillStyle(this.windowColor, this.windowAlpha);
        this.graphics.fillRect(x + 1, y + 1, rectWidth - 1, rectHeight - 1);
    },

    // Creates the border rectangle of the dialog window
    _createOuterWindow: function ({ x, y, rectWidth, rectHeight }) {
        this.graphics.lineStyle(this.borderThickness, this.borderColor, this.borderAlpha);
        this.graphics.strokeRect(x, y, rectWidth, rectHeight);
    },

    // Creates the avatar
    _createAvatar: function (scene, character) { // ,frame
        console.log('avatar_'+character)
        this.avatar = scene.add.image( this.padding + 4, this.padding -10, 'avatar_'+character);
        this.avatar.setOrigin(0,0);

    }
}