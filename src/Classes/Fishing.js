import Fish from './Fish';

export default class Fishing {
    constructor(fishArray) {
        this.fishArray = fishArray;
        this.fishCaughtToday = [];
    }

    getRandomIntBetween(max) {
        return Math.floor(Math.random() * max);
    }

    createNewFish(i) {
        let fishArray = this.fishArray;
        return new Fish(fishArray[i].name, fishArray[i].description, fishArray[i].weight, fishArray[i].price, fishArray[i].size);
    }

    getRandomFish() {
        let fishArray = this.fishArray;
        let rdmNum = this.getRandomIntBetween(fishArray.length); 
        this.fishCaughtToday.push(fishArray[rdmNum]);       
        return new Fish(    
            fishArray[rdmNum].name, 
            fishArray[rdmNum].description, 
            fishArray[rdmNum].weight, 
            fishArray[rdmNum].price, 
            fishArray[rdmNum].size
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