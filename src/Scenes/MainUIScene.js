import { Scene } from 'phaser';
import Player from '../Sprites/Player';

export default class MainUIScene extends Scene {
    
    init (data) {
        //Method 1. Introduce sceneA At the time of initialization, you can get the value passed by Scene Scene;
        this.gameScene = this.scene.get('Game');        
    }

    constructor ()
    {
        super({ key: 'UIScene', active: true });        

    }
    
    preload() {
        this.load.image('fish', 'assets/fish.png');
        this.load.image('rod', 'assets/fishing_rod.png');
        this.load.spritesheet('goldCoin', 'assets/coin_gold.png', { 
            frameWidth: 32, 
            frameHeight: 32 
        });
    }

    
    updateUI (data) {
        console.log(data);
        let fishAmount = data.inventory.fish.length;
        let cash = data.cash;
        let catches = data.catchesRemainingForTheDay;

        let style = { font: '13px Arial', fill: '#fff', align: 'center' }      
        this.ui = this.add.group();
        this.uiBg = this.add.rectangle(0, 20, 700, 80, '0x000000', 0.5).setScrollFactor(0);  

        this.money = this.add.text(32, 20, cash, style).setScrollFactor(0);
        this.moneyIcon = this.add.sprite(this.money.x - 16, this.money.y + 16, 'goldCoin', 2).setScrollFactor(0);                     

        this.catchesRemainingText = this.add.text(200, 20, `Left: ${catches}`, style).setScrollFactor(0);                                               
        this.catchesIcon = this.add.image(this.catchesRemainingText.x - 22, this.catchesRemainingText.y + 8, 'rod').setScrollFactor(0);     
        this.catchesIcon.setScale(0.7);

        this.amountOfFish = this.add.text(123, 20, `${fishAmount}`, style).setScrollFactor(0);                                               
        this.fishIcon = this.add.image(this.amountOfFish.x - 16, this.amountOfFish.y + 8, 'fish').setScrollFactor(0);     
        this.fishIcon.setScale(0.4);

        this.ui.add(this.uiBg);
        this.ui.add(this.money);
        this.ui.add(this.moneyIcon);
        this.ui.add(this.catchesRemainingText);
        this.ui.add(this.catchesIcon);
        this.ui.add(this.amountOfFish);
        this.ui.add(this.fishIcon);
        return this.ui;
    }

    create () {                     
        this.gameScene.events.on('updateUI', ((data) => {
            this.updateUI(data);               
        }));        
    }

    update () {
        // this.gameScene.events.on('updateUI', ((data) => {
        //     this.updateUI(data);               
        // }));  
    }
}

