import GameSprite from './GameSprite.js';

export default class EnemySpider extends GameSprite {

  constructor (scene, spawn, x, y, spriteKey, delay) {
    super(scene, x, y, spriteKey);


    this.gravityY = 0;
    this.body.allowGravity = false;
    this.spawnPosX = x;
    this.spawnPosY = y;
    this.origPosX = x;
    this.origPosY = y;
    this.spriteKey = spriteKey;
    this.delay = delay;
    this.spawn = spawn;
    this.hasBeenInit = false;
    this.attack = false;
    this.attackInterval = null;
    this.tween = null;

    this.initEnemy();
  }

  initEnemy() {
    this.setActive(false);
    this.setSize(32, 32);
    this.setOrigin(0.5, 0.5)
    this.setBounce(0);
    this.setVelocityX(0);
    this.setVelocityY(0);
    this.setGravityY(this.gravityY);
    this.setCollideWorldBounds(true);
    this.body.immovable = true;

    this.scene.anims.create({
      key: 'spiderStop',
      frames: [{key: 'spider', frame: 0}],
      frameRate: 1
    });

    this.scene.anims.create({
      key: 'spiderMove',
      frames: this.scene.anims.generateFrameNumbers('spider', {start: 0, end: 1}),
      frameRate: 6,
      repeat: -1
    });

    this.scene.anims.create({
      key: 'spiderDie',
      frames: [{key: 'spider', frame: 2}],
      frameRate: 1
    });

    this.spiderStop();

    this.attackInterval = setInterval(() => {
      if (this.hasBeenInit === true && this.active === false) {
        let r = this.reset();
      } else if (this.hasBeenInit === true && this.active === true) {
        this.attack = !this.attack;
        if (this.attack) {
          this.spiderDown();
        } else {
          this.spiderUp();
        }
      }
    }, this.delay);
  }

  move = () => {
    if (this.hasBeenInit === false) {
      this.origPosY = this.y;
      this.y = this.origPosY + 0;
      this.origPosX = this.x;
      this.setActive(true);
      this.hasBeenInit = true;
    }
  }

  die = () => {
    this.setActive(false);
    this.spiderDie();
    this.tween = null;
    this.tween = this.scene.tweens.add({targets: this, x: this.x, y: this.y + 500, duration: 3000, onComplete: this.activateReset});
  }

  activateReset = () => {
    this.allowReset = true;
    this.setActive(false).setVisible(false);
  }

  reset = () => {
    if (this && this.allowReset === true && this.scene.cam.worldView.contains(this.spawn.x, this.spawn.y) === false) {
      this.setY(this.spawn.y);
      this.setX(this.spawn.x);
      this.setVelocityY(0);
      this.setVelocityX(0);
      this.spiderUp();
      this.attack = false;
      this.tween = null;
      this.setActive(true).setVisible(true);
      this.allowReset = false;
    }

    return true;
  }

  spiderDown = () => {
    if (this.tween === null && this.y == this.origPosY) {
      this.tween = this.scene.tweens.add({targets: this, x: this.x, y: this.y + 75, duration: 1000, ease: 'none', onComplete: this.spiderUp});
    }
    this.playAnim('spiderMove', true);
  }

  spiderStopY = () => {
    this.tween = null;
    this.setVelocityY(0);
    this.setVelocityX(0);
  }

  spiderUp = () => {
    if (this.y != this.origPosY && this.active === true) {
      this.spiderStopY();
      if (this.tween === null) {
        this.tween = this.scene.tweens.add({targets: this, x: this.x, y: this.origPosY, duration: 1000, ease: 'none', onComplete: this.spiderStop});
      }
    }
    this.playAnim('spiderMove', true);
  }

  spiderStop = () => {
    this.spiderStopY();
    this.playAnim('spiderStop', true);
  }

  spiderDie = () => {
    this.playAnim('spiderDie', true);
  }

  clearTimeouts = () => {
    clearInterval(this.attackInterval);
  }

}
