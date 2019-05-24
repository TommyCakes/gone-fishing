export default class Shop {
    constructor() {

    }

    getTotalOfSale() {
        return this.totalValue;
    }

    sellAllFish(player) {
        let fishToSell = player.info.inventory.fish;                        
        for (let i = 0; i < fishToSell.length; i += 1) {
            this.totalValue = [];              
            this.totalValue.push(1 * fishToSell[i].value);      
            player.info.cash += 1 * fishToSell[i].value;
        }                                 
    }

}