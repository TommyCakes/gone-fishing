export default class Shop {
    constructor() {

    }

    sellAllFish(player) {
        let fishToSell = player.info.inventory.fish;
        for (let i = 0; i < fishToSell.length; i += 1) {
            this.sellFish(player);        
        }
    
        player.info.inventory.fish.length = 0;

        
    }

    sellFish(player) {
        // Need to make a fish class or load data from JSON file
        player.info.cash += 1 * 3;
    }
}