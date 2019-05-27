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
        this.style = { font: '24px Arial', fill: '#7729DE', align: 'center' }  

    }
    
    preload() {              
    }

    
    updateUI (data) {
        let cash = data.cash;
        let level = data.level;
        let style = { font: '20px Arial', fill: '#fff', align: 'center' }      
        
        this.ui = this.add.group();    
        this.uiBg = this.uiBackground = this.add.image(this.game.config.width - 136, 136, 'NEW_UI').setScrollFactor(0);          

        this.moneyText = this.add.text(this.uiBackground.x, this.uiBackground.y + 18, cash, style).setScrollFactor(0);

        this.levelText = this.add.text(this.uiBackground.x + 10, this.moneyText.y + 64, level, style).setScrollFactor(0);                                               

        this.ui.add(this.uiBg);
        this.ui.add(this.moneyText);
        this.ui.add(this.levelText);
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
    
    showTextPopup(data) { 
        let string = data[0]; // text string to add
        let object = data[1]; // object to render text above
        
        let text = this.add.text(object.x + 100, object.y - 100, `${string}`, this.style);
            this.time.delayedCall(1500, () => {
                text.destroy();
            });            
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

        this.gameScene.events.on('showTextPopup', ((data) => {
            this.showTextPopup(data);
        }))
         

        // this.events.on('levelUp', () => {
        //     this.playerText.setText(this.playerInfo.level);
        //     let text = this.add.text(this.player.x , this.player.y - 20, "LEVEL UP!", this.styleGold);
        //     this.time.delayedCall(2500, () => {
        //         text.destroy();
        //     });                             
        // });
        
        
    }

    update () {      
    }
}

