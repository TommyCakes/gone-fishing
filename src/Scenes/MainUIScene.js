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
    }

    
    updateUI (data) {
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

    showUIPopup(text) {        
        let style = { font: '13px Arial', fill: '#fff', align: 'center' }                 
        this.container = this.add.container(this.cameras.main.centerX / 3, this.cameras.main.centerY / 3);
        this.uiBackground = this.add.image(this.container.x, this.container.y, 'panel').setScrollFactor(0);  
        this.uiBackground.setOrigin(0.5, 0.5)
        this.brownPanel = this.add.image(this.uiBackground.x + this.uiBackground.width - 90, this.uiBackground.y - 10, 'brownPanel').setScrollFactor(0);  
        this.text = this.add.text(this.uiBackground.x, this.brownPanel.y, text, style).setScrollFactor(0)
        this.uiBackground.setScale(1);        
        this.uiBackground.displayWidth = 400;        
        this.brownPanel.displayWidth = 375;           
        this.uiBackground.displayHeight = 80;
        this.text.setOrigin(0.5, 0.5);   
        this.container.setDepth(1);
        this.container.add([ this.uiBackground, this.brownPanel, this.text]); 
        this.removeUI(this.container);
    }

    createInteractiveSleepPanel(player) {
        let style = { font: '13px Arial', fill: '#fff', align: 'center' }                 
        let container = this.add.container(this.cameras.main.centerX / 2, this.cameras.main.centerY / 2);
        this.uiBackground = this.add.image(container.x, container.y, 'panel').setScrollFactor(0);  
        this.uiBackground.setOrigin(0.5, 0.5)
        this.brownPanel = this.add.image(this.uiBackground.x + this.uiBackground.width - 90, this.uiBackground.y - 40, 'brownPanel').setScrollFactor(0);          
        this.text = this.add.text(this.uiBackground.x, this.brownPanel.y, 'Will you settle down for the night, and save your progress?', style).setScrollFactor(0)
        this.buttonYes = this.add.image(this.uiBackground.x - 40 , this.brownPanel.y + 60 , 'greyButton').setScrollFactor(0).setInteractive();  
        this.buttonYes.name = 'yesBtn';
        this.check = this.add.image(this.uiBackground.x - 40, this.brownPanel.y + 70, 'checkBlue').setScrollFactor(0)
        this.buttonNo = this.add.image(this.buttonYes.x + this.buttonYes.width * 2, this.buttonYes.y, 'greyButton').setScrollFactor(0).setInteractive();          
        this.buttonNo.name = 'noBtn';
        this.cross = this.add.image(this.buttonYes.x + this.buttonYes.width * 2, this.brownPanel.y + 70, 'crossBrown').setScrollFactor(0)

        this.uiBackground.setScale(1);        
        this.uiBackground.displayWidth = 400;        
        this.brownPanel.displayWidth = 375;               
        this.uiBackground.displayHeight = 200;    

        this.buttonYes.setScale(1.5);
        this.buttonNo.setScale(1.5);
            
        this.text.setOrigin(0.5, 0.5);   
        container.setDepth(1);
        container.add([ this.uiBackground, this.brownPanel, this.text, this.buttonYes, this.buttonNo, this.check, this.cross]); 

        this.buttonYes.on('pointerdown', () => { player.sleep(true);  }); 
        this.buttonNo.on('pointerdown', () => { player.sleep(false);  });  
        return container;                                                                                          
    }

    removeUI(ui) {
        this.time.delayedCall(2000, () => {                             
            ui.removeAll(true);
        }, [], this);
    }
    
    create () {                 
        this.gameScene.events.on('updateUI', ((data) => {
            this.updateUI(data);         
        })); 
        
        this.gameScene.events.on('showUIPopup', ((data) => {
            this.showUIPopup(data);         
        }));  

        this.gameScene.events.on('createInteractiveSleepPanel', ((data) => {
            this.createInteractiveSleepPanel(data);         
        })); 
        
        
    }

    update () {      
    }
}

