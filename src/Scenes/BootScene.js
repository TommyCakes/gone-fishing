import { Scene } from 'phaser';

export default class BootScene extends Scene {
    constructor() {
        super('Boot');
    }

    preload() {
        this.load.image('rabbit', '/assets/wabbit.png');
        this.load.image('bg', '/assets/bg.jpg');
    }

    create() {
        this.scene.start('Preload');
    }
}