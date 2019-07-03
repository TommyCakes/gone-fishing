import Entity from './Entity';

export default class Npc extends Entity {
    constructor(scene, x, y, key, name) {
        super(scene, x, y, key);

        this.name = name;

        this.body.moves = false;
        this.body.setCircle(25);        
        this.setScale(0.4);    
        this.conversationKeyIndex = 0;  
        this.currentTextIndex = 0;
        this.zone = this.scene.add.zone(this.x - 25, this.y - 16).setSize(50, 50);
        this.zone.name = this.name
        this.scene.physics.world.enable(this.zone, 0);        
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
            this.isTalking = true;
        }); 
    }

    talking () {
        this.scene.events.emit('showDialoguePopup', this);
    }

    create() {       
        if (this.isTalking) {
            this.scene.events.emit('showDialoguePopup', this);
        }
    }
}