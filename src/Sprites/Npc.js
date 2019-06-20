import Entity from './Entity';

export default class Npc extends Entity {
    constructor(scene, x, y, key, name) {
        super(scene, x, y, key);

        this.name = name;

        this.body.moves = false;
        this.body.setCircle(25);        
        this.setScale(0.4);    
        this.conversationKeyIndex = 0;      
    }

    talking () {
        this.scene.events.emit('showDialoguePopup', this);
    }

    createEmote(emoteName) {
        let emote = this.scene.physics.add.sprite(this.x, this.y - 20, emoteName);                    
        emote.setDepth(1);     
        this.scene.time.delayedCall(500, () => {
            emote.destroy();
        });                        
    }

    createTalkingCollider(obj) {
        this.scene.physics.add.collider(obj, this, () => {
            this.talking();
        }); 
    }
}