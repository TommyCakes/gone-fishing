import { Scene } from 'phaser';
import Player from "../Sprites/Player";
import Lake from '../Sprites/Lake';
import Shop from '../Classes/Shop';
import Fishing from '../Classes/Fishing';
import Pet from '../Sprites/Pet';

export default class GameScene extends Scene {

    constructor() {
        super('Game');   
        this.style = { font: '13px Arial', fill: '#fff', align: 'center' }                                         
        this.smallStyleGold = { font: '10px Arial', fill: '#C0D825', align: 'right' }                                               
    }

    updateTime() {                
        this.cooldown -= 1;          
    }
    
    updateClock() {
        this.player.info.timeOfDay += 1;   
        console.log(this.timeOfDayTimer.getElapsedSeconds());     
        console.log(this.player.info.timeOfDay); 
        this.triggerUIUpdate();    
    }

    createNewTimer(delay, func) {
        return this.time.addEvent({
            delay: this.second * delay,
            callback: func,
            callbackScope: this,
            loop: true
        });
    }
    
    triggerUIUpdate() {
        this.events.emit('updateUI', this.playerInfo);     
    }

    createInteractiveSleepPanel(f) {
        
        let container = this.add.container(this.cameras.main.centerX / 2, this.cameras.main.centerY / 2);
        this.uiBackground = this.add.image(container.x, container.y, 'panel').setScrollFactor(0);  
        this.uiBackground.setOrigin(0.5, 0.5)
        this.brownPanel = this.add.image(this.uiBackground.x + this.uiBackground.width - 90, this.uiBackground.y - 40, 'brownPanel').setScrollFactor(0);          
        this.text = this.add.text(this.uiBackground.x, this.brownPanel.y, 'Will you settle down for the night, and save your progress?', this.style).setScrollFactor(0)
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
                if (child.name === 'no Btn') {
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
        // set up timer for day clock     
        let dayLengthInMinutes = 3;
        let dayLengthInSeconds = dayLengthInMinutes * 60;  
        let hoursInDay = 16
        this.nextHourDelay = dayLengthInSeconds / hoursInDay; // gives us 3 minute days
        this.second = 1000; 

        this.timeOfDayTimer = this.createNewTimer(this.nextHourDelay, this.updateClock);

        // Setup fishing timer
        this.FISHING_COOLDOWN_DELAY = 2;
        this.cooldown = 0;        
        
        this.fishingtimer = this.createNewTimer(this.FISHING_COOLDOWN_DELAY, this.updateTime);
                 
        this.timeOfDayTimer.paused = false;
        this.fishingtimer.paused = false;
        
        this.UIScene = this.scene.get('UIScene');  
        let fishList = this.cache.json.get('fishList').fish.type;
        this.fishingObj = new Fishing(fishList);
        this.conversations = this.cache.json.get('conversations');
        console.log(this.conversations);  
                
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
            150,
            210,
            "sprPlayer"
        );
        
        this.playerInfo = this.player.getInfo();
        this.playerInventory = this.player.getInventory();               
        this.player.setDepth(1);
        
        this.doggo = new Pet(
            this,
            210,
            200,
            "doggo"            
        );
        
        this.doggo.setDepth(1);
                       
        // this.doggo.anims.play('walk-right', true);
        // this.doggo.moveRight();
        this.doggo.anims.play('idle', true);
        
        // Load map
        const map = this.make.tilemap({ key: "main-world" });
        const tileset = map.addTilesetImage("overworld", "tiles");

        const waterLayer = map.createStaticLayer("Water", tileset, 0, 0);        

        const belowLayer = map.createStaticLayer("BP", tileset, 0, 0);        
        const worldLayer = map.createStaticLayer("W", tileset, 0, 0);
        const waterOverlap = map.createFromObjects("Overlap", 'fish');

        waterLayer.setCollisionByProperty({ collides: true });
        worldLayer.setCollisionByProperty({ collides: true });
        
        // this.waterAreas = this.physics.add.group();
        this.waterZone = this.createNewZone(0, 0, 70, 900);
        this.waterZone2 = this.createNewZone(230, 180, 100, 180);

        this.homeZone = this.createNewZone(120, 60, 60, 50);        
        this.shopZone = this.createNewZone(380, 420, 120, 80);        
        this.baitShopZone = this.createNewZone(180, 300, 60, 40);        
        this.dogZone = this.createNewZone(this.doggo.x - 32, this.doggo.y - 20, 50, 50);        
        this.caveEntrance = this.createNewZone(350, 180, 20, 16);        
        // this.waterAreas.addMultiple([this.waterZone, this.waterZone2]) ;
        
        this.baitShopKeeper = this.physics.add.sprite(this.baitShopZone.x + (this.baitShopZone.width / 2 - 10), this.baitShopZone.y + 20, 'claris', 9); 
        this.baitShopKeeper.body.moves = false;
        this.baitShopKeeper.body.setCircle(25);        
        this.baitShopKeeper.setScale(0.4); 
        this.baitShopKeeper.setDepth(2); 
        this.physics.add.collider(this.player, this.baitShopKeeper);  

        this.shopKeeper = this.physics.add.sprite(this.shopZone.x + (this.shopZone.width / 2 - 10), this.shopZone.y + 20, 'shopKeeper', 8); 
        this.sign = this.add.sprite(this.shopKeeper.x + 30, this.shopZone.y + 40, 'fishSign');
        this.sign.displayHeight = 24;
        this.sign.displayWidth = 24;

        this.shopKeeper.body.moves = false;
        this.shopKeeper.body.setCircle(25);        
        this.shopKeeper.setScale(0.5); 
        this.shopKeeper.setDepth(2); 
        this.physics.add.collider(this.player, this.shopKeeper);  
        this.physics.add.collider(this.player, this.doggo, () => this.doggo.bumpCount += 1); 

        this.physics.add.overlap(this.player, this.waterZone, () => { this.isFishing = true; this.canShop = false; this.canSleep = false; this.hasInteractedWithDog = false; this.canBuyBait = false});            
        this.physics.add.overlap(this.player, this.waterZone2, () => { this.isFishing = true; this.canShop = false; this.canSleep = false; this.hasInteractedWithDog = false;});            
        this.physics.add.overlap(this.player, this.homeZone, () => { this.isSleeping = true; this.canShop = false; this.canFish = false; this.hasInteractedWithDog = false; this.canBuyBait = false});            
        this.physics.add.overlap(this.player, this.shopZone, () => { this.isShopping = true; this.canSleep = false; this.canFish = false; this.hasInteractedWithDog = false; this.canBuyBait = false});            
        this.physics.add.overlap(this.player, this.baitShopZone, () => { this.isShoppingForBait = true; this.canShop = false; this.canSleep = false; this.canFish = false; this.hasInteractedWithDog = false});            
        this.physics.add.overlap(this.player, this.dogZone, () => { this.hasInteractedWithDog = true; this.canSleep = false; this.canShop = false; this.canFish = false; this.canBuyBait = false});            
        
        this.physics.add.overlap(this.player, this.caveEntrance, () => { this.scene.pause(); this.scene.start('InteriorScene')});            
        
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, this.game.width, this.game.height);
        this.cameras.main.setFollowOffset(-50, -30);
        this.cameras.main.zoom = 4;
        this.physics.add.collider(this.player, worldLayer);
        this.physics.add.collider(this.doggo, worldLayer, () => this.doggo.bumpCount += 1);
        this.physics.add.collider(this.player, waterLayer, () => this.doggo.bumpCount += 1);           
        this.physics.add.collider(this.doggo, waterLayer);           
        this.events.emit('updateUI', this.playerInfo);               
        
        this.catchesRemaining = this.playerInfo.catchesRemainingForTheDay 
        this.cash = this.playerInfo.cash 
        this.totalFish = this.playerInventory.fish.length

        this.shopObj = new Shop();
        this.canFish = true;
        this.canShop = true;
        this.canBuyBait = true;
        this.canSleep = true;                             
        this.hasInteractedWithDog = false;  
        
        this.hasFished = false;
        this.outOfCatchAttempts = false; 
        this.isTalking = false;

        this.events.on('pauseGame', () => {
            // this.scene.pause();
            this.events.emit('showLevelUpPopup', this.player.info.level);              
            // this.time.delayedCall(4000, () => {
            //     this.scene.resume();  
            // });
        });

        this.input.keyboard.on('keydown_A', function (event) {
            console.log('Hello from the A Key!');
        }); 
                
    }  
    
    createEmote(emoteName, character) {
        let emote = this.physics.add.sprite(character.x, character.y - 20, emoteName);                    
        emote.setDepth(1);     
        this.time.delayedCall(500, () => {
            emote.destroy();
            this.hasInteractedWithDog = false;
        });                        
    }

    spawnCoin(player) {        
        let coin = this.physics.add.sprite(player.x, player.y - 20, 'goldCoin', 2);         
        this.anims.create({
            key: 'spinning',
            frames: this.anims.generateFrameNumbers('goldCoin', { start: 0, end: 7
        }),
            frameRate: 10,
            repeat: -1
        });

        coin.setDepth(1); 
        coin.setScale(0.5); 
        coin.anims.play('spinning');   
        this.time.delayedCall(1500, () => {
            coin.destroy();
        });   
    }

    update() {  
                         
        this.player.update();   
        this.playerDirection = this.player.facing;   
        this.doggo.update();

        // this.playerText.x = this.player.x;
        // this.playerText.y = this.player.y - 30;
        
        this.events.on('resetDay', () => this.playerInfo.timeOfDay = 1); 

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
            this.canBuyBait = true;
            this.isShoppingForBait = false;          
            this.hasInteracted = false;                 
        }

        if (this.hasInteractedWithDog) {  
            this.createEmote('heart', this.doggo);
            this.doggo.anims.play('idle-happy', true); 
        } else {
            this.doggo.anims.play('idle', true); 
        }

        if (this.canSleep) {  
            if (touching && wasTouching) {        
                // this.events.emit('showUIPopup', "Do you want to turn in for the day?");                                                                      
                if (this.keySpace.isDown) {
                    
                    // this.player.anims.stop();                                       
                    // this.events.emit('createInteractiveSleepPanel', this.player);  
                    // this.toggleKeyboard(false);   
                    this.toggleKeyboard(true);                                 
                    this.player.sleep(true);    
                    this.events.emit('updateUI', this.playerInfo);                                      
                }
            }
        } 
        
        if (this.canBuyBait && this.playerInfo.cash !== 0) {   
            if (touching && wasTouching) {
                this.createEmote('cash', this.baitShopKeeper);                                                
                if (this.keySpace.isDown) {    
                    this.events.emit('showDialoguePopup', ['claris', this.player.chapter]);  
                    // this.events.emit('moveOnText'); 
                    this.keySpace.reset();                                                                                               
                        // this.events.emit('moveOnText');
                        // this.events.emit('showUIPopup', "You bought some more bait!");                          
                        // this.playerInfo.catchesRemainingForTheDay += 1;
                        // this.playerInfo.cash -= 10;
                        // this.events.emit('updateUI', this.playerInfo);  
                }
            }
        }
        
        if (this.player.info.catchesRemainingForTheDay >= 0 && this.canFish) {             
            if (this.cooldown > 0) {                            
                this.fishingtimer.paused = false;             
            } else if (this.cooldown === 0) {                                
                this.fishingtimer.paused = true;  
                if (touching && wasTouching) {   

                    if (this.outOfCatchAttempts) {
                        this.events.emit('showUIPopup', "You're all fished out for the day!");
                        return;
                    }
                    this.player.anims.play('idle-fishing');
                    
                    if (!this.hasFished) {
                        this.hasFished = true;
                        this.events.emit('showUIPopup', "Press space to cast your rod");
                    }                                                    
                    if (this.keySpace.isDown) {                                                                               
                        this.events.emit('updateUI', this.playerInfo);  
                        this.events.emit('showUIPopup', "You cast your rod out into the water...");                                                  
                        this.toggleKeyboard(false);  
             
                        if (this.playerDirection === 'left') {
                            this.player.anims.playReverse('fish-left');
                        } else if (this.playerDirection === 'right') {
                            this.player.anims.play('fish-right');
                        }  
                        
                        this.time.delayedCall(3900, () => {                                                         
                            this.player.anims.play('fish-left');   
                        });

                        this.fishingtimer.paused = false;                                                                                         
                        this.player.fishing(this.fishingObj.getRandomFish(), this.playerDirection);                                                                        
                        this.events.on('fishBit', () => {
                            this.createEmote('exclamation', this.player);                                 
                        });                                    

                        this.events.on('fishCaught', () => {                            
                            this.toggleKeyboard(true);                                                          
                        }) 
                        this.events.emit('updateUI', this.playerInfo);                                                   
                        this.cooldown = this.FISHING_COOLDOWN_DELAY;   
                    }      
                    
                    if (this.player.info.catchesRemainingForTheDay === 0){            
                        this.outOfCatchAttempts = true;           
                    }
                }                                                                                              
            } 
        } 
                
        if (this.canShop && this.playerInventory.fish.length > 0) {                                              
            if (this.keySpace.isDown) {                    
                if (touching && wasTouching) {                         
                        this.events.emit('updateUI', this.playerInfo);                         
                        // this.player.anims.stop();                                                                                                                                               
                        this.shopObj.sellAllFish(this.player);  
                        this.spawnCoin(this.player);                          
                        this.events.emit('showUIPopup', `You sold all your fish! And made a total of $${this.shopObj.getTotalOfSale()}`);   
                        this.playerInventory.fish.length = 0;      
                        this.events.emit('updateUI', this.playerInfo);                                                          
                }
            }                   
        } 
                
        if (this.keyW.isDown || this.cursors.up.isDown ) {
            this.player.moveUp();
            this.player.anims.play('up', true);               
        } else if (this.keyS.isDown || this.cursors.down.isDown) {
            this.player.moveDown();
            this.player.anims.play('down', true);
        } else if (this.keyA.isDown || this.cursors.left.isDown) {
            this.player.moveLeft();           

            this.player.anims.play('left', true);
        } else if (this.keyD.isDown || this.cursors.right.isDown) {
            this.player.moveRight();
            this.player.anims.play('right', true);
        } else {            
            // this.player.anims.stop();                                   
        }
        
        this.player.body.velocity.normalize().scale(this.player.getData("speed"));
        this.doggo.body.velocity.normalize().scale(this.doggo.getData("speed"));
    }
}