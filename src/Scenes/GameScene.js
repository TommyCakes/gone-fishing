import { Scene } from 'phaser';
import Player from "../Sprites/Player";
import Lake from '../Sprites/Lake';
import Shop from '../Classes/Shop';

export default class GameScene extends Scene {
    constructor() {
        super('Game');
    }

    preload() {
        this.load.image('fish', 'assets/fish.png');
        this.load.image('fisherman', 'assets/fisherman.png');
        this.load.image('water', 'assets/water.png');
        this.load.image('shop', 'assets/shop.png');
        this.load.image('bg', 'assets/grass.png');
        // this.load.image('energyBar', 'assets/energybar.png');
        // this.load.image("energyContainer", "assets/energycontainer.png");
        this.load.spritesheet('sprPlayer', 'assets/yan.png', { 
            frameWidth: 48, 
            frameHeight: 64 
        });        
        this.load.spritesheet('shopKeeper', 'assets/elder.png', { 
            frameWidth: 48, 
            frameHeight: 64 
        });        
        this.load.spritesheet('waterMoving', 'assets/water_moving.png', { 
            frameWidth: 48, 
            frameHeight: 64 
        });
        this.load.spritesheet('fishingBobble', 'assets/fishing_bobbles.png', { 
            frameWidth: 24, 
            frameHeight: 24 
        });
        this.load.spritesheet('splash', 'assets/splash.png', { 
            frameWidth: 32, 
            frameHeight: 32 
        });
        this.load.spritesheet('chests', 'assets/chests.png', { 
            frameWidth: 32, 
            frameHeight: 32 
        });
    }

    updateTime() {                
        this.cooldown -= 1;  
        // let stepWidth = this.barMask.displayWidth / this.FISHING_COOLDOWN_DELAY;
        // this.barMask.x -= stepWidth;        
    }

    resetTimeBar() {
        // this.barMask.x = 1000;
    }
    
    toggleKeyboard(bool) {
        this.keyW.enabled = bool;
        this.keyS.enabled = bool;
        this.keyA.enabled = bool;
        this.keyD.enabled = bool;
        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;
    }

    createNewZone(x, y, w, h) {
        this.zone = this.add.zone(x, y).setSize(w, h);
        // this.zone.body.setCircle(45)
        this.physics.world.enable(this.zone, 0);
        this.zone.body.moves = false;
        return this.zone;
    }

    create() {
        this.FISHING_COOLDOWN_DELAY = 2;
        this.cooldown = 0;
        this.second = 1000;
        
        // let energyContainer = this.add.sprite(180, 20, "energyContainer");
        // let energyBar = this.add.sprite(energyContainer.x + 13, energyContainer.y, 'energyBar');        
        // this.barMask = this.add.sprite(energyBar.x, energyBar.y, "energyBar");
        // this.barMask.visible = false;
        // energyBar.setScale(0.3, 0.4);
        // energyContainer.setScale(0.3, 0.4);
        // this.barMask.setScale(0.3, 0.4);
        // energyBar.mask = new Phaser.Display.Masks.BitmapMask(this, this.barMask);

        this.timer = this.time.addEvent({
            delay: this.second * this.FISHING_COOLDOWN_DELAY,                
            callback: this.updateTime,
            callbackScope: this,
            loop: true
        });      
        
        this.timer.paused = false;
        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.canFish = true;

        let world = this.physics.add.group({
            key: 'bg',
            repeat: 4,
            setXY: { x: 300, y: 300, stepX: 650 }
        });

        this.player = new Player(
            this,
            230,
            230,
            "sprPlayer"
        );
        
        // this.camera.follow(this.player);

        this.lake = new Lake(
            this,
            500,
            200,
            "water"
        );                
        
        this.shopObj = new Shop();
        this.canFish = true;
        this.canShop = true;
        
        // basic text feedback
        let style = { font: '20px Arial', fill: '#fff' } 
        this.infoText = this.add.text(100, 360, "", style);        
        
        let lakeZone = this.createNewZone(400, 100, 200, 200);
        let shopZone = this.createNewZone(0, 90, 180, 100);
        let fisherman = this.physics.add.sprite(500, 60, 'fisherman');
        fisherman.setScale(0.3, 0.3);
        this.shop = this.physics.add.sprite(90, 70, 'shop');
        this.shopKeeper = this.physics.add.sprite(100, 150, 'shopKeeper', 8);        
        this.shop.body.moves = false;
        this.shopKeeper.body.moves = false;
        this.shopKeeper.body.setCircle(25);
        
        let chest = this.add.sprite(this.shop.x + -40, this.shop.y + 80, 'chests', 1);                                         
        let chest2 = this.add.sprite(this.shop.x -70, this.shop.y + 80, 'chests', 2);                                         

        this.player.setDepth(1);
        // energyContainer.setDepth(1);
        // energyBar.setDepth(1);
        this.player.body.setCircle(25);
        let lakes = this.add.group(this.lake);
        
        this.physics.add.overlap(this.player, this.lake, () => { this.isFishing = true; this.canShop = false;});            
        this.physics.add.collider(this.player, lakeZone);            
        this.physics.add.collider(this.player, this.shop);            
        this.physics.add.overlap(this.player, shopZone, () => { this.shopping = true; this.canFish = false});          
        this.physics.add.collider(this.player, this.shopKeeper);            
        
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('sprPlayer', { start: 10, end: 11
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
            key: 'fish',
            frames: this.anims.generateFrameNumbers('sprPlayer', { start: 13, end: 15
        }),
            frameRate: 10,
            repeat: -1
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
        if (this.player.body.embedded) this.player.body.touching.none = false;
        let touching = !this.player.body.touching.none;
        let wasTouching = !this.player.body.wasTouching.none;

        if (touching && !wasTouching) {
        } else if (!touching && wasTouching) { 
            this.isShopping = false; 
            this.canShop = true; 
            this.isFishing = false;
            this.canFish = true;
        }
    
        this.player.body.debugBodyColor = this.player.body.touching.none ? 0x0099ff : 0xff9900;
        
        if (this.player.info.catchesRemainingForTheDay === 0) {
            infoText.setText(`You have run out of attempts... 
                Time to go home`);
        }

        if (this.player.info.catchesRemainingForTheDay >= 1 && this.canFish) {             
            if (this.cooldown > 0) {                
                this.timer.paused = false;             
            } else if (this.cooldown === 0) {
                this.toggleKeyboard(true);                
                this.timer.paused = true;                                 
                if (this.keySpace.isDown) {                      
                    if (touching && wasTouching) {   
                        this.toggleKeyboard(false);                                      
                        this.player.anims.play('fish', true); 
                        console.log('is fishing!')  
                        this.timer.paused = false;                                                                 
                        this.player.fishing();                                    
                        this.cooldown = this.FISHING_COOLDOWN_DELAY;                     
                    }                                                                                              
                } 
            }
        } else if (this.canShop) {
            if (this.cooldown > 0) {
                this.timer.paused = false;             
            } else if (this.cooldown === 0) {
                this.toggleKeyboard(true);
                this.timer.paused = true; 
                if (this.keySpace.isDown) {
                    if (touching && wasTouching) { 
                        this.toggleKeyboard(false);
                        this.timer.paused = false;   
                        this.shopObj.sellAllFish(this.player);
                        this.cooldown = this.FISHING_COOLDOWN_DELAY; 
                    }
                }
            }                     
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
    }
}