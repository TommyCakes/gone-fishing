import 'phaser';
 
export default {  
  type: Phaser.AUTO,
  pixelArt: true,
  roundPixels: true,
  width: 1640,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {        
        debug: true
    }
  },
};