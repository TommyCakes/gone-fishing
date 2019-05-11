import Entity from './Entity';

export default class Lake extends Entity {
    constructor(scene, x, y, key) {
        super(scene, x, y, key, "Lake");
        this.setData("speed", 200);
        this.setData("isFishing", false);
        this.setData("timerFishingDelay", 5000);
        this.body.immovable = true        
        this.setScale(2.7);    
    }
}