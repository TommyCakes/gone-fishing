export default class Rod {
    constructor(props) {
        this.name = props.name
        this.description = props.description
        this.chanceToLandFish = props.chanceToLandFish
        this.chanceToGetTreasure = props.chanceToGetTreasure
        this.maxCatchAttempts = props.maxCatchAttempts
        this.value = props.value
        this.rarity = props.rarity
    }    
}