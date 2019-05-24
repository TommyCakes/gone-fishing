export default class Shop {
    constructor(scene) {
        this.scene = scene;
    }

    getTotalOfSale() {
        return this.totalValue.reduce((a, b) => a + b);
    }

    sellAllFish(player) {
        let fishToSell = player.info.inventory.fish;    
        this.totalValue = [];                          
        for (let i = 0; i < fishToSell.length; i += 1) {                    
            this.totalValue.push(1 * fishToSell[i].value);      
            player.info.cash += 1 * fishToSell[i].value;
        }                                 
    }

    

}