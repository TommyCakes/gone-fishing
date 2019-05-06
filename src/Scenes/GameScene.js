import { Scene } from 'phaser';
import Player from "../Sprites/Player";

export default class GameScene extends Scene {
    constructor() {
        super('Game');
    }

    preload() {
        this.load.image('fish', 'assets/fish.png');
        this.load.image('fisherman', 'assets/fishman.png');
        this.load.image('water', 'assets/water.png');
        this.load.image('bg', 'assets/grass.png');
        this.load.spritesheet('sprPlayer', 'assets/player.png', { 
            frameWidth: 48, 
            frameHeight: 64 
        });
    }

    create() {
        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        let bg = this.add.image(0, 0, 'bg');
        bg.displayWidth = 800;
        bg.setScale(2);

        this.player = new Player(
            this,
            100,
            300,
            "sprPlayer"
        );

        this.evilPlayer = new Player(
            this,
            300,
            300,
            "sprPlayer"
        );

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('sprPlayer', { start: 10, end: 12
        }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('sprPlayer', { start: 0, end: 2
        }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [ { key: 'sprPlayer', frame: 8} ],
            framerate: 20
        });
            
        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('sprPlayer', { start: 6, end: 8
        }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('sprPlayer', { start: 3, end: 5
        }),
            frameRate: 10,
            repeat: -1
        });
    }

    update() {
        this.player.update();

        if (this.keyW.isDown) {
            this.player.moveUp();
            this.player.anims.play('up', true);
        } else if (this.keyS.isDown) {
            this.player.moveDown();
            this.player.anims.play('down', true);
        } else if (this.keyA.isDown) {
            this.player.moveLeft();
            this.player.anims.play('left', true);
        } else if (this.keyD.isDown) {
            this.player.moveRight();
            this.player.anims.play('right', true);
        } else {      
            this.player.anims.stop();
        }
    }
}