export default class DialogueSystem {

    constructor(conversations, character, currentChapter) {

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
        
        // text to pass to create new Text method in UI Scene
        this.currentTextIndex = 0;
    }

    startConversation() {        
        let chap = this.currentChapter.toString();
        let keyIndex = this.character.conversationKeyIndex;
        let key = this.conversations["keys"][keyIndex];
        let text = this.conversations[chap][this.character.name][key]["words"][this.currentTextIndex][this.character.name];        
        return text;
    }

    stopConversation() {

    }

    moveOnCoversation() {
        // change character
        // this.charIndex += 1;                     
        // if (this.charIndex === 2) {
        //     this.charIndex = 0;  
        // }
    }
}