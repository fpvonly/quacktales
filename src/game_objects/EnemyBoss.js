import '../phaser/phaser.min.js';
import GameSprite from './GameSprite.js';

export default class EnemyBoss extends GameSprite {

  constructor (scene, x, y, spriteKey) {

    super(scene, x, y, spriteKey);

    this.setSize(30, 39);
    this.setBounce(0);
    this.setCollideWorldBounds(true);
    this.setActive(true);
    this.setGravityY(100);
    this.setGravityX(0);
    this.setVelocityY(0);
    this.setVelocityX(0);
    this.origX = x;
    this.origY = y;
    this.body.immovable = true;
    this.body.setAllowGravity(false);
    this.isFalling = false;
    this.shaking = false;
    this.tween = null;
    this.alpha = 0;
    this.setActive(true);
    this.enemyWasHurt = false;

    this.hitCount = 0;

    this.scene.anims.create({
      key: 'blink',
      frames: this.scene.anims.generateFrameNumbers(spriteKey, {start: 0, end: 1}),
      frameRate: 6,
      repeat: -1
    });

    this.playAnim('blink', true);

    this.collideWithPlatforms = this.scene.physics.add.collider(this, this.scene.getScenePlatforms(), this.shakeCamera);
  }

  die = () => {
    if (this.enemyWasHurt === false) {
      this.hitCount++;
      this.enemyWasHurt = true;
    }
    if (this.hitCount >= 3) {
      this.setActive(false);
      this.scene.tweens.add({targets: this, y: this.y+200, duration: 1000, onComplete: () => {
        this.scene.gameOverAndReset(true);
      }});
    }
  }

  checkFallDownTrigger = (player) => {
    if (this.active === true && this.playerInRange() === true) {
      this.fall(player);
    }
  }

  activate = (player) => {
    this.scene.tweens.add({targets: this, alpha: 1, duration: 500, onComplete: () => {
      this.body.setAllowGravity(true);
      this.setGravityY(300);
      this.setVelocityY(200);
    }});
  }

  reset = () => {
    this.timeout = setTimeout(() => {
      this.disappear();
    }, 1500);
  }

  disappear = () => {
    this.body.setAllowGravity(false);
    this.setActive(false);
    this.tween = this.scene.tweens.add({targets: this, alpha: 0, duration: 500, onComplete: () => {
      this.alpha = 0;
      this.timeout = setTimeout(() => {
        this.appear();
      }, 1500);
    }});
  }

  appear = () => {
    if (this.hitCount < 3) {
      this.enemyWasHurt = false;
      this.setActive(true);
      this.setX(this.scene.getPlayer().x);
      this.setY(this.origY);
      this.scene.tweens.add({targets: this, alpha: 1, duration: 500, onComplete: () => {
        this.shaking = false;
        this.body.setAllowGravity(true);
      }});
    }
  }

  shakeCamera = () => {
    let cam = this.scene.getCam();
    if (this.shaking === false && this.body.onFloor() === true) {
      cam.shake(1000, 0.005, false, () => {}); // can't use callback as it fires every shake frame ????
      this.timeout = setTimeout(() => {
        this.scene.tweens.add({targets: this, x: this.scene.getPlayer().x, duration: 700, onComplete: () => {
          this.reset();
        }});
      }, 1000);
    }
    this.shaking = true;
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
