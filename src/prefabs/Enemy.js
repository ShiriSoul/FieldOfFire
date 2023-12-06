// Enemy.js
class Enemy extends Phaser.Physics.Arcade.Image {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        scene.physics.world.enable(this);
        scene.add.existing(this);
        this.speed = 100; // Adjust the speed as needed
    }

    update(player) {
        // Enemies' sprites will turn towards the player as they head to the player
        const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
        this.setVelocityX(Math.cos(angle) * this.speed);
        this.setVelocityY(Math.sin(angle) * this.speed);
        this.setRotation(angle);
    }
}