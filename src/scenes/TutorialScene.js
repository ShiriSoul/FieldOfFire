class TutorialScene extends Phaser.Scene {
    constructor() {
        super('TutorialScene');
    }

    create() {
        const tutorialText = this.add.text(400, 300, '', { 
            fontSize: UI_SIZE.FONT_SIZE, 
            fill: '#fff', 
            align: 'center',
            wordWrap: { width: 700, useAdvancedWrap: true }
        });
    
        tutorialText.setOrigin(0.5, 0.5); // Center the text
    
        spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    
        const tutorialContent = [
            "Welcome to Field Of Fire!",
            "Field Of Fire is a game from Video Game High School",
            "It is a multiplayer first person shooter",
            "",
            "In this version, you are the last player alive,",
            "You will face endless enemy combatants.",
            "Your goal is to take as many out as you can.",
            "",
            "Press 'W', 'A', 'S', 'D' keys to move.",
            "Press Space key to shoot projectiles.",
            "Press 'G' key to use the explosive skill.",
            "",
            "Good Luck Soldier and remember...",
            "It's all about the game",
            "",
            "",
            "Press Space key to continue"
        ];
    
        this.autoTypeText(tutorialText, tutorialContent);
    }

    async autoTypeText(tutorialText, tutorialContent) {
        for (const line of tutorialContent) {
            await this.typeLine(tutorialText, line);
            await this.delay(500); // Delay before starting the next line
        }

        // If all text is displayed, set up event to switch to PlayScene on space key press
        this.input.keyboard.on('keydown-SPACE', () => {
            this.input.keyboard.removeAllListeners('keydown-SPACE');
            this.scene.start('PlayScene');
        });
    }

    async typeLine(tutorialText, line) {
        tutorialText.text += '\n'; // Move to the next line
        for (let i = 0; i < line.length; i++) {
            tutorialText.text += line[i];
            await this.delay(50);
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}