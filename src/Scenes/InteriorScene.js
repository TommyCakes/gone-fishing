import { Scene } from 'phaser';
import Player from "../Sprites/Player";

export default class InteriorScene extends Scene {

    constructor() {
        super({ key: 'InteriorScene' });            
    }

    createNewZone(x, y, w, h) {
        this.zone = this.add.zone(x, y).setSize(w, h);
        this.physics.world.enable(this.zone, 0);
        this.zone.body.moves = false;
        return this.zone;
    }

    create() {
        this.scene.bringToTop('UIScene');

        // Setup input keys                                
        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.cursors = this.input.keyboard.createCursorKeys();            
        this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        const map = this.make.tilemap({ key: "cave-1" });
        const tileset = map.addTilesetImage("overworld", "tiles");
             
        const belowLayer = map.createStaticLayer("BP", tileset, 0, 0);        
        const waterLayer = map.createStaticLayer("Water", tileset, 0, 0);   
        const worldLayer = map.createStaticLayer("W", tileset, 0, 0);

        waterLayer.setCollisionByProperty({ collides: true });
        worldLayer.setCollisionByProperty({ collides: true });

            
        this.player = new Player(
            this,
            120,
            400,
            "sprPlayer"
        );
        
        this.player.body.setCollideWorldBounds(true);
        this.player.body.onWorldBounds = true;

        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, this.game.width, this.game.height);
        this.cameras.main.setFollowOffset(-50, -30);
        this.cameras.main.zoom = 4;
        this.physics.add.collider(this.player, worldLayer);
        this.physics.add.collider(this.player, waterLayer);  
        
        this.caveExit = this.createNewZone(120, 420, 30, 16);  

        this.physics.add.overlap(this.player, this.caveExit, () => { this.scene.pause(); this.scene.start('Game')});            
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