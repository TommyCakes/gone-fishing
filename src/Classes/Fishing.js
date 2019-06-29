import Fish from './Fish';

export default class Fishing {
    constructor(fishArray) {
        this.fishArray = fishArray;
        this.fishCaughtToday = [];
    }

    getRandomIntBetween(max) {
        return Math.floor(Math.random() * max);
    }
    
    getRandomFishOn(rarity) {
        if (rarity == 'junk') {
            return 'junk';
        }

        let fishArray = this.fishArray[rarity];
        let rdmNum = this.getRandomIntBetween(fishArray.length); 
        this.fishCaughtToday.push(fishArray[rdmNum]);   
        
        return new Fish(    
            fishArray[rdmNum].name, 
            fishArray[rdmNum].description, 
            fishArray[rdmNum].weight, 
            fishArray[rdmNum].value, 
            fishArray[rdmNum].rarity
        );
    }

    // works like casino wheel, 
    // randomly picks a type of fish based off chance
    getRandomFishRarity() {    
        let rdmNum = this.getRandomIntBetween(101); 
        let fishRarity = null;

        let trashChance = 50
        let commonChance = 25
        let uncommonChance = 10
        let rareChance = 5
        let superRareChance = 2 
        let legendaryChance = 0.5

        if (rdmNum <= legendaryChance) {
            fishRarity = "legendary"
        } else if (rdmNum <= superRareChance) {
            fishRarity = "superRare"
        } else if (rdmNum <= rareChance) {
            fishRarity = "rare"
        } else if (rdmNum <= uncommonChance) {
            fishRarity = "uncommon"
        } else if (rdmNum <= commonChance) {
            fishRarity = "common"
        } else if (rdmNum <= trashChance) {
            fishRarity = "trash"
        } else {            
            return "junk";
        }        

        return this.getRandomFishOn(fishRarity);
    }

    getFishCaughtForToday() {
        return this.fishCaughtToday;
    }

    getRandomEvent() {

    }

    getTreasure() {

    }

    getJunk() {

    }


}