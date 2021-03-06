import '../phaser/phaser.min.js';
import {playerInRange} from './funcs.js';
import GameSprite from './GameSprite.js';

export default class RollingStone extends GameSprite {

  constructor (scene, x, y, spriteKey, hurtPlayerCallback = () => {}) {

    super(scene, x, y, spriteKey);

    this.setSize(32, 32);
    this.setBounce(0);
    this.setCollideWorldBounds(true);
    this.setActive(true);
    this.setGravityY(0);
    this.setGravityX(0);
    this.setVelocityY(0);
    this.setVelocityX(0);
    this.body.immovable = true;
    this.body.allowGravity = false;
    this.hurtPlayerCallback = hurtPlayerCallback;
    this.tween = null;
    this.isFalling = false;
    this.timeout = null;

    this.scene.anims.create({
      key: 'still',
      frames: [{key: spriteKey, frame: 0}],
      frameRate: 1
    });

    this.scene.anims.create({
      key: 'roll',
      frames: this.scene.anims.generateFrameNumbers(spriteKey, {start: 0, end: 3}),
      frameRate: 8,
      repeat: -1
    });

    this.playAnim('still', true);

    this.collideWithPlayer = this.scene.physics.add.overlap(this, this.scene.getPlayer(), this.hurtPlayer);
    this.collideWithPlatforms = this.scene.physics.add.collider(this, this.scene.getScenePlatforms(), this.rollRight);
  }

  hurtPlayer = () => {
    if (this.isFalling === true && this.scene) {
      this.hurtPlayerCallback(this.scene.getPlayer(), this);
    }
  }

  checkFallDownTrigger = (player) => {
    if (this.active === true && this.scene.cameraLvl === 4 && playerInRange(this, this.scene.getPlayer()) === true) {
      this.fall(player);
    }
  }

  fall = (player) => {
    this.isFalling = true;
    this.timeout = setTimeout(() => {
      this.playAnim('roll', true);
      this.body.allowGravity = true;
      this.setGravityY(300);
      this.setVelocityY(200);
    }, 500);
  }

  rollRight = () => {
    if (this.body.onFloor() === true && this.scene) {
      this.tween = this.scene.tweens.add({targets: this, x: this.x+350, duration: 5000, onComplete: () => {
        if (this && this.body && this.body.onFloor() === true) {
          this.setActive(false);
          this.destroy();
        }
      }});
    }
  }

  clearTimeouts = () => {
    clearTimeout(this.timeout);
  }

}
