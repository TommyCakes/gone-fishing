import 'phaser';
 
export default {  
  type: Phaser.AUTO,
  pixelArt: true,
  roundPixels: true,
  width: 1200,
  height: 1200,
  // zoom: 4,
  physics: {
    default: 'arcade',
    arcade: {        
        debug: true
    }
  },
};