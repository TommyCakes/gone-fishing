import Entity from './Entity';
import Game from '../Scenes/GameScene'

export default class Bobble extends Entity {
    constructor(scene, x, y, key) {        
        super(scene, x, y, key, "Bobble");
    }
}