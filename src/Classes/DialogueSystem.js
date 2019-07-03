export default class DialogueSystem {

    constructor(scene, conversations, character, currentChapter) {

        this.scene = scene;
        this.conversations = conversations;
        this.character = character;
        this.currentChapter = currentChapter;

        // create system to cycle through speech
        // speech shouldn't repeat itself unless it's a clue for a quest etc.
        // the current character talking should be reflected on the face in the UI
        // Need a seperate class to manage this behaviour 

        // takes array of characters talking 
        // eg: "claris", "player"
        // let chars = ["claris1", "player1"];

        // conversation are stored in json
        // and is load when system is created
        //  vvvvv                
    }

    startConversation(index) {          
        let chap = this.currentChapter.toString();        
        let keyIndex = this.character.conversationKeyIndex;
        let key = this.conversations["keys"][keyIndex];
        let length = this.conversations[chap][this.character.name][key]["words"].length;

        if (this.hasConversationFinished(index, length)) {             
            this.scene.events.emit('finishedConversation'); 
            index = 0;                                    
        } else {   
            this.character.conversationKeyIndex = 0;         
            return this.conversations[chap][this.character.name][key]["words"][index][this.character.name];                
        }                
    }

    hasConversationFinished (index, length) {
        if (index > length - 1) {                                    
            return true;   
        } 

        return false;
    }
}