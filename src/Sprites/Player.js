import Entity from './Entity';
import Bobble from './Bobble';
import Game from '../Scenes/GameScene'
import Level from '../Classes/Level';
import Rod from '../Classes/Rod';

export default class Player extends Entity {
        
    constructor(scene, x, y, key, keys, selectedClass) {        
        super(scene, x, y, key, "Player");
        
        this.keys = keys;
        this.selectedClass = selectedClass;

        this.setData("speed", 100);
        this.setData("isFishing", false);
        this.setData("timerFishingDelay", 5000);
        this.body.moves = true;  
        this.setDepth(1);
        
        let startingRod = this.scene.rodList[0];
        // load starting rod 
        let rod = new Rod(startingRod);
        // check to see if there is a better rod equipped

        /* The player object */        
        this.info = {
            name: "TommyCakes",
            level: 1,    
            class: this.selectedClass,
            // for testing...
            catchesRemainingForTheDay: 100, //rod.maxCatchAttempts,
            cash: 10,
            rarestFishCaught: "",
            level: 0,
            xpPool: 0,
            chapter: 1,
            // build day / month / time class
            timeOfDay: 8,
            maximumAmountOfFishHeld: 5,
            dayOfTheWeek: 'Mon',
            inventory: {
                fish: [
                    {name: "Seabass", description: "Just your standard sea-dweller, like to be called Baz for short", weight: "3", value: "18", rarity: "uncommon"}

                ],
                rods: [
                    rod
                ],
                baits: [
            
                ], 
                weapons: [
            
                ],
                outfits: [
                    
                ]
            },
            passiveSkills: {
                catchRateIncrease: 0,
                saleIncrease: 0,
                xpBoostIncrease: 0,
            }            
        }        
        this.getStartingSkillFrom(this.info.class);
        this.fishCatchChance = (this.info.inventory.rods[0].chanceToLandFish + this.info.passiveSkills.catchRateIncrease);

        this.facing = "";
        this.isFishing = false;

        this.level = new Level(this.scene, this);

        // let savedGame = localStorage.getItem('save') ? this.info = this.loadGame() : this.info;
        this.setDepth(1);
        let style = { font: '20px Arial', fill: '#fff' }         
        this.infoText = this.scene.add.text(100, 360, "", style); 
     
        this.scene.anims.create({
            key: 'left',
            frames: this.scene.anims.generateFrameNumbers('sprPlayer', { start: 10, end: 11
        }),
            frameRate: 10,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'up',
            frames: this.scene.anims.generateFrameNumbers('sprPlayer', { start: 0, end: 2
        }),
            frameRate: 10,
            repeat: -1
        });

        // this.scene.anims.create({
        //     key: 'idle-fishing',
        //     frames: [ { key: 'sprPlayer', frame: 9} ],
        //     framerate: 20
        // });

        this.scene.anims.create({
            key: 'fish-right',
            frames: this.scene.anims.generateFrameNumbers('sprPlayer', { start: 12, end: 14
        }),
            frameRate: 15,
            repeat: 0
        });
        
        this.scene.anims.create({
            key: 'fish-left',
            frames: this.scene.anims.generateFrameNumbers('sprPlayer', { start: 15, end: 17
        }),
            frameRate: 15,
            repeat: 0
        });
                
        this.scene.anims.create({
            key: 'down',
            frames: this.scene.anims.generateFrameNumbers('sprPlayer', { start: 6, end: 8
        }),
            frameRate: 10,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'right',
            frames: this.scene.anims.generateFrameNumbers('sprPlayer', { start: 3, end: 5
        }),
            frameRate: 10,
            repeat: -1
        });     

        this.scene.anims.create({
            key: 'idle-up',
            frames: [ { key: 'sprPlayer', frame: 0} ],
            frameRate: 10,
        });

        this.scene.anims.create({
            key: 'idle-down',
            frames: [ { key: 'sprPlayer', frame: 6} ],
            frameRate: 10,
        });

        this.scene.anims.create({
            key: 'idle-left',
            frames: [ { key: 'sprPlayer', frame: 10} ],
            frameRate: 10,
        });

        this.scene.anims.create({
            key: 'idle-right',
            frames: [ { key: 'sprPlayer', frame: 4} ],
            frameRate: 10,
        });
                
        this.setScale(0.4);     
        this.body.setCircle(16, 16);
        this.body.setOffset(16, 16);
        console.log(this.getInfo());
    }
    
    getStartingSkillFrom(choice) {  
        let startingSkill;
        switch (choice) {
            case "The Ranger":
                startingSkill = "catchRateUp";
                break;
            case "The Bargain Hunter":                
                startingSkill = "sellPriceUp";
                break;
            case "The Student":                
                startingSkill = "expGainedUp";
                break;
        }        
        this.setStartingSkill(startingSkill);        
    }

    setStartingSkill(skill) {
        switch (skill) {
            case "catchRateUp":
                this.info.passiveSkills.catchRateIncrease = 5;
                break;
            case "sellPriceUp":
                this.info.passiveSkills.saleIncrease = 25;
                break;
            case "expGainedUp":
                this.info.passiveSkills.xpBoostIncrease = 20;
                break;
        }
    }

    getPercentageOfSkill(skill) {
        return skill / 100;
    }

    getInfo() {
        return this.info;
    }

    getInventory() {
        return this.info.inventory;
    }

    moveUp() {
        this.body.velocity.y = -this.getData("speed");
        this.facing = 'up';
    }

    moveDown() {
        this.body.velocity.y = this.getData("speed");
        this.facing = 'down';
    }

    moveLeft() {
        this.body.velocity.x = -this.getData("speed");
        this.facing = 'left';
    }

    moveRight() {
        this.body.velocity.x = this.getData("speed");
        this.facing = 'right';
    }

    stop() {
        this.body.velocity.x = 0;
    }

    getRandomIntBetween(max) {
        return Math.floor(Math.random() * max);
    }
    
    getFishCatchChance() {
        console.log(`Your chance is currently : ${this.fishCatchChance}`);
        return this.fishCatchChance;
    }

    checkForFish() {
        let rdmNum = this.getRandomIntBetween(101);
        let fishCaught = false;
        
        if (rdmNum <= this.getFishCatchChance()) { 
            fishCaught = true;
        } else {
            fishCaught = false;
        }

        this.bobble.destroy();
        this.spawnSplash();
        return fishCaught;
    }
        
    collectFish(fish) {   
        
        if (this.checkForFish()) {    
            let skills = this.info.passiveSkills;
            let amountOfXP = fish.checkExpReturnedForCatch();
            // add multiplier to fish xp and price
            amountOfXP += Math.round(fish.checkExpReturnedForCatch() * (this.getPercentageOfSkill(skills.xpBoostIncrease)));            
            fish.value +=  Math.round(fish.value * this.getPercentageOfSkill(skills. saleIncrease));

            this.info.inventory.fish.push(fish);               
            this.info.xpPool += amountOfXP;          
            this.scene.events.emit('showFishUIPopup', fish);   
            
            this.scene.events.emit('updateUI', this.info);  

            if (!this.level.checkForLevelUp()) {
                this.level.showExperienceText(fish); 
            }
        } else {
            this.scene.events.emit('showUIPopup', "Unlucky your line came up empty...");           
        }        

        this.isFishing = false;

        console.log(this.info);                
        // this.scene.time.delayedCall(100, () => {             
            // this.splash.destroy();
            this.scene.events.emit('fishCaught')
        // }, [], this);                                                                                                                   
    }
    
    spawnBobble(direction) {
        this.scene.time.delayedCall(this.getData("timerFishingDelay") - 1500, () => this.scene.events.emit('fishBit'));  
        if (direction === 'left') {
            this.xPos = this.x - 36;
        } else {
            this.xPos = this.x + 36;
        }

        this.bobble = this.scene.add.sprite(this.xPos, this.y, 'fishingBobble');                                         
        this.bobble.visible = true; 
        this.scene.anims.create({
            key: 'bob',
            frames: this.scene.anims.generateFrameNumbers('fishingBobble', { start: 1, end: 4
            }),
                frameRate: 4,
                repeat: -1
        });
        this.bobble.anims.play('bob', true);
    }

    spawnSplash() {
        this.splash = this.scene.add.sprite(this.bobble.x, this.bobble.y, 'splash');                                         
        this.splash.visible = true; 
        this.scene.anims.create({
            key: 'catch',
            frames: this.scene.anims.generateFrameNumbers('splash', { start: 1, end: 4
            }),
                frameRate: 20,
                repeat: 0
        });
        this.splash.anims.play('catch', true);
    }

    decreaseCatchesRemaining() {      
        this.info.catchesRemainingForTheDay -= 1;                   
    }

    fishing(fish, direction) {                                
        this.spawnBobble(direction);
        this.decreaseCatchesRemaining();  
        this.isFishing = true;      
        // TODO: Add more random amount of time to catch fish
        // Better rod = faster catch time && cooldown                
        this.scene.time.delayedCall(this.getData("timerFishingDelay"), this.collectFish, [fish], this);                                                                                                                                                                                                                  
    }
 
    saveGame() {
        localStorage.setItem('save', JSON.stringify(this.info));
    }

    loadGame() {
        return JSON.parse(localStorage.getItem('save'));
    }

    isSleeping() {
        this.scene.cameras.main.fadeOut(250, 0, 0, 0)                                      

        this.scene.time.delayedCall(1000, function() {   
            this.saveGame();
            this.scene.cameras.main.resetFX(); 
            
            this.scene.events.emit('showUIPopup', "You fall asleep and dream of tiny goats wearing tophats...");  
            this.scene.events.emit('dayTime');  
            this.scene.events.emit('updateUI', this.info);  
            this.resetPlayer();
            this.x = 136;
            this.y = 100;
        }, [], this);                                                                      
        
    }

    resetPlayer() {
        this.alpha = 1;
        this.angle = 0;
        this.setDepth(1);
    }

    isKnockedOut() {
        let tween = this.scene.tweens.add({
            targets: this,
            angle: 180,
            alpha: 0,
            ease: 'Power1',
            duration: 800,
            repeat: 0
        });
    }

    sleep(readyToSleep, wasKnockedOut) {     
        if (readyToSleep) {
            this.info.catchesRemainingForTheDay = 0;
            this.info.catchesRemainingForTheDay = 5;                   
            if (wasKnockedOut) {
                this.isKnockedOut()
                this.scene.time.delayedCall(1400, () => { 
                    this.isSleeping();
                });
            } else {
                this.isSleeping();
            } 
        }           
    }

    monsterAttack() {
        this.sleep(true, true);
    }

    create() {
                
    }

    update() {        

        if (this.body.velocity.x === 0 && this.body.velocity.y === 0 && !this.isFishing) {
            switch (this.facing) {
                case 'left': 
                    this.play('idle-left')
                    break;                    
                case 'right':
                    this.play('idle-right');
                    break;
                case 'up':
                    this.play('idle-up');
                    break;    
                case 'down':
                    this.play('idle-down');
                    break;
            }            
        }

        this.body.setVelocity(0, 0);

        if (this.keys.w.isDown || this.keys.cursors.up.isDown ) {
            this.moveUp();
            this.anims.play('up', true);               
        } else if (this.keys.s.isDown || this.keys.cursors.down.isDown) {
            this.moveDown();
            this.anims.play('down', true);
        } else if (this.keys.a.isDown || this.keys.cursors.left.isDown) {
            this.moveLeft();           
            this.anims.play('left', true);
        } else if (this.keys.d.isDown || this.keys.cursors.right.isDown) {
            this.moveRight();
            this.anims.play('right', true);
        } else {   
            //                                         
        }
        
        
        this.x = Phaser.Math.Clamp(this.x, 0, this.scene.game.config.width);
        this.y = Phaser.Math.Clamp(this.y, 0, this.scene.game.config.height);        
    }
}


