import Entity from './Entity';

export default class Player extends Entity {
    constructor(scene, x, y, key) {
        super(scene, x, y, key, "Player");
        this.setData("speed", 200);
        this.setData("isFishing", false);
        this.setData("timerFishingDelay", 5000);
        this.body.setCircle(30);
        // this.play("sprPlayer");

        /* The player object */
        this.info = {
            name: "TommyCakes",
            level: 1,    
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
            fishCaught = false;
        }
        return fishCaught;
    }
        
    collectFish() {     
        if (this.checkForFish()) {
            this.caughtFish = true;
            // increaseScore();        
        } else {
            this.caughtFish = true;      
        }
        // resetFish();              
    }
    
    fishing(player) {
        // if (catchesRemaining <= 0) {
        //     dayOver = true;
        //     fish.destroy();
        //     infoText.setText(`You have run out of attempts... 
        //     Time to go home`);
        // }
    
        // if (!canUpdateFish) {
        //     return;
        // }
    
        // canUpdateFish = false;     
        // decreaseCatchesRemaining(playerObject);  
        // this.cameras.main.shake(100, 0.01, 0.01); 
        // hasFished = true; 
        this.collectFish();      
    }

    update() {
        this.body.setVelocity(0, 0);

        this.x = Phaser.Math.Clamp(this.x, 0, this.scene.game.config.width);
        this.y = Phaser.Math.Clamp(this.y, 0, this.scene.game.config.height);        
    }
}


