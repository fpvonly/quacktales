import '../phaser/phaser.min.js';
import GameSprite from './GameSprite.js';

export default class FallingStone extends GameSprite {

  constructor (scene, x, y, spriteKey, group, interactWithStoneCallback, onCeiling = false, hurtPlayerCallback = () => {}) {

    super(scene, x, y, spriteKey);

    this.setSize(16, 16);
    this.setBounce(0);
    this.setCollideWorldBounds(true);
    this.setActive(true);
    this.setGravityY(0);
    this.setGravityX(0);
    this.setVelocityY(0);
    this.setVelocityX(0);
    this.body.immovable = true;
    this.body.allowGravity = false;
    this.interactWithStoneCallback = interactWithStoneCallback;
    this.hurtPlayerCallback = hurtPlayerCallback;
    this.tween = null;
    this.group = group;
    this.isFalling = false;
    this.onCeiling = onCeiling;
    this.timeout = null;

    this.scene.anims.create({
      key: 'tileStill',
      frames: [{key: spriteKey, frame: 77}],
      frameRate: 1
    });

    this.scene.anims.create({
      key: 'explode',
      frames: [{key: 'items', frame: 22}, {key: 'items', frame: 23}, {key: 'items', frame: 29}],
      frameRate: 6,
      repeat: 0
    });

    this.playAnim('tileStill', true);

    if (onCeiling === false) {
      this.collideWithPlayer = this.scene.physics.add.collider(this, this.scene.getPlayer(), this.destroyAllStones);
    } else {
      this.collideWithPlayer = this.scene.physics.add.overlap(this, this.scene.getPlayer(), this.hurtPlayer);
      this.collideWithPlatforms = this.scene.physics.add.collider(this, this.scene.getScenePlatforms(), this.stoneExplode);
    }
  }

  hurtPlayer = () => {
    if (this.isFalling === true && this.onCeiling === true && this.scene) {
      this.hurtPlayerCallback(this.scene.getPlayer(), this);
    }
  }

  destroyAllStones = (stone, player) => {
    //if (this.isFalling === false) {
      this.interactWithStoneCallback(stone, player);
    //}
  }

  crumble = (timeout = 0, useTween = false) => {
    this.isFalling = true;
    if (useTween === true && this.scene) {
      this.timeout = setTimeout(() => {
        this.tween = this.scene.tweens.add({targets: this, y: this.y+500, duration: 3500, onComplete: () => {
          this.setActive(false);
          this.destroy();
        }});
      }, timeout);
    } else {
      this.timeout = setTimeout(() => {
        this.body.allowGravity = true;
        this.setGravityY(300);
        this.setVelocityY(200);
      }, timeout);
    }
  }

  stoneExplode = () => {
    this.playAnim('explode', true);
    this.timeout = setTimeout(() => {
      this.setActive(false);
      this.destroy();
    }, 300);
  }

  checkFallDownTrigger = (player) => {
    if (this.active === true && this.playerInRange() === true) {
      this.interactWithStoneCallback(this, player);
    }
  }

  playerInRange = () => {
    let playerLeftX = this.scene.getPlayer().body.x - this.scene.getPlayer().body.width/2;
    let playerRightX = this.scene.getPlayer().body.x + this.scene.getPlayer().body.width/2;
    let stoneLeftX = this.x - this.width/2;
    let stoneRightX = this.x + this.width/2;
    if ((playerRightX >= stoneLeftX && playerRightX <= stoneRightX) || (playerLeftX <= stoneRightX && playerLeftX >= stoneLeftX)) {
      return true;
    }
    return false;
  }

  clearTimeouts = () => {
    clearTimeout(this.timeout);
  }

}
