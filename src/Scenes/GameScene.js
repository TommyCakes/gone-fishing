import { Scene } from 'phaser';
import Player from "../Sprites/Player";
import Lake from '../Sprites/Lake';
import Shop from '../Classes/Shop';
import Helper from '../Classes/Helper';
import MainUI from '../Scenes/MainUIScene';

export default class GameScene extends Scene {

    init() {              
    }

    constructor() {
        super('Game');        
    }

    preload() {
        // this.load.image('fish', 'assets/fish.png');
        // this.load.image('rod', 'assets/fishing_rod.png');
        this.load.image('fisherman', 'assets/fisherman.png');
        this.load.image('water', 'assets/water.png');
        this.load.image('shop', 'assets/shop.png');
        this.load.image('home', 'assets/house.png');
        this.load.image('bg', 'assets/grass.png');
        this.load.image('greyButton', 'assets/greyButton.png');
        this.load.image('panel', 'assets/panel.png');
        this.load.image('brownPanel', 'assets/longBrown.png');
        this.load.image('crossBrown', 'assets/crossBrown.png');
        this.load.image('checkBlue', 'assets/checkBlue.png');
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
        // this.load.spritesheet('goldCoin', 'assets/coin_gold.png', { 
        //     frameWidth: 32, 
        //     frameHeight: 32 
        // });

        this.load.image("tiles", "../assets/overworld.png");
        this.load.tilemapTiledJSON("map", "../assets/fishing-map.json");
    }

    updateTime() {                
        this.cooldown -= 1;  
        // let stepWidth = this.barMask.displayWidth / this.FISHING_COOLDOWN_DELAY;
        // this.barMask.x -= stepWidth;        
    }

    createUI(catches, cash, fishAmount, style) {
        this.ui = this.add.group();
        this.uiBg = this.add.rectangle(0, 20, 700, 80, '0x000000', 0.5).setScrollFactor(0);  

        this.money = this.add.text(32, 20, cash, style).setScrollFactor(0);
        this.moneyIcon = this.add.sprite(this.money.x - 16, this.money.y + 16, 'goldCoin', 2).setScrollFactor(0);                     

        this.catchesRemainingText = this.add.text(200, 20, `Left: ${catches}`, style).setScrollFactor(0);                                               
        this.catchesIcon = this.add.image(this.catchesRemainingText.x - 22, this.catchesRemainingText.y + 8, 'rod').setScrollFactor(0);     
        this.catchesIcon.setScale(0.7);

        this.amountOfFish = this.add.text(123, 20, `${fishAmount}`, style).setScrollFactor(0);                                               
        this.fishIcon = this.add.image(this.amountOfFish.x - 16, this.amountOfFish.y + 8, 'fish').setScrollFactor(0);     
        this.fishIcon.setScale(0.4);

        this.ui.add(this.uiBg);
        this.ui.add(this.money);
        this.ui.add(this.moneyIcon);
        this.ui.add(this.catchesRemainingText);
        this.ui.add(this.catchesIcon);
        this.ui.add(this.amountOfFish);
        this.ui.add(this.fishIcon);
        return this.ui;
    }

    toggleKeyboard(bool) {
        this.keyW.enabled = bool;
        this.keyS.enabled = bool;
        this.keyA.enabled = bool;
        this.keyD.enabled = bool;
        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;
    }

    create() {    

        // Setup timer
        this.FISHING_COOLDOWN_DELAY = 2;
        this.cooldown = 0;
        this.second = 1000;
        
        this.timer = this.time.addEvent({
            delay: this.second * this.FISHING_COOLDOWN_DELAY,                
            callback: this.updateTime,
            callbackScope: this,
            loop: true
        });      
        
        this.timer.paused = false;

        // Setup input keys                                
        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.cursors = this.input.keyboard.createCursorKeys();            
        this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
        this.player = new Player(
            this,
            120,
            // 1000,
            230,
            "sprPlayer"
        );
        
        this.playerInfo = this.player.getInfo();
        this.playerInventory = this.player.getInventory();               
        this.player.setDepth(1)
        
        // Load map
        const map = this.make.tilemap({ key: "map" });
        const tileset = map.addTilesetImage("overworld", "tiles");

        console.log(this.cache.tilemap.get('map').data);

        const waterLayer = map.createStaticLayer("Water", tileset, 0, 0);        
        // console.log(overlapObjects);
        // this.waterGroup = this.physics.add.staticGroup(overlapObjects);

        const belowLayer = map.createStaticLayer("BP", tileset, 0, 0);        
        const worldLayer = map.createStaticLayer("W", tileset, 0, 0);
        const waterOverlap = map.createFromObjects("Overlap", 'fish');


        // const aboveLayer = map.createStaticLayer("Above Player", tileset, 0, 0);

        waterLayer.setCollisionByProperty({ collides: true });
        worldLayer.setCollisionByProperty({ collides: true });
        // worldLayer.setCollisionByProperty({ collides: true });
        
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, this.game.width, this.game.height);
        this.cameras.main.setFollowOffset(0, -100);
        // this.cameras.main.zoom = 4;
        this.physics.add.collider(this.player, worldLayer);
        this.physics.add.collider(this.player, waterLayer);   
        this.events.emit('updateUI', this.playerInfo);                        
    }  
        
    update() {    
                   
        this.player.body.setVelocity(0)                                        
        this.player.update();
                
        // if (this.player.info.catchesRemainingForTheDay >= 1 && this.canFish) {             
            if (this.cooldown > 0) {                
                this.timer.paused = false;             
            } else if (this.cooldown === 0) {                
                this.toggleKeyboard(true);                
                this.timer.paused = true;                                 
                if (this.keySpace.isDown) {                                     
                    // if (touching && wasTouching) {  
                    //     this.player.anims.stop(); 
                        this.toggleKeyboard(false);  
                        console.log(this.player.body);   
                        // if (this.player.x - this.lake.x > 0) {
                        //     console.log('facing left');
                        //     this.player.flipX = true;
                        // } else if (this.player.x - this.lake.x < 0) {
                        //     this.player.flipX = false;
                        // }                                             
                        this.player.anims.play('fish', true); 
                        console.log('is fishing!')  
                        this.timer.paused = false;                                                                 
                        this.player.fishing();                                    
                        this.cooldown = this.FISHING_COOLDOWN_DELAY;                     
                }                                                                                              
            } 
        //     }
        // } 

        if (this.keyW.isDown || this.cursors.up.isDown ) {
            this.player.moveUp();
            this.player.anims.play('up', true);               
        } else if (this.keyS.isDown || this.cursors.down.isDown) {
            this.player.moveDown();
            this.player.anims.play('down', true);
        } else if (this.keyA.isDown || this.cursors.left.isDown) {
            this.player.moveLeft();
            this.player.flipX = false;
            this.player.anims.play('left', true);
        } else if (this.keyD.isDown || this.cursors.right.isDown) {
            this.player.moveRight();
            this.player.anims.play('right', true);
        } else {     
            this.player.anims.stop();
        } 
        
        this.player.body.velocity.normalize().scale(this.player.getData("speed"));
    }
}