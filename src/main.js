const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
    },
    scene: [TitleScene, TutorialScene, PlayScene]
};

let game = new Phaser.Game(config);

// Set UI sizes
const UI_SIZE = {
    FONT_SIZE: '20px',
    TITLE_SIZE: '24px'
};

// Reserve keyboard vars
let cursors;
let spaceKey;