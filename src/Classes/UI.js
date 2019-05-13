export default class UI extends Phaser.GameObjects.Image {
    constructor(scene, x, y, text) {        
        super(scene, x, y);
        this.scene = scene;
        this.scene.add.existing(this);

        let style = { font: '13px Arial', fill: '#fff', align: 'center' }                 
        this.container = this.scene.add.container(330, 160);
        this.uiBackground = this.scene.add.image(this.container.x, this.container.y, 'panel').setScrollFactor(0);  
        this.uiBackground.setOrigin(0.5, 0.5)
        this.brownPanel = this.scene.add.image(this.uiBackground.x + this.uiBackground.width - 90, this.uiBackground.y - 10, 'brownPanel').setScrollFactor(0);  
        this.text = this.scene.add.text(this.uiBackground.x, this.brownPanel.y, text, style).setScrollFactor(0)
        this.uiBackground.setScale(1);        
        this.uiBackground.displayWidth = 400;        
        this.brownPanel.displayWidth = 375;           
        this.uiBackground.displayHeight = 80;
        this.text.setOrigin(0.5, 0.5);   
        this.container.add([ this.uiBackground, this.brownPanel, this.text]);            
    }

    removeUI() {
        this.scene.time.delayedCall(2000, () => {                             
            this.container.removeAll(true);
        }, [], this);
    }
}