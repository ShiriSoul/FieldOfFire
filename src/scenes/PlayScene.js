class PlayScene extends Phaser.Scene {
    constructor() {
        super('PlayScene');
    }

    preload() {
        this.load.image('player', 'assets/player.png');
        this.load.image('projectile', 'assets/projectile.png');
        this.load.image('enemy', 'assets/enemy.png');
    }

    create() {
        // Instantiate player, projectiles, enemies
        this.player = new Player(this, 400, 300);
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
        });
    
        spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    
        // Spawn enemies periodically
        this.time.addEvent({
            delay: 1000, // 1000 milliseconds (1 second)
            callback: this.spawnEnemy,
            callbackScope: this,
            loop: true
        });
    }

    update() {
        // Player movement and shooting logic
        this.player.setVelocity(0);
    
        if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W).isDown) {
            this.player.setVelocityY(-150);
        } else if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S).isDown) {
            this.player.setVelocityY(150);
        }
    
        if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A).isDown) {
            this.player.setVelocityX(-150);
        } else if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D).isDown) {
            this.player.setVelocityX(150);
        }
    
        if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE).isDown) {
            this.shootProjectile();
        }
    }
    

    shootProjectile() {
        if (this.projectiles.countActive(true) < 3) {
            const projectile = this.projectiles.get(this.player.x, this.player.y, 'projectile');
            projectile.setVelocity(0, -500);
        }
    }

    spawnEnemy() {
        const x = Phaser.Math.Between(50, 750);
        const enemy = this.enemies.get(x, 0, 'enemy');
        enemy.setVelocity(0, 100);
    }

    projectileHitEnemy(projectile, enemy) {
        projectile.destroy();
        enemy.destroy();
    }
}
