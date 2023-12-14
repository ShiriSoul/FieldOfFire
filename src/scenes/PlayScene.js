class PlayScene extends Phaser.Scene {
    constructor() {
        super('PlayScene');
        this.shootTimer = null;
        this.lastPlayerDirection = 'UP';
        this.grenadeCooldown = false;
        this.grenadeCooldownTime = 10000; // 10 seconds. Adjust as needed
        this.lastGrenadeTime = 0;
    }

    preload() {
        this.load.image('background', 'assets/background.png');
        this.load.image('player', 'assets/player.png');
        this.load.image('projectile', 'assets/projectile.png');
        this.load.image('enemy', 'assets/enemy.png');
        this.load.atlas('grenade', 'assets/grenade1.png', 'assets/grenade1.json');
    }

    create() {
        // Add background image
        const background = this.add.sprite(1600, 1200, 'background'); // Adjust position as needed

        this.player = new Player(this, 1600, 1200);
        this.projectiles = this.physics.add.group({ classType: Projectile });
        this.enemies = this.physics.add.group({ classType: Enemy });
    
        this.physics.add.collider(this.projectiles, this.enemies, this.projectileHitEnemy, null, this);
    
        // Define keys (W,A,S,D for movement and G for grenade)
        cursors = this.input.keyboard.addKeys({
            W: Phaser.Input.Keyboard.KeyCodes.W,
            A: Phaser.Input.Keyboard.KeyCodes.A,
            S: Phaser.Input.Keyboard.KeyCodes.S,
            D: Phaser.Input.Keyboard.KeyCodes.D,
            G: Phaser.Input.Keyboard.KeyCodes.G,
        });
    
        spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    
        // Spawn enemies every few seconds (I actually think its every second exactly)
        this.time.addEvent({
            delay: 1000, // 1 sec
            callback: this.spawnEnemy,
            callbackScope: this,
            loop: true
        });

        this.shootTimer = this.time.addEvent({
            delay: 1500, // 1.5 sec
            callback: this.shootProjectile,
            callbackScope: this,
            loop: true, // Repeat forever
        });

        // Initialize kill score variable
        this.score = 0;

        // Add score display at the top right
        const scoreTextStyle = { fontSize: '24px', fill: '#fff' };
        this.scoreText = this.add.text(
            this.cameras.main.width - 16, // X-coordinate
            16,                           // Y-coordinate
            'Kills: 0',
            scoreTextStyle
        )
        .setOrigin(1, 0)                  // Sets origin to top right
        .setScrollFactor(0)
        .setBackgroundColor('#000')
        .setAlpha(0.7);

        // Sets world bounds to be 4x as larger map size than the 800x600 camera size
        this.physics.world.setBounds(0, 0, 3200, 2400);

        // Sets main camera to follow player
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, 3200, 2400);

        // bgm
        const bgm = this.sound.add('bgm', { loop: true, volume: 0.10 });
        bgm.play();

        // Press M key to mute all audio. I added this incase play testing and didn't want to blast audio in class.
        this.input.keyboard.on('keydown-M', () => {
            this.sound.mute = !this.sound.mute;
    
            // This tells us in console on if M has successfully muted audio or not. It is used to debug.
            // console.log('Audio Mute State:', this.sound.mute);
        });

        // Adds grenade countdown display at the top left
        const countdownTextStyle = { fontSize: '24px', fill: '#fff' };
        this.countdownText = this.add.text(
            16, // X-coordinate
            16, // Y-coordinate
            'Ready', // Ready means the cooldown is complete and skill is ready to use
            countdownTextStyle
        )
        .setOrigin(0, 0)
        .setScrollFactor(0)
        .setBackgroundColor('#000')
        .setAlpha(0.7);

        this.input.keyboard.on('keydown-G', () => {
            if (!this.grenadeCooldown) {
                this.placeGrenade();
                this.startGrenadeCooldown();
            }
        });
    }

    update() {
        // Player movement
        this.player.setVelocity(0);
    
        if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W).isDown) {
            this.player.setVelocityY(-150);
            this.lastPlayerDirection = 'UP';
        } else if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S).isDown) {
            this.player.setVelocityY(150);
            this.lastPlayerDirection = 'DOWN';
        }
    
        if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A).isDown) {
            this.player.setVelocityX(-150);
            this.lastPlayerDirection = 'LEFT';
        } else if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D).isDown) {
            this.player.setVelocityX(150);
            this.lastPlayerDirection = 'RIGHT';
        }

        // Diagonal player movement
        if (cursors.W.isDown && cursors.A.isDown) {
            this.player.setVelocity(-150, -150);
            this.lastPlayerDirection = 'UP_LEFT';
        } else if (cursors.W.isDown && cursors.D.isDown) {
            this.player.setVelocity(150, -150);
            this.lastPlayerDirection = 'UP_RIGHT';
        } else if (cursors.S.isDown && cursors.A.isDown) {
            this.player.setVelocity(-150, 150);
            this.lastPlayerDirection = 'DOWN_LEFT';
        } else if (cursors.S.isDown && cursors.D.isDown) {
            this.player.setVelocity(150, 150);
            this.lastPlayerDirection = 'DOWN_RIGHT';
        }

        // Update player rotation based on last movement direction. (Instead of spritesheet the player is just a png so we use the direction inputs to rotate the png)
        switch (this.lastPlayerDirection) {
            case 'UP':
                this.player.setRotation(Phaser.Math.DegToRad(0));
                break;
            case 'DOWN':
                this.player.setRotation(Phaser.Math.DegToRad(180));
                break;
            case 'LEFT':
                this.player.setRotation(Phaser.Math.DegToRad(-90));
                break;
            case 'RIGHT':
                this.player.setRotation(Phaser.Math.DegToRad(90));
                break;
            case 'UP_LEFT':
                this.player.setRotation(Phaser.Math.DegToRad(-45));
                break;
            case 'UP_RIGHT':
                this.player.setRotation(Phaser.Math.DegToRad(45));
                break;
            case 'DOWN_LEFT':
                this.player.setRotation(Phaser.Math.DegToRad(-135));
                break;
            case 'DOWN_RIGHT':
                this.player.setRotation(Phaser.Math.DegToRad(135));
                break;
        }

        // Moves enemies towards the player
        this.enemies.getChildren().forEach(enemy => {
            const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.player.x, this.player.y);
            const playerSpeed = 125; // Adjust player's speed
            const enemySpeedPercentage = 0.4; // Adjust percentage
            const speed = playerSpeed * enemySpeedPercentage;

            enemy.setVelocityX(Math.cos(angle) * speed);
            enemy.setVelocityY(Math.sin(angle) * speed);

            // Update enemy rotation based on movement direction
            enemy.setRotation(Phaser.Math.DegToRad(Phaser.Math.RadToDeg(angle) + 90));

            // Check for collisions between enemies
            this.physics.world.collide(enemy, this.enemies);

            // Check for collisions between enemies and the player
            this.physics.world.collide(enemy, this.player, () => {
                // Handle player-enemy collision (show popup)
                this.showCollisionPopup();
            });

            // Check for collisions between enemies and projectiles
            this.physics.world.collide(enemy, this.projectiles, (enemy, projectile) => {
                this.projectileHitEnemy(projectile, enemy);
            });
        });

        // Updates the countdown display
        this.updateCountdownDisplay();
    }
    

    shootProjectile() {
        if (this.player.active) {
            const spacing = 15; // Value to set the spacing between projectiles
            const lifespan = 2500; // Bullet lifespan in milliseconds (2.5 sec)
    
            for (let i = 0; i < 3; i++) {
                const projectile = this.projectiles.get(this.player.x, this.player.y, 'projectile');
                
                let velocityX = 0;
                let velocityY = 0;
    
                switch (this.lastPlayerDirection) {
                    case 'UP':
                        velocityY = -500;
                        break;
                    case 'DOWN':
                        velocityY = 500;
                        break;
                    case 'LEFT':
                        velocityX = -500;
                        break;
                    case 'RIGHT':
                        velocityX = 500;
                        break;
                    case 'UP_LEFT':
                        velocityX = -500;
                        velocityY = -500;
                        break;
                    case 'UP_RIGHT':
                        velocityX = 500;
                        velocityY = -500;
                        break;
                    case 'DOWN_LEFT':
                        velocityX = -500;
                        velocityY = 500;
                        break;
                    case 'DOWN_RIGHT':
                        velocityX = 500;
                        velocityY = 500;
                        break;
                }
    
                const offsetX = i * spacing * Math.cos(Math.atan2(velocityY, velocityX));
                const offsetY = i * spacing * Math.sin(Math.atan2(velocityY, velocityX));
    
                projectile.setVelocity(velocityX, velocityY);
                projectile.setPosition(this.player.x + offsetX, this.player.y + offsetY);

                projectile.setScale(2);

                // Play the shooting sfx
                this.sound.play('shoot', { volume: 0.15 });

                // Sets timer to destroy projectiles after the specified lifespan (2.5 sec)
                this.time.delayedCall(lifespan, () => {
                    projectile.destroy();
                });
            }
        }
    }
    
    // Will spawn enemies at random places on the border of the camera so enemies always spawn near player
    spawnEnemy() {
        const side = Phaser.Math.Between(0, 3);
        let x, y;
    
        switch (side) {
            case 0: // Top
                x = Phaser.Math.Between(this.cameras.main.worldView.left, this.cameras.main.worldView.right);
                y = this.cameras.main.worldView.top;
                break;
            case 1: // Right
                x = this.cameras.main.worldView.right;
                y = Phaser.Math.Between(this.cameras.main.worldView.top, this.cameras.main.worldView.bottom);
                break;
            case 2: // Bottom
                x = Phaser.Math.Between(this.cameras.main.worldView.left, this.cameras.main.worldView.right);
                y = this.cameras.main.worldView.bottom;
                break;
            case 3: // Left
                x = this.cameras.main.worldView.left;
                y = Phaser.Math.Between(this.cameras.main.worldView.top, this.cameras.main.worldView.bottom);
                break;
        }
    
        const enemy = this.enemies.get(x, y, 'enemy');
        enemy.setVelocity(0, 100);
    }

    // Kill count
    projectileHitEnemy(projectile, enemy) {
        projectile.destroy();
        enemy.destroy();
        this.sound.play('death', { volume: 0.15 })
    
        // Increases score
        this.score += 1;
    
        // Update the score display
        this.scoreText.setText(`Kill: ${this.score}`);
    }    

    // Game Over Pop Up
    showCollisionPopup() {
        this.sound.stopAll(); // Ends audio

        this.sound.play('lose', { volume: 0.15 });

        // Stops auto shooting
        if (this.shootTimer) {
            this.shootTimer.destroy();
        }

        // Destroy all existing enemies (I think enemies still spawn and I couldn't work past it but the score won't be added to it and enemies get destroyed on contact)
        this.enemies.getChildren().forEach(enemy => {
            enemy.destroy();
        });
    
        // Add a semi-transparent background rectangle
        const popupBackground = this.add.rectangle(this.cameras.main.width / 2, this.cameras.main.height / 2, 400, 200, 0x808080, 0.5)
            .setOrigin(0.5)
            .setScrollFactor(0);
    
        // Create a popup and display the score
        const popupTextStyle = { fontSize: '32px', fill: '#fff', padding: 10 };
        const popupText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 - 40, `Game Over!\nKills: ${this.score}`, popupTextStyle)
            .setOrigin(0.5)
            .setScrollFactor(0);
    
        // Adds a restart the game button
        const buttonStyle = { fontSize: '24px', fill: '#fff', backgroundColor: '#008CBA', padding: 10 };
        const restartButton = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 + 60, 'Click Here To Restart', buttonStyle)
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setInteractive();
    
        restartButton.on('pointerdown', () => {
            // Play the "select" sound effect
            this.sound.play('select', { volume: 0.15 });
            
            // Restarts the game
            this.gameOver = false;
            this.scene.restart();
        });
    }

    placeGrenade() {
        const grenade = this.physics.add.sprite(this.player.x, this.player.y, 'grenade');
    
        // Sets a timer to destroy the grenade after 3 seconds (grenade cooking time before BOOM)
        this.time.delayedCall(3000, () => {
            grenade.destroy();
            this.explodeGrenade(grenade.x, grenade.y);
        });
    }

    
    explodeGrenade(x, y) {
        // Play a sound effect for the explosion
        this.sound.play('explosion', { volume: 0.15 });

        // Animation for the grenade explosion
        const explosionFrames = this.anims.generateFrameNames('grenade', {
            start: 1,
            end: 7,
            zeroPad: 0,
            prefix: 'g',
            suffix: '.png',
        });

        this.anims.create({
            key: 'grenadeExplosion',
            frames: explosionFrames,
            frameRate: 10,
            repeat: 0,
        });

        // Sprite for the grenade
        const grenade = this.physics.add.sprite(x, y, 'grenade');

        // Plays explosion animation
        grenade.play('grenadeExplosion');

        // Sets timer to destroy grenade sprite after the animation ends
        this.time.delayedCall(700, () => {
            grenade.destroy();
        });
    
        // Iterate through all enemies and check if they are within the blast radius
        this.enemies.getChildren().forEach(enemy => {
            const distance = Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y);
    
            // Blast radius
            const blastRadius = 150;
    
            if (distance < blastRadius) {
                // Destroys the enemy/enemies
                enemy.destroy();
    
                // Increase score
                this.score += 1;
    
                // Update the score display
                this.scoreText.setText(`Kill: ${this.score}`);
            }
        });
    }

    updateCountdownDisplay() {
        if (this.grenadeCooldown) {
            const elapsedCooldownTime = this.time.now - this.lastGrenadeTime;
            const remainingTime = this.grenadeCooldownTime - elapsedCooldownTime;
            const seconds = Math.ceil(remainingTime / 1000);

            if (seconds > 0) {
                this.countdownText.setText(`${seconds}s`);
            } else {
                this.countdownText.setText('Ready');
                this.grenadeCooldown = false; // Resets the cooldown flag when ready
            }
        }
    }

    startGrenadeCooldown() {
        this.grenadeCooldown = true;
        this.lastGrenadeTime = this.time.now; // Updates the last grenade time
    }

}