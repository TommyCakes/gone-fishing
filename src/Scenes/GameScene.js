import { Scene } from 'phaser';
import Player from "../Sprites/Player";
import Lake from '../Sprites/Lake';
import Shop from '../Classes/Shop';
import Helper from '../Classes/Helper';

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

    createInteractiveSleepPanel(f) {
        let style = { font: '13px Arial', fill: '#fff', align: 'center' }                 
        let container = this.add.container(this.cameras.main.centerX / 2, this.cameras.main.centerY / 2);
        this.uiBackground = this.add.image(container.x, container.y, 'panel').setScrollFactor(0);  
        this.uiBackground.setOrigin(0.5, 0.5)
        this.brownPanel = this.add.image(this.uiBackground.x + this.uiBackground.width - 90, this.uiBackground.y - 40, 'brownPanel').setScrollFactor(0);          
        this.text = this.add.text(this.uiBackground.x, this.brownPanel.y, 'Will you settle down for the night, and save your progress?', style).setScrollFactor(0)
        this.buttonYes = this.add.image(this.uiBackground.x - 40 , this.brownPanel.y + 60 , 'greyButton').setScrollFactor(0).setInteractive();  
        this.buttonYes.name = 'yesBtn';
        this.check = this.add.image(this.uiBackground.x - 40, this.brownPanel.y + 70, 'checkBlue').setScrollFactor(0)
        this.buttonNo = this.add.image(this.buttonYes.x + this.buttonYes.width * 2, this.buttonYes.y, 'greyButton').setScrollFactor(0).setInteractive();          
        this.buttonNo.name = 'noBtn';
        this.cross = this.add.image(this.buttonYes.x + this.buttonYes.width * 2, this.text.y + 100, 'crossBrown').setScrollFactor(0)

        this.uiBackground.setScale(1);        
        this.uiBackground.displayWidth = 400;        
        this.brownPanel.displayWidth = 375;               
        this.uiBackground.displayHeight = 200;    

        this.buttonYes.setScale(1.5);
        this.buttonNo.setScale(1.5);
            
        this.text.setOrigin(0.5, 0.5);   
        container.setDepth(1);
        container.add([ this.uiBackground, this.brownPanel, this.text, this.buttonYes, this.buttonNo, this.check, this.cross]); 
                                    
        this.buttonYes.on('pointerdown', f); 

        this.input.on('pointerdown', () => {                           
            this.uiPanel.children.iterate(child => {
                if (child.name === 'noBtn') {
                    child.destroy(child, true);
                }
            });
            this.uiPanel.clear(true);
        })  
                                                            
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
        this.physics.world.enable(this.zone, 0);
        this.zone.body.moves = false;
        return this.zone;
    }

    create() {    
        this.helper = new Helper(this.scene);

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

        const waterLayer = map.createStaticLayer("Water", tileset, 0, 0);        

        const belowLayer = map.createStaticLayer("BP", tileset, 0, 0);        
        const worldLayer = map.createStaticLayer("W", tileset, 0, 0);
        const waterOverlap = map.createFromObjects("Overlap", 'fish');

        // const aboveLayer = map.createStaticLayer("Above Player", tileset, 0, 0);

        waterLayer.setCollisionByProperty({ collides: true });
        worldLayer.setCollisionByProperty({ collides: true });
        
        // this.waterAreas = this.physics.add.group();
        this.waterZone = this.createNewZone(0, 0, 70, 900);
        // this.waterZone2 = this.createNewZone(230, 200, 130, 160);

        this.homeZone = this.createNewZone(120, 60, 60, 50);        
        this.shopZone = this.createNewZone(380, 420, 120, 80);        
        // this.waterAreas.addMultiple([this.waterZone, this.waterZone2]) ;
        
        this.shopKeeper = this.physics.add.sprite(this.shopZone.x + this.shopZone.width / 2, this.shopZone.y + 20, 'shopKeeper', 8); 
        this.shopKeeper.body.moves = false;
        this.shopKeeper.body.setCircle(25);        
        this.shopKeeper.setScale(0.5); 
        this.physics.add.collider(this.player, this.shopKeeper);  

        this.physics.add.overlap(this.player, this.waterZone, () => { this.isFishing = true; this.canShop = false; this.canSleep = false;});            
        // this.physics.add.overlap(this.player, this.waterZone2, () => { this.isFishing = true; this.canShop = false; this.canSleep = false;});            
        this.physics.add.overlap(this.player, this.homeZone, () => { this.isSleeping = true; this.canShop = false; this.canFish = false;});            
        this.physics.add.overlap(this.player, this.shopZone, () => { this.isShopping = true; this.canSleep = false; this.canFish = false;});            
        
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, this.game.width, this.game.height);
        this.cameras.main.setFollowOffset(0, -100);
        this.cameras.main.zoom = 2.5;
        this.physics.add.collider(this.player, worldLayer);
        this.physics.add.collider(this.player, waterLayer);           
        this.events.emit('updateUI', this.playerInfo, this.cameras.main);               
        
        this.catchesRemaining = this.playerInfo.catchesRemainingForTheDay 
        this.cash = this.playerInfo.cash 
        this.totalFish = this.playerInventory.fish.length

        this.shopObj = new Shop();
        this.canFish = true;
        this.canShop = true;
        this.canSleep = true;                
    }  
        
    update() {  

        this.player.body.setVelocity(0)                                        
        this.player.update();
        
        if (this.player.body.embedded) this.player.body.touching.none = false;
        let touching = !this.player.body.touching.none;
        let wasTouching = !this.player.body.wasTouching.none;

        if (touching && !wasTouching) { 
            
        } else if (!touching && wasTouching) { 
            this.isShopping = false; 
            this.canShop = true; 
            this.isFishing = false;
            this.canFish = true;                 
            this.isSleeping = false;
            this.canSleep = true;                 
        }
        
        if (this.canSleep) {                                                             
            this.toggleKeyboard(true);
            if (this.keySpace.isDown) {
                if (touching && wasTouching) { 
                    console.log('ready to sleep?')
                    // this.player.anims.stop();                                       
                    // this.events.emit('createInteractiveSleepPanel', this.player);  
                    // this.toggleKeyboard(false);                                    
                    this.player.sleep(true);    
                    this.events.emit('updateUI', this.playerInfo);                                      
                }
            }
        } 
        
        if (this.player.info.catchesRemainingForTheDay >= 1 && this.canFish) {             
            if (this.cooldown > 0) {                            
                this.timer.paused = false;             
            } else if (this.cooldown === 0) {                
                this.toggleKeyboard(true);
                this.timer.paused = true;                                  
                if (this.keySpace.isDown) {                                                           
                    if (touching && wasTouching) {  
                        this.events.emit('updateUI', this.playerInfo);  
                        this.events.emit('showUIPopup', "You cast your rod out into the water...");                          
                        this.player.anims.stop(); 
                        this.toggleKeyboard(false);  
                        let playerDirection;
                        if (this.player.x - this.waterZone.x > 0) {
                            this.player.flipX = true;
                            playerDirection = 'left';
                        } else if (this.player.x - this.waterZone.x < 0) {
                            this.player.flipX = false;
                            playerDirection = 'right';
                        }                                             
                        this.player.anims.play('fish', true);  
                        this.timer.paused = false;                                                                 
                        this.player.fishing(playerDirection);                                                                                    
                        this.events.emit('updateUI', this.playerInfo);   
                        this.cooldown = this.FISHING_COOLDOWN_DELAY; 
                    }                    
                }                                                                                              
            } 
        } 
        
        if (this.canShop) {                    
            // if (this.cooldown > 0) {
            //     this.timer.paused = false;             
            // } else if (this.cooldown === 0) {                                                    
            //     this.toggleKeyboard(true);
            //     this.timer.paused = true;                 
                if (this.keySpace.isDown) {                    
                    if (touching && wasTouching) {   
                        this.events.emit('updateUI', this.playerInfo);                         
                        this.player.anims.stop();                                                
                        // this.toggleKeyboard(false);
                        // this.timer.paused = false;   
                        if (this.playerInventory.fish === 0) {
                            this.events.emit('showUIPopup', `You have no fish to sell, go and catch some!`); 
                        }                                                
                        this.shopObj.sellAllFish(this.player);                            
                        this.events.emit('showUIPopup', `You sold all your fish!`);   
                        this.playerInventory.fish.length = 0;      
                        this.events.emit('updateUI', this.playerInfo);               
                        // this.cooldown = this.FISHING_COOLDOWN_DELAY; 
                        // this.coins = this.spawnCoins();                        
                    }
                }
            // }                     
        }  
        

        if (this.keyW.isDown || this.cursors.up.isDown ) {
            this.player.moveUp();
            this.player.anims.play('up', true);               
        } else if (this.keyS.isDown || this.cursors.down.isDown) {
            this.player.moveDown();
            this.player.anims.play('down', true);
        } else if (this.keyA.isDown || this.cursors.left.isDown) {
            this.player.moveLeft();           
            this.player.resetFlip(); 
            this.player.anims.play('left', true);
        } else if (this.keyD.isDown || this.cursors.right.isDown) {
            this.player.moveRight();
            this.player.resetFlip();
            this.player.anims.play('right', true);
        } else {     
            this.player.anims.stop();
        } 
        
        this.player.body.velocity.normalize().scale(this.player.getData("speed"));
    }
}