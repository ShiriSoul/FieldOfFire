class TitleScene extends Phaser.Scene {
    constructor() {
        super('TitleScene');
    }

    preload() {
        this.load.image('titlescreen', 'assets/titlescreen.png');
        this.load.audio('select', 'assets/select.wav');
        this.load.audio('death', 'assets/death.mp3');
        this.load.audio('bgm', 'assets/MrSmithAction.wav');
        this.load.audio('shoot', 'assets/shoot.wav');
        this.load.audio('explosion', 'assets/explosion.wav');
        // update instruction text
    }

    create() {
        const titleScreen = this.add.image(400, 300, 'titlescreen');
        titleScreen.setInteractive();

        const startText = this.add.text(250, 500, 'Press Space Key to Start', { fontSize: UI_SIZE.TITLE_SIZE, fill: '#fff' });

        spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.input.keyboard.on('keydown-SPACE', () => {
            titleScreen.setVisible(false);
            startText.setVisible(false);
            this.scene.start('TutorialScene');
        });
        document.getElementById('info').innerHTML = 'W,A,S,D: move | G: grenade (20 second cooldown) | M: mute audio'
    }
}
