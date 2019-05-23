import UI from '../Classes/UI';

export default class Helper {
    constructor(scene) {
        this.scene = scene
    }
    
    createNewUI(text, x, y) {
        return new UI(
            this.scene,
            x,
            y,
            text,
        );
    }    
}