// Enemy.js
class Enemy extends Phaser.Physics.Arcade.Image {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        scene.physics.world.enable(this);
        scene.add.existing(this);
        this.speed = 100; // Adjust the speed as needed
        // this.shootTimer = scene.time.addEvent({
        //     delay: 2000, // 2000 milliseconds (2 seconds)
        //     callback: this.shootProjectile,
        //     callbackScope: this,
        //     loop: true,
        // });
    }

    update(player) {
        const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
        this.setVelocityX(Math.cos(angle) * this.speed);
        this.setVelocityY(Math.sin(angle) * this.speed);
        this.setRotation(angle);
    }

//     shootProjectile() {
//         // Create an instance of the Projectile prefab
//         const projectile = new Projectile(this.scene, this.x, this.y, 'projectile');

//         // Set the speed of the projectile
//         const speed = 300; // Adjust the speed as needed

//         // Use the enemy's current velocity to determine the shooting direction
//         const velocityX = this.body.velocity.x;
//         const velocityY = this.body.velocity.y;

//         // Normalize the velocity to get the direction vector
//         const length = Math.sqrt(velocityX ** 2 + velocityY ** 2);
//         const directionX = velocityX / length;
//         const directionY = velocityY / length;

//         // Set the velocity of the projectile
//         projectile.setVelocityX(directionX * speed);
//         projectile.setVelocityY(directionY * speed);
//     }
}