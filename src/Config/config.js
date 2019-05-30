import 'phaser';
 
export default {  
  type: Phaser.AUTO,
  pixelArt: true,
  roundPixels: true,
  width: 1300,
  height: 900,
  // zoom: 4,
  physics: {
    default: 'arcade',
    arcade: {        
        debug: true
    }
  },
};