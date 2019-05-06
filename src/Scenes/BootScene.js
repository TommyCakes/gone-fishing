import { Scene } from 'phaser';

export default class BootScene extends Scene {
    constructor() {
        super('Boot');
    }

    preload() {
        this.load.image('rabbit', '/assets/wabbit.png');
        this.load.image('bg', '/assets/bg.jpg');

        this.load.spritesheet('player', 'assets/player.png',{ 
            frameWidth: 48, 
            frameHeight: 64 
        });
    }

    create() {
        this.scene.start('Preload');
    }
}