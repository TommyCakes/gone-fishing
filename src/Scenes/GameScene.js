import { Scene } from 'phaser';
import Player from "../Sprites/Player";
import Lake from '../Sprites/Lake';
import Shop from '../Classes/Shop';
import UI from '../Classes/UI';

export default class GameScene extends Scene {
    constructor() {
        super('Game');
    }

    preload() {
        this.load.image('fish', 'assets/fish.png');
        this.load.image('rod', 'assets/fishing_rod.png');
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
        this.load.spritesheet('goldCoin', 'assets/coin_gold.png', { 
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

    createInteractivePanel() {
        let style = { font: '13px Arial', fill: '#fff', align: 'center' }   
        this.uiPanel = this.add.group();
        this.uiBackground = this.add.image(this.player.x / 2 + 160, this.player.y + 160, 'panel').setScrollFactor(0);  
        this.brownPanel = this.add.image(this.uiBackground.x + this.uiBackground.width - 90, this.uiBackground.y - 60, 'brownPanel').setScrollFactor(0);  
        this.text = this.add.text(this.uiBackground.x, this.brownPanel.y, 'Will you settle down for the night, and save your progress?', style).setScrollFactor(0)
        // this.add.text(this.player.x / 2 + 84, this.player.y + 84, 'Will you settle down for the night, and save your progress?', style).setScrollFactor(0);                                        
        this.text.setOrigin(0.5, 0.5);   
        this.buttonYes = this.add.image(this.player.x / 2 + 120, this.text.y + 100, 'greyButton').setScrollFactor(0).setInteractive();  
        this.buttonYes.name = 'yesBtn';
        this.check = this.add.image(this.player.x / 2 + 120, this.text.y + 100, 'checkBlue').setScrollFactor(0)
        this.buttonNo = this.add.image(this.buttonYes.x + this.buttonYes.width * 2, this.text.y + 100, 'greyButton').setScrollFactor(0).setInteractive();          
        this.buttonNo.name = 'noBtn';
        this.cross = this.add.image(this.buttonYes.x + this.buttonYes.width * 2, this.text.y + 100, 'crossBrown').setScrollFactor(0)
        this.uiBackground.setScale(1);
        this.buttonYes.setScale(1.5);
        this.buttonNo.setScale(1.5);
        this.uiBackground.displayWidth = 400;        
        this.brownPanel.displayWidth = 375;        
        this.uiBackground.displayHeight = 200;        
        this.uiPanel.add(this.uiBackground);
        this.uiPanel.add(this.brownPanel);
        this.uiPanel.add(this.text);
        this.uiPanel.add(this.buttonYes);
        this.uiPanel.add(this.check);
        this.uiPanel.add(this.cross);
        this.uiPanel.add(this.buttonNo);
        this.uiPanel.setDepth(2)  
        this.buttonYes.on('pointerdown', ()=> { this.player.sleep(true)}); 
        return this.uiPanel;               
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
        this.cursors = this.input.keyboard.createCursorKeys();            
        this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        let world = this.physics.add.group({
            key: 'bg',
            repeat: 4,
            setXY: { x: 300, y: 300, stepX: 650 }
        });

        this.player = new Player(
            this,
            // 230,
            1000,
            230,
            "sprPlayer"
        );
        
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, this.game.width, this.game.height);
        
        this.lake = new Lake(
            this,
            500,
            200,
            "water"
        );                
        
        this.shopObj = new Shop();
        this.canFish = true;
        this.canShop = true;
        this.canSleep = true;
        
        this.playerInfo = this.player.getInfo();
        this.playerInventory = this.player.getInventory();

        let catchesRemaining = this.playerInfo.catchesRemainingForTheDay 
        let cash = this.playerInfo.cash 
        let totalFish = this.playerInventory.fish.length

        // basic text feedback
        let style = { font: '20px Arial', fill: '#fff' } 
        this.infoText = this.add.text(100, 360, "", style);  
        
        this.ui = this.createUI(catchesRemaining, cash, totalFish, style);
        this.ui.setDepth(1)

        // Zones
        let lakeZone = this.createNewZone(400, 100, 200, 200);
        let shopZone = this.createNewZone(0, 90, 180, 100);
        let homeZone = this.createNewZone(900, 90, 180, 100);

        let fisherman = this.physics.add.sprite(500, 60, 'fisherman');
        fisherman.setScale(0.3, 0.3);
                
        this.shop = this.physics.add.sprite(90, 70, 'shop');
        this.shopKeeper = this.physics.add.sprite(100, 150, 'shopKeeper', 8);        
        this.shop.body.moves = false;
        this.shopKeeper.body.moves = false;
        this.shopKeeper.body.setCircle(25);
        
        this.home = this.physics.add.sprite(1000, 70, 'home');
        this.home.body.moves = false;

        let chest = this.add.sprite(this.shop.x + -40, this.shop.y + 80, 'chests', 1);                                         
        let chest2 = this.add.sprite(this.shop.x -70, this.shop.y + 80, 'chests', 2);                                         

        this.player.setDepth(1);
        // energyContainer.setDepth(1);
        // energyBar.setDepth(1);
        this.player.body.setCircle(25);
        let lakes = this.add.group(this.lake);
        
        this.physics.add.overlap(this.player, this.lake, () => { this.isFishing = true; this.canShop = false; this.canSleep = false;});            
        this.physics.add.collider(this.player, lakeZone);    

        this.physics.add.collider(this.player, this.shop);            
        this.physics.add.overlap(this.player, shopZone, () => { this.isShopping = true; this.canFish = false; this.canSleep = false;});          
        this.physics.add.collider(this.player, this.shopKeeper);  
        
        this.physics.add.collider(this.player, this.home);            
        this.physics.add.overlap(this.player, homeZone, () => { this.isSleeping = true; this.canShop = false; this.canFish = false;});                  
    }
    
    spawnCoins() {
        let coins = this.add.group({
            key: 'goldCoin',
            repeat: this.player.info.inventory.fish.length + 1 ,
            setXY: {
                x: this.player.x + Phaser.Math.RND.between(40, 340),
                y: this.player.y + 100,
            }
        });  
        return coins;      
    }        
    
    fadeInfo() {
        this.time.delayedCall(1000, () => {                             
            this.infoText.visible = false;
        }, [], this);
    }

    update() {    
        
        let catchesLeft = this.playerInfo.catchesRemainingForTheDay 
        let cash = this.playerInfo.cash  
        let totalFish = this.playerInventory.fish.length
        this.catchesRemainingText.setText(`Attempts left: ${catchesLeft}`) ;    
        this.money.setText(cash);     
        this.amountOfFish.setText(totalFish);     

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
        
        this.player.body.debugBodyColor = this.player.body.touching.none ? 0x0099ff : 0xff9900;
        
        if (this.canSleep) {                                                             
            this.toggleKeyboard(true);
            if (this.keySpace.isDown) {
                if (touching && wasTouching) { 
                    this.player.anims.stop();
                    this.toggleKeyboard(false);                    
                    let ui = this.createInteractivePanel();   
                    this.input.on('pointerdown', () => {                           
                        ui.children.iterate(child => {
                            if (child.name === 'noBtn') {
                                child.destroy(child, true);
                            }
                        });
                        ui.clear(true);
                    })                                                                          
                }
            }
        }    

        if (this.player.info.catchesRemainingForTheDay === 0) {
            this.infoText.setText(`You have run out of attempts... 
                Time to go home`);
            this.fadeInfo();
        }

        if (this.player.info.catchesRemainingForTheDay >= 1 && this.canFish) {             
            if (this.cooldown > 0) {                
                this.timer.paused = false;             
            } else if (this.cooldown === 0) {                
                this.toggleKeyboard(true);                
                this.timer.paused = true;                                 
                if (this.keySpace.isDown) {                      
                    if (touching && wasTouching) {  
                        this.player.anims.stop(); 
                        this.toggleKeyboard(false);  
                        console.log(this.player.body);   
                        if (this.player.x - this.lake.x > 0) {
                            console.log('facing left');
                            this.player.flipX = true;
                        } else if (this.player.x - this.lake.x < 0) {
                            this.player.flipX = false;
                        }                                             
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
                        this.player.anims.stop();
                        this.toggleKeyboard(false);
                        this.timer.paused = false;   
                        this.shopObj.sellAllFish(this.player);
                        this.cooldown = this.FISHING_COOLDOWN_DELAY; 
                        // this.coins = this.spawnCoins();
                        this.infoText.setText(`You sold a total of ${this.player.info.inventory.fish.length} fish!`); 
                        this.fadeInfo();
                    }
                }
            }                     
        }                 
                                                
        this.player.update();
        
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
    }
}