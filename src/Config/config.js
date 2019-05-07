import 'phaser';
 
export default {  
  type: Phaser.AUTO,
  pixelArt: true,
  roundPixels: true,
  parent: "phaser-example",
  width: 640,
  height: 400,
  physics: {
    default: 'arcade',
    arcade: {        
        debug: true
    }
},

};