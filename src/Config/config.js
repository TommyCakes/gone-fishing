import 'phaser';
 
export default {  
  type: Phaser.AUTO,
  pixelArt: true,
  roundPixels: true,
  width: 640,
  height: 400,
  physics: {
    default: 'arcade',
    arcade: {        
        debug: true
    }
  },
};