import UI from '../Classes/UI';

export default class Helper {
    constructor(scene) {
        this.scene = scene
    }
    
    createNewUI(text) {
        return new UI(
            this.scene,
            this.x,
            this.y,
            text,
        );
    }

}