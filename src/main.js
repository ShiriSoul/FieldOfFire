/***********************************************/
/* Author: Tony Pau
/* Title:  Field of Fire
/* Time:   78-ish hours, maybe more. I lost count. (around 2 weeks spent on this with some days being fully focused on this project and others being just a quick few minutes)
/*
/* Field of Fire is a first person shooter game from the series Video Game High School.
/* The general idea I had was a top down shooter originally planned to be inspired by the tank game,
/* but this quickly turned into a vampire survivors game without the leveling progression as this is a survival game.
/*
/* My goal is have the player try to survive a set time limit (10 minutes) as endlessly spawning enemies try to attack the player.
/* The player is loaded with an auto firing 3 round burst rifle and a grenade skill with a 10 second cooldown.
/* The hardest part I had was also quite silly issue. The grenade.png wouldn't load on github.io but worked on my local server.
/* After some 5 or so days of just trying to troubleshoot, I realized it worked in incognito meaning all I had to do to fix the bug was clear my browser's cache.
/* Like I said, quite silly of me not realizing the cache was the issue. I should've realized to clear cache images and files much earlier haha.
/*
/* Once the enemy collides with the player, a pop up will display the final score, pause gameplay, and the player can click a button to reset.
/* This pop up part was also quite difficult as I struggled to "pause" the game/scene while having the restart button still usable as pausing scene paused everything.
/* A simple fix though as instead of pausing functions, I decided to delete them as the pop up point was the game over point so restarting or refreshing would be the only options anyways.
/* The enemies still spawn and collision with Player will stop queue the pop-up window but the displayed score won't change as the shoot function is removed during this window so it still works as a Game Over pop up just fine.
/* 
/* Note: As of this moment (December 14, 2023   5:00pm PST), I have finished the core of the game with the "mandatory" features.
/* I wish I had more than 10 weeks to learn Phaser 3 so that I could implement the enemies that spawn to each individually shoot projectiles at the Player.
/* I tried to implement it but the enemies either shot in the default direction (UP) instead of towards player or didn't shoot at all.
/* Nevertheless, I have finished the game to my best abilities as of the time step in line 18.
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
/* https://pixabay.com/sound-effects/       Used to find royalty free sfx that jsfxr couldn't produce like the more realistic bullet sounds I needed
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
            debug: false
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