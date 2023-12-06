class PlayScene extends Phaser.Scene {
    constructor() {
        super('PlayScene');
        this.shootTimer = null;
        this.lastPlayerDirection = 'UP';
        this.grenadeCooldown = false;
        this.grenadeCooldownTime = 10000; // 10 seconds (adjust as needed)
        this.lastGrenadeTime = 0;
    }

    preload() {
        this.load.image('background', 'assets/background.png');
        this.load.image('player', 'assets/player.png');
        this.load.image('projectile', 'assets/projectile.png');
        this.load.image('enemy', 'assets/enemy.png');
        this.load.atlas('grenade', '/assets/grenade1.png', 'assets/grenade1.json');
    }

    create() {
        // Add the background image
        const background = this.add.sprite(1600, 1200, 'background'); // Adjust the position as needed

        // Instantiate player, projectiles, enemies
        this.player = new Player(this, 1600, 1200);
        this.projectiles = this.physics.add.group({ classType: Projectile });
        this.enemies = this.physics.add.group({ classType: Enemy });
    
        // Add play scene code here
        this.physics.add.collider(this.projectiles, this.enemies, this.projectileHitEnemy, null, this);
    
        // Define keys
        cursors = this.input.keyboard.addKeys({
            W: Phaser.Input.Keyboard.KeyCodes.W,
            A: Phaser.Input.Keyboard.KeyCodes.A,
            S: Phaser.Input.Keyboard.KeyCodes.S,
            D: Phaser.Input.Keyboard.KeyCodes.D,
            G: Phaser.Input.Keyboard.KeyCodes.G,
        });
    
        spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    
        // Spawn enemies periodically
        this.time.addEvent({
            delay: 1000, // 1000 milliseconds (1 second)
            callback: this.spawnEnemy,
            callbackScope: this,
            loop: true
        });

        this.shootTimer = this.time.addEvent({
            delay: 1500, // 2000 milliseconds (1.5 seconds)
            callback: this.shootProjectile,
            callbackScope: this,
            loop: true, // Repeat indefinitely
        });

        // Initialize score variable
        this.score = 0;

        // Add score display at the top right
        const scoreTextStyle = { fontSize: '24px', fill: '#fff' };
        this.scoreText = this.add.text(
            this.cameras.main.width - 16, // X-coordinate (right edge of the screen)
            16,                             // Y-coordinate
            'Score: 0',
            scoreTextStyle
        )
        .setOrigin(1, 0)                    // Set origin to the top right
        .setScrollFactor(0)
        .setBackgroundColor('#000')
        .setAlpha(0.7);

        // Set the world bounds to the larger map size
        this.physics.world.setBounds(0, 0, 3200, 2400);

        // Set the camera to follow the player
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, 3200, 2400);

        // Play background music
        const bgm = this.sound.add('bgm', { loop: true, volume: 0.10 });
        bgm.play();

        this.input.keyboard.on('keydown-M', () => {
            // Toggle global audio mute state
            this.sound.mute = !this.sound.mute;
    
            // Log the current audio mute state (optional)
            console.log('Audio Mute State:', this.sound.mute);
        });

        // Add countdown display at the top left
        const countdownTextStyle = { fontSize: '24px', fill: '#fff' };
        this.countdownText = this.add.text(
            16, // X-coordinate (left edge of the screen)
            16, // Y-coordinate
            'Ready',
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
        // Player movement and shooting logic
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

        // Diagonal movement
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

        // Update player rotation based on the last movement direction
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

        // Move enemies towards the player
        this.enemies.getChildren().forEach(enemy => {
            const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.player.x, this.player.y);
            const playerSpeed = 125; // Adjust the player's speed as needed
            const enemySpeedPercentage = 0.4; // Adjust the percentage as needed
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
                // Handle collision logic (destroy enemy, projectile, update score, etc.)
                this.projectileHitEnemy(projectile, enemy);
            });
        });

        // Update the countdown display
        this.updateCountdownDisplay();
    }
    

    shootProjectile() {
        if (this.player.active) {
            const spacing = 15; // Adjust this value to set the spacing between projectiles
            const lifespan = 2500; // Lifespan in milliseconds (2.5 seconds)
    
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

                projectile.setScale(.25);

                // Play the shooting sound effect
                this.sound.play('shoot', { volume: 0.15 });

                // Set a timer to destroy the projectile after the specified lifespan
                this.time.delayedCall(lifespan, () => {
                    projectile.destroy();
                });
            }
        }
    }
    

    spawnEnemy() {
        const side = Phaser.Math.Between(0, 3); // 0: top, 1: right, 2: bottom, 3: left
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

    projectileHitEnemy(projectile, enemy) {
        projectile.destroy();
        enemy.destroy();
        this.sound.play('death', { volume: 0.15 })
    
        // Increase the score
        this.score += 1;
    
        // Update the score display
        this.scoreText.setText(`Score: ${this.score}`);
    }    

    showCollisionPopup() {
        this.sound.stopAll();

        // Stop shooting
        if (this.shootTimer) {
            this.shootTimer.destroy();
        }

        // Destroy all existing enemies
        this.enemies.getChildren().forEach(enemy => {
            enemy.destroy();
        });
    
        // Add a semi-transparent background rectangle
        const popupBackground = this.add.rectangle(this.cameras.main.width / 2, this.cameras.main.height / 2, 400, 200, 0x808080, 0.5)
            .setOrigin(0.5)
            .setScrollFactor(0);
    
        // Create and show a popup with the score
        const popupTextStyle = { fontSize: '32px', fill: '#fff', padding: 10 };
        const popupText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 - 40, `Game Over!\nScore: ${this.score}`, popupTextStyle)
            .setOrigin(0.5)
            .setScrollFactor(0);
    
        // Add a button to restart the game
        const buttonStyle = { fontSize: '24px', fill: '#fff', backgroundColor: '#008CBA', padding: 10 };
        const restartButton = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 + 60, 'Click Here To Restart', buttonStyle)
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setInteractive();
    
        restartButton.on('pointerdown', () => {
            // Play the "select" sound effect
            this.sound.play('select', { volume: 0.15 });
            
            // Restart the game
            this.gameOver = false;
            this.scene.restart();
        });
    }

    placeGrenade() {
        const grenade = this.physics.add.sprite(this.player.x, this.player.y, 'grenade');
    
        // Set a timer to destroy the grenade after 3 seconds
        this.time.delayedCall(3000, () => {
            grenade.destroy();
            this.explodeGrenade(grenade.x, grenade.y);
        });
    
        // ... (other grenade-related logic)
    }

    // startGrenadeCooldown() {
    //     this.grenadeCooldown = true;

    //     // Set a timer for the cooldown duration (10 seconds)
    //     this.time.delayedCall(10000, () => {
    //         this.grenadeCooldown = false;
    //     });
    // }
    
    explodeGrenade(x, y) {
        // Play a sound effect for the explosion (adjust as needed)
        this.sound.play('explosion', { volume: 0.15 });

        // Create an animation for the grenade explosion
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
            frameRate: 10, // Adjust the frame rate as needed
            repeat: 0, // Play the animation once
        });

        // Create a sprite for the grenade
        const grenade = this.physics.add.sprite(x, y, 'grenade');

        // Play the explosion animation
        grenade.play('grenadeExplosion');

        // Set a timer to destroy the grenade sprite after the animation ends
        this.time.delayedCall(700, () => {
            grenade.destroy();
        });
    
        // Iterate through all enemies and check if they are within the blast radius
        this.enemies.getChildren().forEach(enemy => {
            const distance = Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y);
    
            // Adjust the blast radius as needed
            const blastRadius = 150;
    
            if (distance < blastRadius) {
                // Destroy the enemy
                enemy.destroy();
    
                // Increase the score
                this.score += 1;
    
                // Update the score display
                this.scoreText.setText(`Score: ${this.score}`);
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
                this.grenadeCooldown = false; // Reset the cooldown flag when ready
            }
        }
    }

    startGrenadeCooldown() {
        this.grenadeCooldown = true;
        this.lastGrenadeTime = this.time.now; // Update the last grenade time
    }
}