import Npc from '../Sprites/Npc';
import Enemy from '../Sprites/Enemy';

export default class Helper {
    
    constructor(scene) {
        this.scene = scene;
    }

    createNewZone(x, y, w, h) {
        let zone = this.scene.add.zone(x, y).setSize(w, h);
        this.scene.physics.world.enable(zone, 0);
        zone.body.moves = false;
        return zone;
    }

    triggerUIUpdate(playerInfo) {
        this.scene.events.emit('updateUI', playerInfo);     
    }

    spawnCoin(type, player) {        
        let coin = this.scene.physics.add.sprite(player.x, player.y - 20, 'goldCoin', 2);         
        this.scene.anims.create({
            key: 'spinning',
            frames: this.scene.anims.generateFrameNumbers(`${type}Coin`, { start: 0, end: 7
        }),
            frameRate: 10,
            repeat: -1
        });

        coin.setDepth(1); 
        coin.setScale(0.5); 
        coin.anims.play('spinning');   
        this.scene.time.delayedCall(1500, () => {
            coin.destroy();
        });   
    }

    spawnEnemy(x, y, key, player) {        
        let enemy = new Enemy(
            this.scene,
            x,
            y,
            key
        );
                           
        enemy.anims.play('moving');

        let tween = this.scene.tweens.add({
            targets: enemy,
            x: enemy.x + 20,
            ease: 'Power1',
            duration: 3000,
            flipX: true,
            yoyo: true,
            repeat: -1
        });

        this.scene.physics.add.collider(player, enemy, () => { 
            this.scene.events.emit('showUIPopup', 'The monster knocked you out cold...');   
            player.monsterAttack();            
        });   

        return enemy;
    }

    createNewNpc(x, y, key, name) {
        return new Npc(
            this.scene,
            x,
            y,
            key, 
            name
        );
    }

    getKeys() {
        return {
            keyW: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            keyS: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            keyA: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            keyD: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
            cursors: this.scene.input.keyboard.createCursorKeys(),            
            keyE: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
            keySpace: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
        }
    }
}