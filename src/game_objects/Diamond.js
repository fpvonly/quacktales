import '../phaser/phaser.min.js';
import GameSprite from './GameSprite.js';

export default class Diamond extends GameSprite {

  constructor (scene, x, y, spriteKey, treasureChestObject = null) {

    super(scene, x, y, spriteKey);

    this.setSize(16, 16);
    this.setBounce(0);
    this.setCollideWorldBounds(true);
    this.setVelocityX(0);
    this.setVelocityY(0);
    this.setActive(false);
    this.body.immovable = true;
    this.body.allowGravity = true;
    this.treasureChestObject = treasureChestObject;
    this.collected = false;
    this.timeout = null;

    this.scene.anims.create({
      key: 'rotate',
      frames: this.scene.anims.generateFrameNumbers('items', {start: 1, end: 4}),
      frameRate: 6,
      repeat: 1
    });

    this.playDiamondRotateAnimation();

    this.platformCollider = this.scene.physics.add.collider(this, this.scene.getScenePlatforms());
    this.diamondOverlap = this.scene.physics.add.overlap(this, this.scene.getPlayer(), this.scene.healPlayer.bind(this, this.treasureChestObject));
  }

  activate = () => {
    this.setVisible(true);
    this.playDiamondRotateAnimation();
    this.setVelocityY(-100);
  }

  playDiamondRotateAnimation = () => {
    if (typeof this !== 'undefined' && this.collected === false) {
      this.playAnim('rotate');
      this.once('animationcomplete', () => {
        this.setActive(true);
        this.timeout = setTimeout(() => {
          this.playDiamondRotateAnimation();
        }, 2000);
      });
    }
  }

  collect = () => {
    this.collected = true;
    clearTimeout(this.timeout);
    this.setActive(false);
    this.destroy();
  }

  clearTimeouts = () => {
    clearTimeout(this.timeout);
  }

}
