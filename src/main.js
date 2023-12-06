/***********************************************/
/* Author: Tony Pau
/* Title:  Field of Fire
/* Time:   34?ish hours
/*
/* Field of Fire is a first person shooter game from the series Video Game High School.
/* The general idea I had was a top down shooter originally planned to be inspired by the tank game,
/* but this quickly turned into a vampire survivors game without the leveling progression as this is a survival game.
/*
/* My goal is have the player try to survive a set time limit as endlessly spawning enemies try to attack the player.
/* The player is loaded with an auto firing 3 round burst rifle and a grenade skill with a 20 second cooldown.
/* The grenade cooldown was by far the hardest as it kept breaking other parts of my code when I was implementing it.
/*
/* Once the enemy collides with the player then a pop up will display the final score, pause gameplay, and the player can click a button to reset.
/* This pop up part was also quite difficult as I struggled to "pause" the game/scene while having the restart button still usable as pausing scene paused everything.
/* A simple fix though as instead of pausing functions, I decided to delete them as the pop up point was the game over point so restarting or refreshing would be the only options anyways.
/* 
/* Sources/Credits:
/* https://newdocs.phaser.io/docs/3.60.0/Phaser.Animations.Animation            Helped with figuring out anims for grenade explosion as I had to use a new spritesheet maker and the json might've been different
/* https://newdocs.phaser.io/docs/3.60.0/Phaser.Animations.AnimationFrame
/* https://free-tex-packer.com/app/         This is the website I used to make my spritesheet
/* https://community.aseprite.org/t/turn-a-canvas-into-tiles/13552/2            Although not used for this project, I did originally plan to use Tiled and wanted to make a tilemap but gave up.
/*
/* https://newdocs.phaser.io/docs/3.60.0/Phaser.Cameras                         Cameras. How fun.
/* https://github.com/nathanaltice?tab=overview&from=2023-09-01&to=2023-09-30   And of course everyone's favorite open source resource, the professor
/*
/* https://sfxr.me/                         Used to produce sfx
/* https://pixabay.com/sound-effects/       Used to find royalty free sfx that jsfxr couldn't produce
/* https://freemusicarchive.org/home        Background Music (Mr Smith - Action)
/* 
/* https://www.youtube.com/playlist?list=PLsMtUWKCmBPRFzqglpk4YQlNFy8wzSXBN     Video Game High School series
/***********************************************/
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