import Entity from './Entity';

export default class Enemy extends Entity {
    constructor(scene, x, y, key) {
        super(scene, x, y, key);

        this.scene.anims.create({
            key: 'moving',
            frames: this.scene.anims.generateFrameNumbers(key, { start: 0, end: 7
        }),
            frameRate: 10,
            repeat: -1
        });
        
        // this.body.moves = false;
        this.body.setCircle(5);        
        this.setScale(1);  
    }

    update() {

        
    }
}