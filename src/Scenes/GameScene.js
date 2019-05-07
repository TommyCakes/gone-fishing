import { Scene } from 'phaser';
import Player from "../Sprites/Player";
import Lake from '../Sprites/Lake';

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

    createTimer() {
        this.timer = this.time.addEvent({
            delay: 1000,               
            callback: () => console.log('hello!'),
            args: [],
            callbackScope: this,
            repeat: 0,
            startAt: 0,
            timeScale: 1,
            paused: true
        });
    }

    updateTime() {       
        this.timer.paused = false;

        if (this.cooldown === 0) {            
            this.timer.paused = true;
        }
        this.cooldown -= 1;        
    }

    create() {

        console.log('create method called');
        this.COOLDOWN_DELAY = 2;
        this.cooldown = this.COOLDOWN_DELAY;
        // let cooldown = 2000;
        this.second = 1000;
        // let cooldownDelay = this.time.addEvent(cooldown, this.updateTime);

        this.timer = this.time.addEvent({
            delay: this.second * this.COOLDOWN_DELAY,           
            callback: this.updateTime,
            //args: [],
            callbackScope: this,
            loop: true
        });      
        
        this.timer.paused = true;

        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // this.keySpace.on("down", timer.getElapsedSeconds, this);
        let bg = this.add.image(0, 0, 'bg');
        bg.displayWidth = 800;
        bg.setScale(2);

        this.player = new Player(
            this,
            100,
            300,
            "sprPlayer"
        );
        
        this.lake = new Lake(
            this,
            500,
            200,
            "water"
        );
                
        this.lake.setDepth(1);
        this.physics.add.collider(this.player, this.lake);

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
        if (this.cooldown === 0) {
            console.log('ready to fish');
            this.player.fishing();
            this.timer.paused = true; 
            this.cooldown = this.COOLDOWN_DELAY;           
        }

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
        if (this.keySpace.isDown) {
            this.timer.paused = false;
            this.physics.add.overlap(this.player, this.lake, this.updateTime, null, this);            
            console.log(this.cooldown);
        }
        
    }
}