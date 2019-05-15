import 'phaser';
 
export default {  
  type: Phaser.AUTO,
  pixelArt: true,
  roundPixels: true,
  width: 800,
  height: 800,
  zoom: 2,
  physics: {
    default: 'arcade',
    arcade: {        
        // debug: true
    }
  },
};