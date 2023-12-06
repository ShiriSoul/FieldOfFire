class TutorialScene extends Phaser.Scene {
    constructor() {
        super('TutorialScene');
    }

    preload() {
        this.load.image('tutorial', 'assets/tutorial.png');
    }

    create() {    
        const tutorial = this.add.image(400, 300, 'tutorial');
        const tutorialText = this.add.text(400, 300, '', { 
            fontSize: UI_SIZE.FONT_SIZE, 
            fill: '#fff', 
            align: 'center',
            wordWrap: { width: 700, useAdvancedWrap: true }
        });
    
        tutorialText.setOrigin(0.5, 0.5); // Centers the text
    
        spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    
        const tutorialContent = [
            "Welcome to Field Of Fire!",
            "You are the last player alive,",
            "The enemy team is getting bold",
            "They will try to melee you.",
            "Overtake you through numbers",
            "Your goal is to survive.",
            "",
            "Use 'W','A','S','D' keys to move.",
            "Press 'G' key to place a grenade.",
            "M key mutes all audio",
            "",
            "Press 'Space' to continue ",
            "",
        ];
        
    
        this.autoTypeText(tutorialText, tutorialContent);
    }

    async autoTypeText(tutorialText, tutorialContent) {
        let isTyping = true;

        // Speed up typing and display all text
        const skipTyping = () => {
            isTyping = false;
            tutorialText.text = tutorialContent.join('\n');
        };

        this.input.keyboard.on('keydown-SPACE', () => {
            if (isTyping) {
                // If typing then skip to end
                skipTyping();
            } else {
                // If all text is displayed, set up event: SPACE to switch to PlayScene
                this.input.keyboard.removeAllListeners('keydown-SPACE');
                this.scene.start('PlayScene');
            }
        });

        for (const line of tutorialContent) {
            if (isTyping) {
                await this.typeLine(tutorialText, line);
            }
        }

        // If all text is displayed, set up event: SPACE to switch to PlayScene
        this.input.keyboard.removeAllListeners('keydown-SPACE');
        this.input.keyboard.on('keydown-SPACE', () => {
            this.input.keyboard.removeAllListeners('keydown-SPACE');
            this.scene.start('PlayScene');
        });
    }

    async typeLine(tutorialText, line) {
        tutorialText.text += '\n'; // Moves to next line
        for (let i = 0; i < line.length; i++) {
            tutorialText.text += line[i];
            await this.delay(50);
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
