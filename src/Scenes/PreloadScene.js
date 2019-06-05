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
        this.load.image('fish', 'assets/fish.png');
        this.load.image('rod', 'assets/fishing_rod.png');  
        this.load.image('rabbit', '/assets/wabbit.png');
        this.load.json('fishList', 'assets/fishList.json');
        
        this.load.image('fisherman', 'assets/fisherman.png');
        this.load.image('water', 'assets/water.png');
        this.load.image('fishSign', 'assets/fish_sign.png');
        this.load.image('heart', 'assets/emote_heart.png');
        this.load.image('anger', 'assets/emote_anger.png');
        this.load.image('exclamation', 'assets/emote_exclamation.png');
        this.load.image('sleep', 'assets/emote_sleeps.png');
        this.load.image('star', 'assets/emote_star.png');
        this.load.image('cash', 'assets/emote_cash.png');
        this.load.image('happyFace', 'assets/emote_faceHappy.png');
        this.load.image('question', 'assets/emote_question.png');
        // this.load.image('bg', 'assets/grass.png');
        this.load.image('greyButton', 'assets/greyButton.png');
        this.load.image('panel', 'assets/panel.png');
        this.load.image('brownPanel', 'assets/longBrown.png');
        this.load.image('crossBrown', 'assets/crossBrown.png');
        this.load.image('checkBlue', 'assets/checkBlue.png');
        this.load.image('seabass', 'assets/blue-fish.png');
        this.load.image('shark', 'assets/shark.png');
        this.load.image('prawn', 'assets/red-fish.png');
        this.load.image('sardine', 'assets/green-fish.png');
        this.load.image('sand-eel', 'assets/brown-fish.png');
        this.load.image('xpChunk', 'assets/xp-chunk.png');
        this.load.image('speech', 'assets/speech.png');
        this.load.image('speechEmpty', 'assets/speech-empty.png');
        this.load.image('river', 'assets/river.jpg');

        this.load.spritesheet('sprPlayer', 'assets/yan.png', { 
            frameWidth: 48, 
            frameHeight: 64 
        });        
        this.load.spritesheet('shopKeeper', 'assets/elder.png', { 
            frameWidth: 48, 
            frameHeight: 64 
        });        
        this.load.spritesheet('claris', 'assets/claris.png', { 
            frameWidth: 48, 
            frameHeight: 64 
        });        
        this.load.spritesheet('baitShopKeeper', 'assets/baitShopKeeper.png', { 
            frameWidth: 48, 
            frameHeight: 64 
        });        
        this.load.spritesheet('waterMoving', 'assets/water_moving.png', { 
            frameWidth: 48, 
            frameHeight: 64 
        });
        this.load.spritesheet('fishingBobble', 'assets/fishing_bobbles.png', { 
            frameWidth: 24, 
            frameHeight: 24 
        });
        this.load.spritesheet('splash', 'assets/splash.png', { 
            frameWidth: 32, 
            frameHeight: 32 
        });
        this.load.spritesheet('chests', 'assets/chests.png', { 
            frameWidth: 32, 
            frameHeight: 32 
        });
        this.load.spritesheet('doggo', 'assets/doggo.png', { 
            frameWidth: 32, 
            frameHeight: 32 
        });
        this.load.spritesheet('goldCoin', 'assets/coin_gold.png', { 
            frameWidth: 32, 
            frameHeight: 32 
        });

        this.load.image("NEW_UI", "../assets/NEW_UI@2x.png");
        this.load.image("clarisHappy", "../assets/claris-happy.png");
        this.load.image("playerSurprised", "../assets/player-surprised.png");

        this.load.image("tiles", "../assets/overworld.png");
        this.load.tilemapTiledJSON("main-world", "../assets/fishing-map.json");
        this.load.tilemapTiledJSON("cave-1", "../assets/cave-1-map.json");
        
        
    }         
}
