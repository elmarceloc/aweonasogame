import Phaser from 'phaser'
import GameScene from './GameScene';

var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 178 *2,
    height: 100 *2,
    pixelArt: true,
    scale: {
        mode: Phaser.Scale.FIT,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: GameScene
};

export { config }