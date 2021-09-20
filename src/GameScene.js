import { Scene } from 'phaser'

import dialogs from './dialogs'


class GameScene extends Scene {
    preload() {
        this.load.image('ground', 'assets/platform.png');

        this.load.image('background', 'assets/scenes/cristianghost_room/background.png');

        this.load.image('avatar_cristianghost', 'assets/avatars/cristianghost.png');


        this.load.spritesheet('dude',
            'assets/dude.png',
            { frameWidth: 32, frameHeight: 48 }
        );

    }

    create() {
        this.background = this.add.image(0, 0, 'background');
        this.background.setOrigin(0,0)
        this.background.setScale(1/6);
        this.createPlatforms()
        this.createPlayer()
        this.createCursor()

        dialogs.init(this)
        dialogs.setTexts(this,['Hola','test', 'cristianghost'], 'cristianghost')

       // this.time.delayedCall(3000, function() { dialogs.setText(this,'texto') }, [], this);

    }

    createPlatforms() {

        this.platforms = this.physics.add.staticGroup();

        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();

        this.platforms.create(600, 400, 'ground');
        this.platforms.create(50, 250, 'ground');
        this.platforms.create(750, 220, 'ground');
    }

    createPlayer() {
        this.player = this.physics.add.sprite(100, 450, 'dude');

        this.player.setBounce(0.2);

        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, this.platforms);


        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [{ key: 'dude', frame: 4 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
    }

    createCursor() {
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);

            this.player.anims.play('left', true);
        }
        else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);

            this.player.anims.play('right', true);
        }
        else {
            this.player.setVelocityX(0);

            this.player.anims.play('turn');
        }
    }
}

export default GameScene