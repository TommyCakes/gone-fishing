import { Scene } from 'phaser';
import Player from '../Sprites/Player';
import Dialogue from '../Classes/DialogueSystem';

export default class MainUIScene extends Scene {
    
    init (data) {
        //Method 1. Introduce sceneA At the time of initialization, you can get the value passed by Scene Scene;
        this.gameScene = this.scene.get('Game');        
    }

    constructor ()
    {
        super({ key: 'UIScene', active: true });        
        this.style = { font: '24px Arial', fill: '#7729DE', align: 'center' }  
        this.bigStyle = { font: '34px Arial', fill: '#7729DE', align: 'center' }   
        this.endOfDay = false;    
        this.subUI = null;                       
    }
    
    refactorTimeDisplay(time) {
        let paddedTime = time.toString().padStart(2, '0');
        return `${paddedTime} : 00`;
    }
    
    getBasicStyle(color, align = 'center', size = '20px', wrapWidth = 390) {
        return { font: `${size} Copperplate`, fill: color, align: align, wordWrap: { width: wrapWidth, useAdvancedWrap: true } }  
    }

    updateMainUI (data) {                           
        if (data.timeOfDay === 20) {   
            this.gameScene.events.emit('nightTime');                    
            this.showUIPopup('You need to get home before the monsters come...');           
        } else if (data.timeOfDay === 23) {
            this.showUIPopup('A new day has dawned!'); 
            this.gameScene.events.emit('resetDay', 1);        
        } else if (data.timeOfDay === 4) {
            this.gameScene.events.emit('dayTime'); 
        }

        let time = this.refactorTimeDisplay(data.timeOfDay);        
        let cash = data.cash;
        let level = data.level;
        let style = { font: '20px Arial', fill: '#fff', align: 'center' }      
                        
        this.ui = this.add.group();    
        this.uiBg = this.add.image(this.game.config.width - 136, 136, 'NEW_UI').setScrollFactor(0);          

        this.timeOfDayText = this.add.text(this.uiBg.x, this.uiBg.y - 31, time, style).setScrollFactor(0);
        this.moneyText = this.add.text(this.uiBg.x, this.uiBg.y + 18, cash, style).setScrollFactor(0);
        this.levelText = this.add.text(this.uiBg.x + 10, this.moneyText.y + 64, level, style).setScrollFactor(0);                                               

        this.ui.add(this.uiBg);
        this.ui.add(this.moneyText);
        this.ui.add(this.levelText);        
        return this.ui;
    }

    updateSubUI (data) {    
        console.log(this.subUI);
        console.log(this.subUI.children);

        let baitAmount = data.catchesRemainingForTheDay;
        let currentBaitHeld = baitAmount;

        if (currentBaitHeld < 5) {  
            var children = this.subUI.getChildren();
            this.subUI.killAndHide(children[data.catchesRemainingForTheDay]);
        }        
    }


    createSubUI (data) {                 
        let baitAmount = data.catchesRemainingForTheDay;
        
        let baitPos = [76, 141, 211, 276, 338];
        
        
        this.subUI = this.add.group();                        
        this.uiBg = this.add.image(210, 46, 'catchesLeftUI').setScrollFactor(0);  

        for (let i = 0; i <= baitAmount - 1; i += 1) {
            let bait = this.add.image(baitPos[i], 94, 'bait').setScrollFactor(0);          
            bait.setScale(2);            
            this.subUI.add(bait); 
        }
                
        this.uiBg.setScale(1.7);                   
                                
        this.subUI.add(this.uiBg);        
    }

    createBasicUIContainer(text, innerUiSize = 400) { 
        let style = this.getBasicStyle('#fff');                      
        this.container = this.add.container(this.game.config.width / 4, this.game.config.height / 2 - 160);
        this.uiBackground = this.add.image(this.container.x, this.container.y, 'panel').setScrollFactor(0);  
        this.uiBackground.setOrigin(0.5, 0.5)        
        this.brownPanel = this.add.image(this.uiBackground.x + this.uiBackground.width - 90, this.uiBackground.y - 30, 'brownPanel').setScrollFactor(0);  
        this.titleText = this.add.text(this.uiBackground.x, this.brownPanel.y, text, style).setScrollFactor(0)
        
        this.uiBackground.setScale(1);        
        this.uiBackground.displayWidth = 500;        
        this.brownPanel.displayWidth = innerUiSize;           
        this.brownPanel.displayHeight = 70;           
        this.uiBackground.displayHeight = 180;
        this.titleText.setOrigin(0.5, 0.5);   
        this.container.setDepth(1);
        this.container.add([this.uiBackground, this.brownPanel, this.titleText]);         
        return this.container;
    }

    showUIPopup(text) {    
        this.container = this.createBasicUIContainer(text);
        this.removeUI(this.container);
    }

    showLevelUpPopup(info) {  
        let text = `Congratulations you have reached level ${info}!`  
        this.container = this.createBasicUIContainer(text);
        this.removeUI(this.container, 5000);
    }

    showFishUIPopup(data) {  
        let style = this.getBasicStyle('#fff');    
        let darkStyle = this.getBasicStyle('#000', 'left');    
        let rarityStyle = this.getBasicStyle("#800080", 'right');    
        let fishInfo = data;

        this.container = this.createBasicUIContainer(`You caught yourself a ${fishInfo.name}!`, 460);                       
        this.image = this.add.image(this.container.x - 190, this.brownPanel.y, fishInfo.name.toLowerCase());
        this.image.displayHeight = 50;
        this.image.displayWidth = 50;

        this.subText = this.add.text(this.uiBackground.x - 30, this.brownPanel.y + 70, `"${fishInfo.description}"`, darkStyle).setScrollFactor(0)          
        this.subText.setOrigin(0.5, 0.5);   

        this.rarityText = this.add.text(this.uiBackground.x + 160, this.brownPanel.y + 100, fishInfo.rarity, rarityStyle).setScrollFactor(0)          
        this.rarityText.setOrigin(0.5, 0.5);   

        this.container.add([this.subText, this.image, this.rarityText])
        this.removeUI(this.container, 5000);
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

    moveOnText() {
        // change character
        // this.charIndex += 1;                     
        // if (this.charIndex === 2) {
        //     this.charIndex = 0;  
        // }

    }

    createDialoguePopup(info) {   
        console.log(info.name);
        let key = info.texture.key;
        // let chapter = info[1];

        console.log(info);
        let style = this.getBasicStyle('#5d5d2f', 'left', '30px', 500);  
        this.container = this.add.container(this.game.config.width / 2, this.game.config.height - 145);
        this.uiBackground = this.add.image(this.x, this.y, 'speechEmpty'); 
        this.currentTalkingFace = this.add.image(300, 10, `${key}-face`);    
        this.speechText = this.add.text(
            this.container.width / 2 - 40, 
            this.uiBackground.y, 
            "",
            style
        );
        let conversations = this.gameScene.conversations.conversations;
        let d = new Dialogue(conversations, info, 1); //chapter 1 hardcoded for testing
                
        // this.speechText.setText("");
        this.speechText.setText(d.startConversation());
        
        this.uiBackground.setScale(0.6);
        this.currentTalkingFace.setScale(2.3);
        this.speechText.setOrigin(0.5, 0.5);   
        this.container.add([this.uiBackground, this.currentTalkingFace, this.speechText]);
        this.removeUI(this.container, 2000);
    }

    removeUI(ui, delay = 2000) {
        this.time.delayedCall(delay, () => {                             
            ui.removeAll(true);
        }, [], this);
    }
    
    showTextPopup(data) { 
        let string = data[0]; // text string to add
        let object = data[1]; // object to render text above
        
        let text = this.add.text(object.x + 150, object.y, string, this.bigStyle);
            this.time.delayedCall(1500, () => {
                text.destroy();
            });            
    }

    create () {             
        this.conversations = this.gameScene.conversations;

        this.gameScene.events.on('endOfDay', () => this.endOfDay = true);
        
        this.gameScene.events.on('startGame', ((data) => {
            this.createSubUI(data);           
        }));

        this.gameScene.events.on('updateUI', ((data) => {
            this.updateMainUI(data);  
            this.updateSubUI(data);                                       
        })); 
                
        this.gameScene.events.on('showUIPopup', ((data) => {
            this.showUIPopup(data);         
        }));  

        this.gameScene.events.on('showLevelUpPopup', ((data) => {
            this.showLevelUpPopup(data);         
        }));  

        this.gameScene.events.on('showFishUIPopup', ((data) => {
            this.showFishUIPopup(data);         
        }));  

        this.gameScene.events.on('createInteractiveSleepPanel', ((data) => {
            this.createInteractiveSleepPanel(data);         
        })); 

        this.gameScene.events.on('showTextPopup', ((data) => {
            this.showTextPopup(data);
        }))

        this.gameScene.events.on('showDialoguePopup', ((data) => { 
            this.createDialoguePopup(data);
        }));

        this.gameScene.events.on('moveOnText', () => this.moveOnText());
         

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

