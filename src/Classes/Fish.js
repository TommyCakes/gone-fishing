export default class Fish {
    constructor(name, description, weight, value, rarity, levelRequired) {
        this.name = name;
        this.description = description;
        this.weight = weight;
        this.value = value;        
        this.rarity = rarity;       
        this.levelRequired = levelRequired;
    }

    checkExpReturnedForCatch() {
        let xpAmount;

        switch(this.rarity) {
            case 'trash':
                xpAmount = 5;
                break;
            case 'common':
                xpAmount = 9;
                break;
            case 'uncommon':
                xpAmount = 15;
                break;
            case 'rare':
                xpAmount = 40
                break;
            case 'super rare':
                xpAmount = 100;
                break;
            case 'legendary':
                xpAmount = 250;
                break;
            default:
                xpAmount = 0;
        }
        return xpAmount;
    }

    // TODO: add image for inventory later on
}