import { Scene } from 'phaser';
import Player from "../Sprites/Player";
import Lake from '../Sprites/Lake';
import Shop from '../Classes/Shop';

export default class GameScene extends Scene {
    constructor() {
        super('Game');
    }

    preload() {
        this.load.image('fish', 'assets/fish.png');
        this.load.image('rod', 'assets/fishing_rod.png');
        this.load.image('fisherman', 'assets/fisherman.png');
        this.load.image('water', 'assets/water.png');
        this.load.image('shop', 'assets/shop.png');
        this.load.image('home', 'assets/house.png');
        this.load.image('bg', 'assets/grass.png');
        this.load.image('greyButton', 'assets/greyButton.png');
        this.load.image('panel', 'assets/panel.png');
        this.load.image('brownPanel', 'assets/longBrown.png');
        this.load.image('crossBrown', 'assets/crossBrown.png');
        this.load.image('checkBlue', 'assets/checkBlue.png');
        // this.load.image('energyBar', 'assets/energybar.png');
        // this.load.image("energyContainer", "assets/energycontainer.png");
        this.load.spritesheet('sprPlayer', 'assets/yan.png', { 
            frameWidth: 48, 
            frameHeight: 64 
        });        
        this.load.spritesheet('shopKeeper', 'assets/elder.png', { 
            frameWidth: 48, 
            frameHeight: 64 
        });        
        this.load.spritesheet('waterMoving', 'assets/water_moving.png', { 
            frameWidth: 48, 
            frameHeight: 64 
        });
        this.load.spritesheet('fishingBobble', 'assets/fishing_bobbles.png', { 
            frameWidth: 24, 
            frameHeight: 24 
        });
        this.load.spritesheet('splash', 'assets/splash.png', { 
            frameWidth: 32, 
            frameHeight: 32 
        });
        this.load.spritesheet('chests', 'assets/chests.png', { 
            frameWidth: 32, 
            frameHeight: 32 
        });
        this.load.spritesheet('goldCoin', 'assets/coin_gold.png', { 
            frameWidth: 32, 
            frameHeight: 32 
        });
    }

    updateTime() {                
        this.cooldown -= 1;  
        // let stepWidth = this.barMask.displayWidth / this.FISHING_COOLDOWN_DELAY;
        // this.barMask.x -= stepWidth;        
    }

    resetTimeBar() {
        // this.barMask.x = 1000;
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
        // this.zone.body.setCircle(45)
        this.physics.world.enable(this.zone, 0);
        this.zone.body.moves = false;
        return this.zone;
    }

    createInteractivePanel() {
        let style = { font: '13px Arial', fill: '#fff', align: 'center' }   
        this.uiPanel = this.add.group();
        this.uiBackground = this.add.image(this.player.x / 2 + 160, this.player.y + 160, 'panel').setScrollFactor(0);  
        this.brownPanel = this.add.image(this.uiBackground.x + this.uiBackground.width - 90, this.uiBackground.y - 60, 'brownPanel').setScrollFactor(0);  
        this.text = this.add.text(this.uiBackground.x, this.brownPanel.y, 'Will you settle down for the night, and save your progress?', style).setScrollFactor(0)
        // this.add.text(this.player.x / 2 + 84, this.player.y + 84, 'Will you settle down for the night, and save your progress?', style).setScrollFactor(0);                                        
        this.text.setOrigin(0.5, 0.5);   
        this.buttonYes = this.add.image(this.player.x / 2 + 120, this.text.y + 100, 'greyButton').setScrollFactor(0).setInteractive();  
        this.buttonYes.name = 'yesBtn';
        this.check = this.add.image(this.player.x / 2 + 120, this.text.y + 100, 'checkBlue').setScrollFactor(0)
        this.buttonNo = this.add.image(this.buttonYes.x + this.buttonYes.width * 2, this.text.y + 100, 'greyButton').setScrollFactor(0).setInteractive();          
        this.buttonNo.name = 'noBtn';
        this.cross = this.add.image(this.buttonYes.x + this.buttonYes.width * 2, this.text.y + 100, 'crossBrown').setScrollFactor(0)
        this.uiBackground.setScale(1);
        this.buttonYes.setScale(1.5);
        this.buttonNo.setScale(1.5);
        this.uiBackground.displayWidth = 400;        
        this.brownPanel.displayWidth = 375;        
        this.uiBackground.displayHeight = 200;        
        this.uiPanel.add(this.uiBackground);
        this.uiPanel.add(this.brownPanel);
        this.uiPanel.add(this.text);
        this.uiPanel.add(this.buttonYes);
        this.uiPanel.add(this.check);
        this.uiPanel.add(this.cross);
        this.uiPanel.add(this.buttonNo);
        this.uiPanel.setDepth(2)  
        this.buttonYes.on('pointerdown', ()=> { this.player.sleep(true)}); 
        return this.uiPanel;               
    }

    create() {        
        this.FISHING_COOLDOWN_DELAY = 2;
        this.cooldown = 0;
        this.second = 1000;
        
        // let energyContainer = this.add.sprite(180, 20, "energyContainer");
        // let energyBar = this.add.sprite(energyContainer.x + 13, energyContainer.y, 'energyBar');        
        // this.barMask = this.add.sprite(energyBar.x, energyBar.y, "energyBar");
        // this.barMask.visible = false;
        // energyBar.setScale(0.3, 0.4);
        // energyContainer.setScale(0.3, 0.4);
        // this.barMask.setScale(0.3, 0.4);
        // energyBar.mask = new Phaser.Display.Masks.BitmapMask(this, this.barMask);

        this.timer = this.time.addEvent({
            delay: this.second * this.FISHING_COOLDOWN_DELAY,                
            callback: this.updateTime,
            callbackScope: this,
            loop: true
        });      
        
        this.timer.paused = false;          
        
        

        this.fisherman = this.physics.add.sprite(500, 60, 'fisherman');
        this.fisherman.setScale(0.3, 0.3);
                
    
        let chest = this.add.sprite(this.shop.x + -40, this.shop.y + 80, 'chests', 1);                                         
        let chest2 = this.add.sprite(this.shop.x -70, this.shop.y + 80, 'chests', 2);                                         

       

        var tween = this.tweens.add({
            targets: this.shopKeeper,
            x: this.shopKeeper.x + 1,               // '+=100'
            y: this.shopKeeper.y + 0.5,               // '+=100'
            ease: 'Linear',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 1500,
            repeat: -1,            // -1: infinity
            yoyo: true
        });
    }
    
    spawnCoins() {
        let coins = this.add.group({
            key: 'goldCoin',
            repeat: this.player.info.inventory.fish.length + 1 ,
            setXY: {
                x: this.player.x + Phaser.Math.RND.between(40, 340),
                y: this.player.y + 100,
            }
        });  
        return coins;      
    }        
    
    fadeInfo() {
        this.time.delayedCall(1000, () => {                             
            this.infoText.visible = false;
        }, [], this);
    }

    update() {    
       

        if (this.player.info.catchesRemainingForTheDay === 0) {
            this.infoText.setText(`You have run out of attempts... 
                Time to go home`);
            this.fadeInfo();
        }
        
}