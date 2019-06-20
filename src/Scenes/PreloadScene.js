import { Scene } from 'phaser';

export default class PreloadScene extends Scene {

    init(){
        this.readyCount = 0;
    }

    constructor() {
        super('Preload'); 
    }    

    ready() {
        this.readyCount += 1;
        if (this.readyCount === 2 ) {
            this.scene.start('Game');                        
        }
    }

    preload() {
        let progressBar = this.add.graphics();
        let progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(240, 270, 320, 50);

        var width = this.cameras.main.width;
        var height = this.cameras.main.height;
        var loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading...',
            style: {
            font: '20px monospace',
            fill: '#ffffff'
            }
        });

        loadingText.setOrigin(0.5, 0.5);
        
        var percentText = this.make.text({
            x: width / 2,
            y: height / 2 - 5,
            text: '0%',
            style: {
            font: '18px monospace',
            fill: '#ffffff'
            }
        });
        percentText.setOrigin(0.5, 0.5);
        
        var assetText = this.make.text({
            x: width / 2,
            y: height / 2 + 50,
            text: '',
            style: {
            font: '18px monospace',
            fill: '#ffffff'
            }
        });
        assetText.setOrigin(0.5, 0.5); 

        this.load.on('progress', function(value) {
            percentText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(250, 280, 300 * value, 30);
        });
        
        // update file progress text
        this.load.on('fileprogress', function (file) {
            assetText.setText('Loading asset: ' + file.key);
        });
        
        // remove progress bar when complete
        this.load.on('complete', function () {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
            assetText.destroy();
            this.ready();
        }.bind(this));

        this.timedEvent = this.time.delayedCall(1000, this.ready, [], this);
        
        // load all assets needed in the game
        this.load.image('fish', 'assets/images/fish/fish.png');
        this.load.image('rod', 'assets/images/fishing_rod.png');  
        this.load.image('rabbit', '/assets/images/wabbit.png');
        this.load.json('fishList', 'assets/JSON/fishList.json');
        this.load.json('conversations', 'assets/JSON/conversations.json');
        
        this.load.image('fishSign', 'assets/images/fish_sign.png');
        this.load.image('heart', 'assets/images/emote_heart.png');
        this.load.image('anger', 'assets/images/emote_anger.png');
        this.load.image('exclamation', 'assets/images/emote_exclamation.png');
        this.load.image('sleep', 'assets/images/emote_sleeps.png');
        this.load.image('star', 'assets/images/emote_star.png');
        this.load.image('cash', 'assets/images/emote_cash.png');
        this.load.image('happyFace', 'assets/images/emote_faceHappy.png');
        this.load.image('question', 'assets/images/emote_question.png');
        // this.load.image('bg', 'assets/grass.png');
        this.load.image('greyButton', 'assets/ui/greyButton.png');
        this.load.image('panel', 'assets/ui/panel.png');
        this.load.image('brownPanel', 'assets/ui/longBrown.png');
        this.load.image('crossBrown', 'assets/ui/crossBrown.png');
        this.load.image('checkBlue', 'assets/ui/checkBlue.png');
        this.load.image('seabass', 'assets/images/fish/blue-fish.png');
        this.load.image('shark', 'assets/images/fish/shark.png');
        this.load.image('prawn', 'assets/images/fish/red-fish.png');
        this.load.image('sardine', 'assets/images/fish/green-fish.png');
        this.load.image('sand-eel', 'assets/images/fish/brown-fish.png');
        this.load.image('xpChunk', 'assets/ui/xp-chunk.png');
        this.load.image('speech', 'assets/ui/speech.png');
        this.load.image('speechEmpty', 'assets/ui/speech-empty.png');

        this.load.spritesheet('sprPlayer', 'assets/sprites/yan-fixed?.png', { 
            frameWidth: 48, 
            frameHeight: 64 
        });        
        this.load.spritesheet('shopKeeper', 'assets/sprites/elder.png', { 
            frameWidth: 48, 
            frameHeight: 64 
        });        
        this.load.spritesheet('slime', 'assets/sprites/slimes.png', { 
            frameWidth: 16, 
            frameHeight: 16 
        });        
        this.load.spritesheet('claris', 'assets/sprites/claris.png', { 
            frameWidth: 48, 
            frameHeight: 64 
        });        
        this.load.spritesheet('cultist', 'assets/sprites/cultist.png', { 
            frameWidth: 48, 
            frameHeight: 64 
        });        
        this.load.spritesheet('baitShopKeeper', 'assets/sprites/baitShopKeeper.png', { 
            frameWidth: 48, 
            frameHeight: 64 
        });                
        this.load.spritesheet('fishingBobble', 'assets/sprites/fishing_bobbles.png', { 
            frameWidth: 24, 
            frameHeight: 24 
        });
        this.load.spritesheet('splash', 'assets/sprites/splash.png', { 
            frameWidth: 32, 
            frameHeight: 32 
        });
        this.load.spritesheet('chests', 'assets/sprites/chests.png', { 
            frameWidth: 32, 
            frameHeight: 32 
        });
        this.load.spritesheet('doggo', 'assets/sprites/doggo.png', { 
            frameWidth: 32, 
            frameHeight: 32 
        });
        this.load.spritesheet('goldCoin', 'assets/sprites/coin_gold.png', { 
            frameWidth: 32, 
            frameHeight: 32 
        });

        this.load.image("NEW_UI", "../assets/ui/NEW_UI@2x.png");
        this.load.image("catchesLeftUI", "../assets/ui/catches-left-ui.png");
        this.load.image("nightSky", "../assets/images/sky-test.png");
        this.load.image("claris-face", "../assets/faces/claris-face.png");
        this.load.image("cultist-face", "../assets/faces/cultist-face.png");
        this.load.image("player-face", "../assets/faces/player-face.png");
        this.load.image("doggo-face", "../assets/faces/doggo-face.png");

        this.load.image("tiles", "../assets/sprites/overworld.png");
        this.load.tilemapTiledJSON("main-world", "../assets/JSON/fishing-map.json");
        this.load.tilemapTiledJSON("cave-1", "../assets/JSON/cave-1-map.json");
        
        
    }         
}
