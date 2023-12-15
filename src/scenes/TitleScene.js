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
        this.load.audio('lose', 'assets/lose.mp3');
        this.load.audio('win', 'assets/win.mp3');
    }

    create() {
        const titleScreen = this.add.image(400, 300, 'titlescreen');
        titleScreen.setInteractive();

        // Event: press SPACE to go to TutorialScene
        const startText = this.add.text(250, 500, 'Press Space Key to Start', { fontSize: UI_SIZE.TITLE_SIZE, fill: '#fff' });

        spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.input.keyboard.on('keydown-SPACE', () => {
            this.sound.play('select', { volume: 0.15 });
            titleScreen.setVisible(false);
            startText.setVisible(false);
            this.scene.start('TutorialScene');
        });
        document.getElementById('info').innerHTML = 'W,A,S,D: move | G: grenade (10 second cooldown) | M: mute audio'
    }
}
