import { Scene } from 'phaser';
import Player from "../Sprites/Player";
import Shop from '../Classes/Shop';
import Fishing from '../Classes/Fishing';
import Dog from '../Sprites/Dog';
import Enemy from '../Sprites/Enemy';
import Npc from '../Sprites/Npc';

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
        this.rodList = this.cache.json.get('rodList').rod.type;
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
        
        // torch light for player
        this.lampShape = this.make.graphics({ 
            fillStyle: { color: 0x000000 }, add: false})
            .fillCircleShape(new Phaser.Geom.Circle(this.player.x, this.player.y, 20));
        this.lampShape.alpha = 0.5;
        
        this.doggo = new Dog(
            this,
            210,
            200,
            "doggo"            
        );
                                       
        // this.doggo.anims.play('walk-right', true);
        // this.doggo.moveRight();
        this.doggo.anims.play('idle', true);
        this.doggo.createTalkingCollider(this.player);
                        
        // Load map
        const map = this.make.tilemap({ key: "main-world" });
        const tileset = map.addTilesetImage("overworld", "tiles");

        const waterLayer = map.createStaticLayer("Water", tileset, 0, 0);        

        const belowLayer = map.createStaticLayer("BelowPlayer", tileset, 0, 0);        
        const worldLayer = map.createStaticLayer("World", tileset, 0, 0);

        waterLayer.setCollisionByProperty({ collides: true });
        worldLayer.setCollisionByProperty({ collides: true });
        
        this.waterZone = this.createNewZone(0, 0, 70, 900);
        this.waterZone2 = this.createNewZone(230, 180, 100, 180);

        this.homeZone = this.createNewZone(120, 60, 60, 50);        
        this.shopZone = this.createNewZone(380, 420, 120, 80);        
        // this.baitShopZone = this.createNewZone(180, 300, 60, 40);        
        this.dogZone = this.createNewZone(this.doggo.x - 32, this.doggo.y - 20, 50, 50);        
        this.caveEntrance = this.createNewZone(350, 180, 20, 16);        
        // this.npcZone = this.createNewZone(120, 180, 50, 50);  
        // this.npcZone.setName('cultist');            
        
        this.baitShopKeeper = this.createNewNpc(180, 300, 'claris', 'Claris');
        this.baitShopKeeper.setFrame(9);        
        // this.physics.add.collider(this.player, this.baitShopKeeper);  
        this.baitShopKeeper.createTalkingCollider(this.player);

        this.shopKeeper = this.createNewNpc(this.shopZone.x + (this.shopZone.width / 2 - 10), this.shopZone.y + 20, 'shopKeeper', 'Xaven');         
        this.shopKeeper.setFrame(8);     

        this.shopKeeper.createTalkingCollider(this.player);

        this.sign = this.add.sprite(this.shopKeeper.x + 30, this.shopZone.y + 40, 'fishSign');
        this.sign.displayHeight = 24;
        this.sign.displayWidth = 24;

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
        // this.physics.add.overlap(this.player, this.baitShopZone, () => { 
        //     this.resetCurrentActivity();
        //     this.canBuyBait = true;
        // });            
        this.physics.add.overlap(this.player, this.dogZone, () => { 
            this.resetCurrentActivity();
            this.hasInteractedWithDog = true;
        });            
                
        this.physics.add.overlap(this.player, this.caveEntrance, () => { 
            this.scene.pause(); 
            this.scene.start('InteriorScene');
        });   
                            
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, this.game.width, this.game.height);
        this.cameras.main.setFollowOffset(-50, -30);
        this.cameras.main.zoom = 4;
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

        this.events.on('pauseGame', () => {
            // this.scene.pause();
            this.events.emit('showLevelUpPopup', this.player.info.level);              
            // this.time.delayedCall(4000, () => {
            //     this.scene.resume();  
            // });
        });

        this.input.keyboard.on('keydown_SPACE', function (event) {   
            console.log('space hit!');         
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
            this.cultist = this.createNewNpc(120, 180, 'cultist', 'Cultist'); 
            this.cultist.setFrame(7);     
            this.cultist.setActive(visible).setVisible(visible);
            this.cultist.createTalkingCollider(this.player);
        } else {
            this.cultist ? this.cultist.destroy() : null;
        }
    }

    createOrDestroyEnemies(visible) {

        let slimePositions = [
            [219, 268], 
            [255, 513],        
            [100, 400],         
            [510, 574],         
            [200, 644] 
        ];
                
        if (visible) {                          
            for (let i = 0; i < slimePositions.length; i += 1) {
                let x = slimePositions[i][0];                
                let y = slimePositions[i][1];                
                  
                this.enemies.add(this.spawnEnemy(x, y));
            }
        } else {
            this.enemies.children.iterate(function (child) {
                child.setActive(false).setVisible(false);
                child.body.enable = false;
            });

            this.enemies.clear(true);            
        }          
    }

    spawnEnemy(x, y) {        
            let slime = new Enemy(
                this,
                x,
                y,
                "slime"
            );
                               
            slime.anims.play('moving');
            let tween = this.tweens.add({
                targets: slime,
                x: slime.x + 20,
                ease: 'Power1',
                duration: 3000,
                flipX: true,
                yoyo: true,
                repeat: -1
            });

            this.physics.add.collider(this.player, slime, () => { 
                this.events.emit('showUIPopup', "The monster knocked you out...");   
                this.player.monsterAttack();  
                console.log('opps!');              
            });   

            return slime;
    }


    createNewNpc(x, y, key, name) {
        return new Npc(
            this,
            x,
            y,
            key, 
            name
        );
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
        }

        if (this.hasInteractedWithDog) {  
            this.createEmote('heart', this.doggo);
            this.doggo.anims.play('idle-happy', true); 
        } else {
            this.doggo.anims.play('idle', true); 
        }

        // if (this.canInteract) {
        //     if (touching && wasTouching) {                
        //         if (this.keySpace.isDown) {                   
        //             this.cultist.talking();
        //         }
        //     }
        // }

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
        
        if (this.canBuyBait && this.playerInfo.cash !== 0) {   
            if (touching && wasTouching) {
                this.baitShopKeeper.createEmote('cash');                                                
                if (this.keySpace.isDown) {    
                    // this.events.emit('showDialoguePopup', ['claris', this.player.chapter]);  
                    this.baitShopKeeper.talking();
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
                        this.player.fishing(this.fishingObj.getRandomFish(this.player), this.playerDirection);                                                                        
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
                    this.spawnCoin(this.player);                          
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