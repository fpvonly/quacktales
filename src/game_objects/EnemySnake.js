import GameSprite from './GameSprite.js';

export default class EnemySnake extends GameSprite {

  constructor (scene, spawn, x, y, spriteKey) {
    super(scene, x, y, spriteKey);

    this.gravityY = 0;
    this.body.allowGravity = true;
    this.attack = false;
    this.spawnPosX = x;
    this.spawnPosY = y;
    this.origPosX = x;
    this.origPosY = y;
    this.attackPosY = y;
    this.spriteKey = spriteKey;

    this.hasBeenInit = false;
    this.interval = null;
    this.allowReset = false;
    this.spawn = spawn;

    this.initEnemy();
  }

  initEnemy() {
    this.setActive(false);
    this.setBounce(0);
    this.setVelocityX(0);
    this.setVelocityY(0);
    this.setGravityY(this.gravityY);
    this.setCollideWorldBounds(true);
    this.body.immovable = true;

    this.scene.anims.create({
      key: 'snakeDown',
      frames: this.scene.anims.generateFrameNumbers(this.spriteKey, {start: 0, end: 1}),
      frameRate: 1,
      repeat: -1
    });

    this.scene.anims.create({
      key: 'snakeUp',
      frames: this.scene.anims.generateFrameNumbers(this.spriteKey, {start: 3, end: 4}),
      frameRate: 2,
      repeat: -1
    });

    this.scene.anims.create({
      key: 'snakeDie',
      frames: [{key: this.spriteKey, frame: 2}],
      frameRate: 1
    });

    this.interval = setInterval(() => {
      if (this.scene) {
        if (this.scene.getPlayer().body.x > this.body.x) {
          this.flipX = true;
        } else {
          this.flipX = false;
        }
        if (this.hasBeenInit === true && this.active === false) {
          let r = this.reset();
        }

        if (this.hasBeenInit === true && this.active === true) {
          this.attack = !this.attack;
          if (this.attack) {
            this.snakeUp();
          } else {
            this.snakeDown();
          }
        }
      }
    }, 3000);

    this.snakeDown();
  }

  move = () => {
    if (this.hasBeenInit === false && this.body.onFloor() === true) {
      this.origPosY = this.y;
      this.y = this.origPosY + 0;
      this.origPosX = this.x;
      this.attackPosY = this.origPosY;
      this.setActive(true);
      this.hasBeenInit = true;
    }
  }

  die = () => {
    this.snakeDie();
    this.setActive(false);
    if (this.scene) {
      this.scene.tweens.add({targets: this, x: this.x - 20, y: this.y + 500, duration: 3000, onComplete: this.activateReset});
    }
  }

  activateReset = () => {
    this.allowReset = true;
    this.setActive(false).setVisible(false);
  }

  reset = () => {
    if (this.allowReset === true) {
      if (this.scene && this.scene.cam.worldView.contains(this.spawnPosX, this.spawnPosY) === false) {
        this.attack = false;
        this.setY(this.spawnPosY);
        this.setX(this.spawnPosX);
        this.setVelocityY(0);
        this.setVelocityX(0);
        this.snakeDown();
        this.hasBeenInit = false;
        this.setActive(true).setVisible(true);
        this.allowReset = false;

        return true;
      }
    }
    return false;
  }

  snakeUp = () => {
    this.setSize(24, 48);
    this.playAnim('snakeUp', true);
    this.setOffset(0, 0);
  }

  snakeDown = () => {
    this.setSize(24, 28);
    this.playAnim('snakeDown', true);
    this.setOffset(0, 20);
  }

  snakeDie = () => {
    this.setSize(24, 28);
    this.playAnim('snakeDie', true);
    this.setOffset(0, 20);
  }

  clearTimeouts = () => {
    clearInterval(this.interval);
  }

}
