import { Scene } from 'phaser';
import Player from "../Sprites/Player";

export default class InteriorScene extends Scene {

    init (data) {
        //Method 1. Introduce sceneA At the time of initialization, you can get the value passed by Scene Scene;
        this.gameScene = this.scene.get('Game');      
    }

    constructor() {
        super({ key: 'InteriorScene' });        
    }

    create() {
        let style = { font: '20px Arial', fill: '#fff', align: 'center' }      
        this.moneyText = this.add.text(100, 400, 'welcome to the interior', style).setScrollFactor(0);

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
            400,
            160,
            "sprPlayer"
        );
        
        this.add.image(100, 100, 'river');
        
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, this.game.width, this.game.height);
        this.cameras.main.setFollowOffset(-50, -30);
        this.cameras.main.zoom = 4;

        
    }

    update() {

        this.player.update();   
        this.player.body.velocity.normalize().scale(this.player.getData("speed"));

        if (this.keyW.isDown || this.cursors.up.isDown ) {
            this.player.moveUp();
            this.player.anims.play('up', true);               
        } else if (this.keyS.isDown || this.cursors.down.isDown) {
            this.player.moveDown();
            this.player.anims.play('down', true);
        } else if (this.keyA.isDown || this.cursors.left.isDown) {
            this.player.moveLeft();           
            this.player.resetFlip(); 
            this.player.anims.play('left', true);
        } else if (this.keyD.isDown || this.cursors.right.isDown) {
            this.player.moveRight();
            this.player.resetFlip();
            this.player.anims.play('right', true);
        } else {            
            // this.player.anims.stop();             
        }
        
        this.player.body.velocity.normalize().scale(this.player.getData("speed"));
    }
}