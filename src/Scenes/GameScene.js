import { Scene } from 'phaser';
import Player from "../Sprites/Player";
import Shop from '../Classes/Shop';
import SceneHelper from '../Classes/SceneHelper';
import Fishing from '../Classes/Fishing';
import Dog from '../Sprites/Dog';
import Enemy from '../Sprites/Enemy';

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
        this.sceneHelper.triggerUIUpdate(this.playerInfo);    
    }

    createNewTimer(delay, func) {
        return this.time.addEvent({
            delay: this.second * delay,
            callback: func,
            callbackScope: this,
            loop: true
        });
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
        // set up timer for day clock     
        let dayLengthInMinutes = 3; //3
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
        console.log(fishList)
        this.rodList = this.cache.json.get('rodList').rod.type;
        this.fishingObj = new Fishing(fishList);
        this.conversations = this.cache.json.get('conversations');
                
        // Setup input keys                                             
        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.cursors = this.input.keyboard.createCursorKeys();            
        this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.keys = {
            'w': this.keyW, 
            's': this.keyS, 
            'a': this.keyA, 
            'd': this.keyD, 
            'cursors': this.cursors, 
            'e': this.keyE, 
            'space': this.keySpace
        };
        
        const {w, s, a, d, cursors, e, space } = this.keys;

        // Activities
        this.canFish = true;
        this.canShop = true;
        this.canBuyBait = true;
        this.canSleep = true;                             
        this.hasInteractedWithDog = false;          
        this.hasFished = false;
        this.outOfCatchAttempts = false; 
        this.isTalking = false;                

        this.player = new Player(
            this,            
            150,
            210,
            "sprPlayer",
            this.keys
        );
        
        this.playerInfo = this.player.getInfo();
        this.playerInventory = this.player.getInventory();  
        
        // sceneHelper class
        this.sceneHelper = new SceneHelper(this);
        this.sceneHelper.setup();
              
        // torch light for player
        this.lampShape = this.make.graphics({ 
            fillStyle: { color: 0x000000 }, add: false})
            .fillCircleShape(new Phaser.Geom.Circle(this.player.x, this.player.y, 20));
        this.lampShape.alpha = 0.5;
        
        // Start game event
        this.events.emit('startGame', this.playerInfo);      
        // Load map
        const map = this.make.tilemap({ key: "main-world" });
        const tileset = map.addTilesetImage("overworld", "tiles");

        const waterLayer = map.createStaticLayer("Water", tileset, 0, 0);        

        const belowLayer = map.createStaticLayer("BelowPlayer", tileset, 0, 0);        
        const worldLayer = map.createStaticLayer("World", tileset, 0, 0);

        waterLayer.setCollisionByProperty({ collides: true });
        worldLayer.setCollisionByProperty({ collides: true });
        
        this.waterZone = this.sceneHelper.createNewZone(0, 0, 70, 900);
        this.waterZone2 = this.sceneHelper.createNewZone(230, 180, 100, 180);

        this.homeZone = this.sceneHelper.createNewZone(120, 60, 60, 50);
        this.shopZone = this.sceneHelper.createNewZone(380, 420, 120, 80);                        
        this.caveEntrance = this.sceneHelper.createNewZone(350, 180, 20, 16);        
                            
        this.shopKeeper = this.sceneHelper.createNewNpc(this.shopZone.x + (this.shopZone.width / 2 - 10), this.shopZone.y + 20, 'shopKeeper', 'Xaven');         
        this.shopKeeper.setFrame(8);     

        this.sign = this.add.sprite(this.shopKeeper.x + 30, this.shopZone.y + 40, 'fishSign');
        this.sign.displayHeight = 24;
        this.sign.displayWidth = 24;
        
        this.doggo = new Dog(
            this,
            210,
            200,
            "Doggo"            
        );
                                       
        // this.doggo.anims.play('walk-right', true);
        // this.doggo.moveRight();
        this.doggo.anims.play('idle', true);        
        
        this.dogZone = this.sceneHelper.createNewZone(this.doggo.x - 32, this.doggo.y - 20, 50, 50); 
         
        this.baitShopKeeper = this.sceneHelper.createNewNpc(180, 300, 'claris', 'Claris');
        this.baitShopKeeper.setFrame(9);    
        this.baitShopKeeper.setDepth(1);             
        this.baitShopKeeper.zone.name = this.baitShopKeeper.name;
        
        this.cultist = this.sceneHelper.createNewNpc(120, 180, 'cultist', 'Cultist'); 
        this.cultist.setFrame(7);            
        this.cultist.body.enable = false;

        this.physics.add.overlap(this.player, this.baitShopKeeper.zone, () => { 
            this.resetCurrentActivity(this.baitShopKeeper.zone);
            this.getAndSetZoneAndNpc(this.baitShopKeeper, this.baitShopKeeper.zone)            
        }); 

        this.physics.add.overlap(this.player, this.cultist.zone, () => { 
            this.resetCurrentActivity();
            this.getAndSetZoneAndNpc(this.cultist, this.cultist.zone)                  
        }); 

        this.physics.add.overlap(this.player, this.doggo.zone, () => { 
            this.resetCurrentActivity();
            this.getAndSetZoneAndNpc(this.doggo, this.doggo.zone)                  
        }); 

        this.physics.add.collider(this.player, this.shopKeeper);  
        this.physics.add.collider(this.player, this.doggo, () => this.doggo.bumpCount += 1);                      
        
        this.physics.add.overlap(this.player, this.waterZone, () => { 
            this.resetCurrentActivity();
            this.canFish = true;
        });            
        this.physics.add.overlap(this.player, this.waterZone2, () => { 
            this.resetCurrentActivity();
            this.canFish = true;
        });            
        this.physics.add.overlap(this.player, this.homeZone, () => { 
            this.resetCurrentActivity();
            this.canSleep = true;
        });            
        this.physics.add.overlap(this.player, this.shopZone, () => { 
            this.resetCurrentActivity();
            this.canShop = true;
        });            
                   
        this.physics.add.overlap(this.player, this.dogZone, () => { 
            this.resetCurrentActivity();
            this.hasInteractedWithDog = true;
        });            
                
        this.physics.add.overlap(this.player, this.caveEntrance, () => { 
            this.scene.pause(); 
            this.scene.start('InteriorScene');
        });   
        
        this.physics.add.collider(this.player, worldLayer);        
        // this.physics.add.collider(this.doggo, worldLayer, () => this.doggo.bumpCount += 1);
        // this.physics.add.collider(this.doggo, waterLayer);        
        this.physics.add.collider(this.player, waterLayer, () => this.doggo.bumpCount += 1);                      
        this.events.emit('updateUI', this.playerInfo);               
        
        this.catchesRemaining = this.playerInfo.catchesRemainingForTheDay 
        this.cash = this.playerInfo.cash 
        this.totalFish = this.playerInventory.fish.length

        this.shopObj = new Shop();        
        this.night = false;

        this.npcInteractedWith = "";
        this.isInteractingWithNpc = false;
        this.currentZone = "";

        this.events.on('pauseGame', () => {
            // this.scene.pause();
            this.events.emit('showLevelUpPopup', this.player.info.level);              
            // this.time.delayedCall(4000, () => {
            //     this.scene.resume();  
            // });
        });

        this.sky = this.add.image(0, 0, 'nightSky').setAlpha(0);
        this.sky.setDepth(1)
        this.sky.setScale(2);        
        this.mask = this.lampShape.createGeometryMask();
        this.mask.invertAlpha = true;  
        this.sky.setMask(this.mask);        

        this.enemies = this.physics.add.group();

        this.events.on('nightTime', () => {                                  
            this.tweens.add({
                targets: this.sky,
                alphaTopLeft: { value: 0.9, duration: 10000, ease: 'Power1' },
                alphaTopRight: { value: 0.9, duration: 10000, ease: 'Power1' },
                alphaBottomRight: { value: 0.9, duration: 10000, ease: 'Power1' },
                alphaBottomLeft: { value: 0.9, duration: 10000, ease: 'Power1'},
                hold: 50000,
                // yoyo: true,
                // repeat: 0,

            });
            this.nightTime();
        });  
        
        this.events.on('resetDay', ((time) => {
            this.playerInfo.timeOfDay = time;
        }));

        this.events.on('dayTime', () => {
            this.playerInfo.timeOfDay = 7;
            this.dayTime();
            this.tweens.add({
                targets: this.sky,
                alphaTopLeft: { value: 0, duration: 2000, ease: 'Power1' },
                alphaTopRight: { value: 0, duration: 2000, ease: 'Power1' },
                alphaBottomRight: { value: 0, duration: 2000, ease: 'Power1' },
                alphaBottomLeft: { value: 0, duration: 2000, ease: 'Power1'},
                hold: 50000,
                // yoyo: true,
                // repeat: 0,
            });
        });                
    }  
    
    getAndSetZoneAndNpc(npc, zone) {
        this.isInteractingWithNpc = true;
        this.npcInteractedWith = npc;
        this.currentZone = zone;        
    }

    resetCurrentActivity() { 
        this.canShop = false; 
        this.canSleep = false; 
        this.canFish = false;
        this.canBuyBait = false;    
        this.hasInteractedWithDog = false; 
        this.canInteract = false;                                                     
    }

    createEmote(emoteName, character) {
        let emote = this.physics.add.sprite(character.x, character.y - 20, emoteName);                    
        emote.setDepth(1);     
        this.time.delayedCall(500, () => {
            emote.destroy();
            this.hasInteractedWithDog = false;
        });                        
    }

    nightTime() {
        this.night = true; 
        this.toggleCultist(true); 
        this.createOrDestroyEnemies(true);          
    }
    
    dayTime() {
        this.night = false;  
        this.toggleCultist(false);   
        this.createOrDestroyEnemies();             
    }
    
    toggleCultist(visible) {
        // only appears at night, warns you of monsters
        if (visible) {            
           this.cultist.body.enable = true;
        } else {
            this.cultist.body.enable = false;
        }
    }

    createOrDestroyEnemies(visible) {

        let enemyPositions = [
            [219, 268], 
            [255, 513],        
            [100, 400],         
            [510, 574],         
            [200, 644] 
        ];
                
        if (visible) {                          
            for (let i = 0; i < enemyPositions.length; i += 1) {
                let x = enemyPositions[i][0];                
                let y = enemyPositions[i][1];                
                  
                this.enemies.add(this.sceneHelper.spawnEnemy(x, y, 'slime', this.player));
            }
        } else {
            this.enemies.children.iterate(function (child) {
                child.setActive(false).setVisible(false);
                child.body.enable = false;
            });

            this.enemies.clear(true);            
        }          
    }
    
    update() {  
                     
        this.player.update();   
        this.playerDirection = this.player.facing;   
        this.doggo.update();
                
        this.lampShape.x = this.player.x - 150;      
        this.lampShape.y = this.player.y - 210;      
               
        if (this.player.body.embedded) this.player.body.touching.none = false;
        let touching = !this.player.body.touching.none;
        let wasTouching = !this.player.body.wasTouching.none;
        
        if (touching && !wasTouching) { 
        
        // when player leaves zone any activity can be started
        } else if (!touching && wasTouching) { 
            this.canShop = true; 
            this.canFish = true;                 
            this.canSleep = true;       
            this.canBuyBait = true;      
            this.hasInteractedWithDog = false;                                
            this.canInteract = true;      
            this.isInteractingWithNpc = false;  
            this.npcInteractedWith = null;        
        }

        if (this.hasInteractedWithDog) {  
            this.createEmote('heart', this.doggo);
            this.doggo.anims.play('idle-happy', true); 
        } else {
            this.doggo.anims.play('idle', true); 
        }

        if (touching && wasTouching) {
            if (this.isInteractingWithNpc) {
                if (this.keySpace.isDown) {
                    this.npcInteractedWith.talking();
                    this.keySpace.reset();  
                    if (this.keySpace.isDown) {
                        this.npcInteractedWith.currentTextIndex += 1;
                        this.npcInteractedWith.talking();  
                    }
                }
            }  
        }
 
        if (this.canSleep) {  
            if (touching && wasTouching) {        
                // this.events.emit('showUIPopup', "Do you want to turn in for the day?");                                                                      
                if (this.keySpace.isDown) {
                                                 
                    // this.events.emit('createInteractiveSleepPanel', this.player);  
                    // this.toggleKeyboard(false);   
                    this.toggleKeyboard(true);                                 
                    this.player.sleep(true);    
                    this.events.emit('updateUI', this.playerInfo);     
                    this.events.emit('endOfDay');                                   
                }
            }
        } 
        
        // if (this.canBuyBait && this.playerInfo.cash !== 0) {   
        //     if (touching && wasTouching) {
        //         this.baitShopKeeper.createEmote('cash');                                                
                // if (this.keySpace.isDown) {    
                    // this.events.emit('showDialoguePopup', ['claris', this.player.chapter]);  
                    // this.baitShopKeeper.isTalking = true;
                    // this.events.emit('moveOnText'); 
                    // this.keySpace.reset();                                                                                               
                        // this.events.emit('moveOnText');
                        // this.events.emit('showUIPopup', "You bought some more bait!");                          
                        // this.playerInfo.catchesRemainingForTheDay += 1;
                        // this.playerInfo.cash -= 10;
                        // this.events.emit('updateUI', this.playerInfo);  
        //         }
        //     }
        // }
        
        if (this.player.info.catchesRemainingForTheDay >= 0 && this.canFish) {             
            if (this.cooldown > 0) {                            
                this.fishingtimer.paused = false;             
            } else if (this.cooldown === 0) {                                
                this.fishingtimer.paused = true;  
                if (touching && wasTouching) {   
                    
                    // if (this.outOfCatchAttempts) {
                    //     this.events.emit('showUIPopup', "You're all fished out for the day!");
                    //     return;
                    // }                    
                                    
                    if (!this.hasFished) {
                        this.hasFished = true;
                        // this.events.emit('showUIPopup', "Press space to cast your rod");
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
                        this.player.fishing(this.fishingObj.getRandomFishRarity(this.player), this.playerDirection);                                                                        
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
            if (touching && wasTouching) {   
                this.shopKeeper.createEmote('cash');                                                  
                if (this.keySpace.isDown) {                                                 
                    this.events.emit('updateUI', this.playerInfo);                                                                                                                                                                      
                    this.shopObj.sellAllFish(this.player);  
                    this.sceneHelper.spawnCoin('gold', this.player);                          
                    this.events.emit('showUIPopup', `You sold all your fish! And made a total of $${this.shopObj.getTotalOfSale()}`);   
                    this.playerInventory.fish.length = 0;      
                    this.events.emit('updateUI', this.playerInfo);                                                          
                }
            }                   
        } 
                
        this.player.body.velocity.normalize().scale(this.player.getData("speed"));
        this.doggo.body.velocity.normalize().scale(this.doggo.getData("speed"));
    }
}