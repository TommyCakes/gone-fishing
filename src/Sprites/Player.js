import Entity from './Entity';
import Bobble from './Bobble';
import Game from '../Scenes/GameScene'
import Level from '../Classes/Level';

export default class Player extends Entity {
        
    constructor(scene, x, y, key) {        
        super(scene, x, y, key, "Player");
        
        this.setData("speed", 100);
        this.setData("isFishing", false);
        this.setData("timerFishingDelay", 5000);
        this.body.moves = true;  
        // this.play("sprPlayer");        
        /* The player object */        
        this.info = {
            name: "TommyCakes",
            level: 1,    
            // for testing...
            catchesRemainingForTheDay: 100,
            cash: 10,
            rarestFishCaught: "",
            level: 0,
            xpPool: 0,
            inventory: {
                fish: [

                ],
                rods: [
                
                ],
                baits: [
            
                ], 
                weapons: [
            
                ],
                outfits: [
                    
                ]
            }            
        }

        this.level = new Level(this.scene, this);

        // let savedGame = localStorage.getItem('save') ? this.info = this.loadGame() : this.info;
        
        let style = { font: '20px Arial', fill: '#fff' }         
        this.infoText = this.scene.add.text(100, 360, "", style); 

        // this.setScale(0.5);        
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

        this.scene.anims.create({
            key: 'turn',
            frames: [ { key: 'sprPlayer', frame: 8} ],
            framerate: 20
        });

        this.scene.anims.create({
            key: 'fish',
            frames: this.scene.anims.generateFrameNumbers('sprPlayer', { start: 13, end: 15
        }),
            frameRate: 10,
            repeat: -1
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
                
        this.setScale(0.4);     
        this.body.setCircle(16, 16);
        this.body.setOffset(16, 16);
        console.log(this.getInfo());
    }
    
    getInfo() {
        return this.info;
    }

    getInventory() {
        return this.info.inventory;
    }

    moveUp() {
        this.body.velocity.y = -this.getData("speed");
    }

    moveDown() {
        this.body.velocity.y = this.getData("speed");
    }

    moveLeft() {
        this.body.velocity.x = -this.getData("speed");
    }

    moveRight() {
        this.body.velocity.x = this.getData("speed");
    }

    getRandomIntBetween(max) {
        return Math.floor(Math.random() * max);
    }
        
    checkForFish() {
        let rdmNum = this.getRandomIntBetween(101);
        let fishCaught = false;
    
        if (rdmNum <= 100) {
            fishCaught = true;
        }
        // } else if (rdmNum <= 40) { 
        //     fishCaught = false;
        // } else if (rdmNum <= 60) {
        //     fishCaught = false;
        // } else if (rdmNum <= 80) {
        //     fishCaught = false;
        // } else if (rdmNum < 100) {
        //     fishCaught = true;
        // }
        this.bobble.destroy();
        this.spawnSplash();
        return fishCaught;
    }
        
    collectFish(fish) {                       
        if (this.checkForFish()) {                 
            this.info.inventory.fish.push(fish);   
            this.info.xpPool += 10;          
            this.scene.events.emit('showUIPopup', `You caught yourself a ${fish.name}!`);                          
        } else {
            this.scene.events.emit('showUIPopup', "Unlucky your line came up empty...");           
        }        
        this.scene.events.emit('updateUI', this.info);  
                           
        if (!this.level.checkForLevelUp()) {
            this.level.showExperienceText(10); 
        } 
        
        console.log(this.info);                
        this.scene.time.delayedCall(200, () => {             
            this.splash.destroy();
        }, [], this);                                                                                                                   
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

    fishing(direction ,fish) {                                         
        this.spawnBobble(direction);
        this.decreaseCatchesRemaining();        
        // TODO: Add more random amount of time to catch fish
        // Better rod = faster catch time && cooldown                
        this.scene.time.delayedCall(this.getData("timerFishingDelay"), this.collectFish, [fish], this);                                                                                                                                                                                                                  
    }

    setRandomCatchAttempts() {
        this.info.catchesRemainingForTheDay = 0;
        // TODO: set catch attempt based on quality of rod
        this.info.catchesRemainingForTheDay = getRandomIntBetween(10);
    }    
    
    saveGame() {
        localStorage.setItem('save', JSON.stringify(this.info));
    }

    loadGame() {
        return JSON.parse(localStorage.getItem('save'));
    }

    sleep(bool) {
        if (bool) {
            this.info.catchesRemainingForTheDay = 0;
            this.info.catchesRemainingForTheDay = 5;
            
            this.scene.cameras.main.fadeOut(250, 0, 0, 0)                                      

            this.scene.time.delayedCall(1000, function() {   
                this.saveGame();
                this.scene.cameras.main.resetFX();        
            }, [], this);                                                                      
        } 
        this.scene.events.emit('showUIPopup', "You fall asleep and dream of tiny goats wearing tophats...");  
    }

    update() {
        
        if (this.player)
        this.body.setVelocity(0, 0);
        
        this.x = Phaser.Math.Clamp(this.x, 0, this.scene.game.config.width);
        this.y = Phaser.Math.Clamp(this.y, 0, this.scene.game.config.height);        
    }
}


