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

    updateTime() {        
        if (this.cooldown === 0) {            
            this.timer.paused = true;
        }
        this.cooldown -= 1;        
    }

    create() {

        console.log('create method called');
        this.FISHING_COOLDOWN_DELAY = 2;
        this.cooldown = this.FISHING_COOLDOWN_DELAY;
        this.second = 1000;

        this.timer = this.time.addEvent({
            delay: this.second * this.FISHING_COOLDOWN_DELAY,           
            callback: this.updateTime,
            callbackScope: this,
            loop: true
        });      
        
        this.timer.paused = true;

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
        
        let lake1 = new Lake(
            this,
            500,
            200,
            "water"
        );

        let lake2 = new Lake(
            this,
            30,
            310,
            "water"
        );
        
        this.lakeGroups = this.add.group();
        this.lakeGroups.add(lake1, lake2);
        this.player.setDepth(1);
        
        this.physics.add.overlap(this.player, this.lakeGroups);            
        this.isColliding = this.player.body.checkCollision.none ? true : false;
        console.log(this.isColliding)

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
    
    test() {
        this.lake.body = false;
    }

    update() {
        
        // console.log(this.isColliding);
        this.player.body.debugBodyColor = this.isColliding ? 0x0099ff : 0xff9900;
        // this.player.body.touching.none ? console.log(true) : console.log(false)
        if (this.isColliding && this.player.info.catchesRemainingForTheDay > 0 && this.keySpace.isDown) {
            this.timer.paused = false; 
            this.input.disabled = true;
            this.player.body.velocity.x = 0;

            if (this.cooldown === 0) {
                // this.isColliding = false;
                console.log('ready to fish');
                this.player.fishing();
                this.timer.paused = true; 
                this.cooldown = this.FISHING_COOLDOWN_DELAY;                   
            } 
            this.isColliding = false;
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
        // if (this.keySpace.isDown) {
        //     if (this.isColliding) {
        //         this.timer.paused = false;   
        //     }                         
        //     // console.log(this.cooldown);
        // }
        
    }
}