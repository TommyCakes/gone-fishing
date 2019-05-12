import Entity from './Entity';
import Bobble from './Bobble';
import Game from '../Scenes/GameScene'
// import Text from './Text'

export default class Player extends Entity {
    constructor(scene, x, y, key) {        
        super(scene, x, y, key, "Player");
        
        this.setData("speed", 200);
        this.setData("isFishing", false);
        this.setData("timerFishingDelay", 5000);
        this.body.moves = true;  
        // this.play("sprPlayer");

        /* The player object */
        this.info = {
            name: "TommyCakes",
            level: 1,    
            // for testing...
            catchesRemainingForTheDay: 5,
            cash: 10,
            inventory: {
                fish: [
                    'fish', 'fish'
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
    
        if (rdmNum <= 20) {
            fishCaught = true;
        } else if (rdmNum <= 40) { 
            fishCaught = false;
        } else if (rdmNum <= 60) {
            fishCaught = false;
        } else if (rdmNum <= 80) {
            fishCaught = false;
        } else if (rdmNum < 100) {
            fishCaught = true;
        }
        this.bobble.destroy();
        this.scene.cameras.main.shake(100, 0.01, 0.01),
        this.spawnSplash();
        return fishCaught;
    }
        
    collectFish() {            
        if (this.checkForFish()) {            
            this.info.inventory.fish.push('fish');
        
            console.log('you caught a fish');
            console.log(this.info)    
            this.infoText.setText('you caught a fish');
        } else {
            console.log('unlucky you fished up nothing...');
            this.infoText.setText('unlucky you fished up nothing...');
            console.log(this.info)
        }
        // this.caughtFish = true;  
        this.scene.time.delayedCall(200, () => {             
            this.splash.destroy();
        }, [], this);                                                                                                              
        this.scene.fadeInfo();       
    }
    
    spawnBobble() {
        this.bobble = this.scene.add.sprite(this.x + 100, this.y, 'fishingBobble');                                         
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

    fishing(player) {                   
        this.spawnBobble();
        // TODO: Add more random amount of time to catch fish
        // Better rod = faster catch time && cooldown
        this.scene.time.delayedCall(this.getData("timerFishingDelay"), this.decreaseCatchesRemaining, [], this);                                                                                                      
    }

    decreaseCatchesRemaining() {        
        this.info.catchesRemainingForTheDay -= 1;
        this.collectFish();
    }

    setRandomCatchAttempts() {
        this.info.catchesRemainingForTheDay = 0;
        // TODO: set catch attempt based on quality of rod
        this.info.catchesRemainingForTheDay = getRandomIntBetween(10);
    }    
    
    update() {
        // this.catchesRemainingText.setText(`Catch attempts left today: ${this.info.catchesRemainingForTheDay }`)     
        this.body.setVelocity(0, 0);

        this.x = Phaser.Math.Clamp(this.x, 0, this.scene.game.config.width);
        this.y = Phaser.Math.Clamp(this.y, 0, this.scene.game.config.height);        
    }
}


