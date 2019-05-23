import Entity from './Entity';
import Game from '../Scenes/GameScene'

export default class Pet extends Entity {
    
    constructor(scene, x, y, key) {        
        super(scene, x, y, key, "Pet");
        
        this.setData("speed", 30);
        this.body.moves = true;  
        
        this.scene.anims.create({
            key: 'idle',
            frames: this.scene.anims.generateFrameNumbers('doggo', { start: 18, end: 19
        }),
            frameRate: 3,
            repeat: 2
        });

        this.scene.anims.create({
            key: 'sleep',
            frames: this.scene.anims.generateFrameNumbers('doggo', { start: 28, end: 29
        }),
            frameRate: 3,
            repeat: 4
        });

        this.scene.anims.create({
            key: 'walk-right',
            frames: this.scene.anims.generateFrameNumbers('doggo', { start: 4, end: 7
        }),
            frameRate: 4,
            repeat: -1
        });
        
        
        // when dog bumpCount == 5, dog ready to be idle and sleep
       //  this.on('animationcomplete', function (anim, frame) {
       //      console.log('animation donezo!');
       //      let num = Math.floor(Math.random() * 2);
       //      console.log(num);
       //      num === 0 ? this.anims.play('idle', true) : this.anims.play('sleep', true);
       //    }, this);

    //    this = this.physics.add.sprite(100, 200, 'doggo');
    //    this.setScale(0.7);  
        
        this.readyToSleepCount = 5;
        this.bumpCount = 0;

        this.body.bounce.set(1);
        this.displayWidth = 16;
        this.displayheight = 16;
        this.setScale(0.7);     
        this.body.setCircle(12, 0);
        this.body.setOffset(4, 8);    

        // this.doggo.dogAnims = [ "idle", "sleep", "idle"];                    
        this.dogAnims = ["sleep"];  
        this.dogIsIdle = true 
    }
    
    playDogIdleAnimations() {   

        this.resumeDogMovingAnimations(); 
            // this.dogIsIdle = false;                                     
            // console.log(this.dogAnims);
            // let next = this.dogAnims.shift();
            // if (next) {
            //     this.anims.play(next);
            // } else {
            //     this.off("animationcomplete", this.playDogIdleAnimations); 
            //     this.resumeDogMovingAnimations();         
            // }       
    }

    moveUp() {
        this.body.velocity.y = -this.getData("speed");
    }

    moveDown() {
        this.body.velocity.y = this.getData("speed");
    }

    moveLeft() {
        this.body.velocity.x = -this.getData("speed");
        this.anims.play('walk-right');
    }

    moveRight() {
        this.body.velocity.x = this.getData("speed");
        this.anims.play('walk-right');
    }

    update() {
        
        if (this.body.velocity.x === -this.getData("speed")) {
            this.flipX = true;            
        } else if (this.body.velocity.x === this.getData("speed")) {
            this.resetFlip();            
        }
                
        if (this.bumpCount === 2) {  
            console.log(this.bumpCount);
            this.body.velocity.x = 0;                        
            let next = this.dogAnims.shift();
            if (next) {
                this.anims.play(next);
            }
            this.on('animationcomplete', () => { 
                this.bumpCount = 0;   
                this.moveRight()
            });
        }           
         
        // if (this.bumpCount === 1) {   
        //     this.anims.play('idle', true);
        //     this.body.setVelocity(0, 0);
        //     this.bumpCount = 0;   

        //     this.on('animationcomplete', function () {                 
        //         console.log(this.dogIdleAnims);
        //         let next = this.dogIdleAnims.shift();

        //         if (next) {
        //             this.anims.play(next);
        //         } else {
        //             this.off("animationcomplete", () => {
        //                 this.body.velocity.x += 30;
        //                 this.anims.play('walk-right', true);
        //             });                    
        //         }
        
        //     }, this);       
        // }
                
        this.x = Phaser.Math.Clamp(this.x, 0, this.scene.game.config.width);
        this.y = Phaser.Math.Clamp(this.y, 0, this.scene.game.config.height);        
    }
}


