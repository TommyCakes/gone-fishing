export default class Level {
    constructor(scene, player) {    
        this.scene = scene;       
        this.player = player;       
        this.maxLevel = 10;
        this.levelTree = this.buildLevelTree(); 
        console.log(this.player.info.xpPool);
        
        if (localStorage.getItem('save')) {            
            this.experiencePool = this.player.info.xpPool;
        }
        
    }
    

    // takes character and adds a way to power them up
    // each level will require more XP than the previous one 
    // XP is earned through catching fish and completing quests
    // After a certain amount of levels, you can increase your catch speed, 
    // number of fish that can be held at a time
    // price you get per fish at the merchants 
    // and other skills

    // As you level up you unlock the power to catch rarer types of fish 
    // While increase the amount of rare fish you could encounter

    buildLevelTree() {
        let baseNumber = 50; // change back to 50
        let levels = {}
        
        for (let i = 0; i < this.maxLevel; i += 1) {             
            levels[i] = baseNumber
            baseNumber = Math.floor(baseNumber * 1.5 + (baseNumber / 3));                                         
        }
        return levels            
    }
    

    showExperienceText(fish) {
        let amount = fish.checkExpReturnedForCatch();
        console.log(fish.rarity);
        this.scene.events.emit('showTextPopup', [`${amount} XP`, this.player]);   
    }

    checkForLevelUp() {
        let currentLevel = this.player.info.level;
        let xpNeeded = this.levelTree[currentLevel];
        if (this.player.info.xpPool >= xpNeeded) {
            this.levelUp();
            return true;
        } else {
            return false;
        }
    }

    levelUp() {
        this.scene.time.delayedCall(4000, () => {
            console.log('level up!');
            this.player.info.level += 1;        
            this.scene.events.emit('pauseGame');
            this.scene.events.emit('updateUI', this.player.info); 
        });
    }

    getExperiencePool() {
        return this.experiencePool;
    }

    chooseNewSkill() {

    }

    increaseCatchSpeed() {

    }

    increaseFishStorage() {

    }

    increaseHaggling() {

    }

    increaseRareFishEncounter() {

    }

    increaseTreasureEncounter() {

    }    
}