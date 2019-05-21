export default class Shop {
    constructor() {

    }

    sellAllFish(player) {
        let fishToSell = player.info.inventory.fish.length;
        for (let i = 0; i < fishToSell; i += 1) {
            this.sellFish(player);        
        }                    
    }

    sellFish(player) {
        // Need to make a fish class or load data from JSON file
        player.info.cash += 1 * 3;
    }
}