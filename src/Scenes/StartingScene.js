import { Scene } from 'phaser';

export default class StartingScene extends Scene {
    constructor() {
        super('Start');        
    }

    preload() {

    }

    create() {                
        this.bg = this.add.image(620, 400, 'bg');
        this.bg.setScale(1.7);
        
        let style = { font: "50px Copperplate", fill: "black", align: "center"};                                    
        this.titleText = this.add.text(400, 100, "Choose your class!", style).setScrollFactor(0);

        this.createNewUIBox("The Ranger", "A verteran at hunting animals on land, but still has the edge in the sea.", "5% catch rate UP!", 290, 10, "bowIcon");
        this.createNewUIBox("The Bargain Hunter", "Has an eye for a deal, and is known to haggle even at the pound store..", "Fish Sell for 5% more than normal!", 290, 4, "coinsIcon");        
        this.createNewUIBox("The Student", "An esteemed student, studies hard and is known for learning quickly.", "A 5% boost to XP gained from Fishing!",  290, 2.5, "bookIcon");        
        this.choice = "";
    }
            
    
    createNewUIBox(choiceText, descriptionText, effectText, innerUiSize = 400, divisbleBy, icon) { 
        let style = { font: "30px Copperplate", fill: "white", align: "center", wordWrap: { width: 300, useAdvancedWrap: true }};                                    
        let styleShort = { font: "18px Copperplate", fill: "white", align: "left", wordWrap: { width: 260, useAdvancedWrap: true }};                                    
        let styleTiny = { font: "16px Copperplate", fill: "pink", align: "center", wordWrap: { width: 200, useAdvancedWrap: true }};                                    
        this.container = this.add.container(this.game.config.width / divisbleBy, this.game.config.height / 2 - 200);
        this.uiBackground = this.add.image(this.container.x, this.container.y, 'panel').setScrollFactor(0);  
        this.uiBackground.setOrigin(0.5, 0.5)        
        this.brownPanel = this.add.image(this.uiBackground.x + this.uiBackground.width - 90, this.uiBackground.y - 100 , 'brownPanel').setScrollFactor(0);  
        this.classTypeText = this.add.text(this.uiBackground.x, this.brownPanel.y, choiceText, style).setScrollFactor(0)
                
        this.uiBackground.setScale(1);        
        this.uiBackground.displayWidth = 350;        
        this.brownPanel.displayWidth = innerUiSize;           
        this.brownPanel.displayHeight = 100;   

        this.bluePanel = this.add.image(this.uiBackground.x + this.uiBackground.width - 90, this.brownPanel.y + 160, 'bluePanel').setScrollFactor(0).setInteractive();  
        this.bluePanel.displayWidth = innerUiSize;           
        this.bluePanel.displayHeight = 200;           

        this.bluePanel.on('pointerover', function (event) {
            this.setTint(0x2593DB);
            
        });

        this.bluePanel.on('pointerout', function() {
            this.clearTint();
        });

        this.bluePanel.on('pointerdown', () => {  
            this.choice = choiceText;
            this.scene.start('Game'); 
        });

        this.icon = this.add.image(this.uiBackground.x - 100, this.brownPanel.y + 220, icon);
        this.icon.setScale(3);  

        this.descriptionText = this.add.text(this.uiBackground.x - this.icon.width - 100, this.brownPanel.y + 80, descriptionText, styleShort).setScrollFactor(0)
        this.effectText = this.add.text(this.uiBackground.x - (this.icon.width + 50), this.brownPanel.y + 200, effectText, styleTiny).setScrollFactor(0)

        this.uiBackground.displayHeight = 350;
        this.classTypeText.setOrigin(0.5, 0.5);   
        this.container.setDepth(1);
        this.container.add([this.uiBackground, this.brownPanel, this.bluePanel, this.icon, this.classTypeText, this.descriptionText, this.effectText]);                 
        return this.container;
    }
}