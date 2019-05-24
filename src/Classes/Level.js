export default class Level {
    constructor() {   
        this.maxLevel = 10;
        this.experiencePool = 0;
        this.levelTree = this.buildLevelTree();        
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
        let baseNumber = 50;
        let levels = {}
        
        for (let i = 0; i < this.maxLevel; i += 1) {
            let currentLevel = `level_${i}`;                
            levels[currentLevel] = baseNumber
            baseNumber = Math.floor(baseNumber * 1.5 + (baseNumber / 3));                                         
        }
        return levels            
    }
    
    addExperiencePoints(xpAmount) {
        this.experiencePool += xpAmount;
    }

    checkForLevelUp(xpRecieved) {
        
    }

    levelUp() {

    }

    getCurrentLevel(player) {
       
    }

    getExperiencePool() {

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