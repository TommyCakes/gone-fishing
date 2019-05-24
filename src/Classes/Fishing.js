import Fish from './Fish';

export default class Fishing {
    constructor(fishArray) {
        this.fishArray = fishArray;
        this.fishCaughtToday = [];
    }

    getRandomIntBetween(max) {
        return Math.floor(Math.random() * max);
    }
    
    getRandomFish() {
        let fishArray = this.fishArray;
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