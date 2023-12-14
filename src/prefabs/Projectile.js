class Projectile extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'projectile');
        scene.add.existing(this);
        scene.physics.add.existing(this);
    }

    // Nothing here because all projectile was is a sprite that moves in a direction
    // In PlayScene I set up the collision for it
}