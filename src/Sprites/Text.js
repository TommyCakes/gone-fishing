export class Text extends Phaser.Text {
    constructor(scene, x, y, text, style) {
      super(scene, x, y, text, style);
      this.scene = scene;
      this.anchor.setTo(0.5)
    }
       
    delay()
    {
        //WHEN TWEEN IS DONE PAUSE HERE FOR DELAY
        //SET A FADE OBJECT IN THE SCOPE OF THE STATE,
        //SINCE WE CAN NOT PASS THE OBJECT IN THE TIMER
    	this.time.events.add(Phaser.Timer.SECOND*2, this.delayDone, this);
    }
    delayDone()
    {
        //NOW THAT DELAY IS DONE CALL FADE OUT
    	this.fadeOut(this.fadeObj);
    }
    fadeOut() {
        let tween = this.scene.add.tween(this.string)
                .to({alpha: 0}, 1000, Phaser.Easing.Default, true, 3000)
                .onComplete.add(this.fadeDone, this)
    }
    fadeDone()
    {
        this.btnToast.visible=true;
    }
}