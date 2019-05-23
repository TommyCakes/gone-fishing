import 'phaser';
 
export default {  
  type: Phaser.AUTO,
  pixelArt: true,
  roundPixels: true,
  width: 1600,
  height: 1600,
  // zoom: 4,
  physics: {
    default: 'arcade',
    arcade: {        
        debug: true
    }
  },
};