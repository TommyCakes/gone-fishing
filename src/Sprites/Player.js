import Entity from './Entity';
import Game from '../Scenes/GameScene'

export default class Player extends Entity {
    constructor(scene, x, y, key) {        
        super(scene, x, y, key, "Player");
        
        this.setData("speed", 200);
        this.setData("isFishing", false);
        this.setData("timerFishingDelay", 5000);
        // this.body.setCircle(30);
        this.body.moves = true;        
        
        // this.play("sprPlayer");

        /* The player object */
        this.info = {
            name: "TommyCakes",
            level: 1,    
            catchesRemainingForTheDay: 3,
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
        return fishCaught;
    }
        
    collectFish() {    
        this.scene.cameras.main.shake(100, 0.01, 0.01); 
        if (this.checkForFish()) {            
            this.info.inventory.fish.push('fish');
            console.log('you caught a fish');
            console.log(this.info)
            // increaseScore();        
        } else {
            console.log('unlucky you fished up nothing...');
            console.log(this.info)
        }
        // this.caughtFish = true;   
        return true;          
    }
    
    fishing(player) {      
        console.log('fishing');  
        // this.decreaseCatchesRemaining();
        this.scene.time.delayedCall(this.getData("timerFishingDelay"), this.decreaseCatchesRemaining, [], this);                                                                                                      
    }

    decreaseCatchesRemaining() {        
        this.info.catchesRemainingForTheDay -= 1;
        this.collectFish();
        // catchesRemainingText.setText(`Catch attempts left: ${catchesRemainingForTheDay}`);
    }

    setRandomCatchAttempts() {
        this.info.catchesRemainingForTheDay = 0;
        // TODO: set catch attempt based on quality of rod
        this.info.catchesRemainingForTheDay = getRandomIntBetween(10);
    }    
    
    update() {
        this.body.setVelocity(0, 0);

        this.x = Phaser.Math.Clamp(this.x, 0, this.scene.game.config.width);
        this.y = Phaser.Math.Clamp(this.y, 0, this.scene.game.config.height);        
    }
}


