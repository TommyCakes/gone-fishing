import 'phaser';
import config from './Config/config';
import BootScene from './Scenes/BootScene';
import PreloadScene from './Scenes/PreloadScene';
import GameScene from './Scenes/GameScene';
import TitleScene from './Scenes/TitleScene';
import OptionsScene from './Scenes/OptionsScene';
import CreditsScene from './Scenes/CreditsScene';
import UIScene from './Scenes/MainUIScene';

class Game extends Phaser.Game {
    constructor() {
        super(config);
        // this.scene.add('Boot', BootScene);
        // this.scene.add('Preload', PreloadScene);        
        // this.scene.add('Title', TitleScene);
        // this.scene.add('Options', OptionsScene);
        // this.scene.add('Credits', CreditsScene);        
        this.scene.add('Game', GameScene);
        this.scene.add('UIScene', UIScene);

        this.scene.start('Game');      
        this.scene.start('UIScene');      
    }
}

window.game = new Game();