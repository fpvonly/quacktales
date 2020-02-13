import GameSprite from './GameSprite.js';

export default class EnemyApe extends GameSprite {

  constructor (scene, spawn, x, y, spriteKey, delay) {
    super(scene, x, y, spriteKey);

    this.oldX = -1;
    this.gravityY = 50;
    this.body.allowGravity = true
    this.body.immovable = false;
    this.origX = x;
    this.origY = y;
    this.direction = 'left';
    this.velocityX = 70;
    this.delay = delay;
    this.jumpCounter = 0;
    this.standingOnSomething = false;
    this.spriteKey = spriteKey;
    this.spawn = spawn;
    this.timeout = null;

    this.initEnemy();
  }

  initEnemy() {
    this.setSize(25, 32);
    this.setBounce(0);
    this.setGravityY(this.gravityY);
    this.setCollideWorldBounds(true);
    this.body.maxSpeed = 250;

    let speed = this.getSpeedDirection();

    this.scene.anims.create({
      key: 'apeWalk',
      frames: this.scene.anims.generateFrameNumbers(this.spriteKey, {start: 0, end: 1}),
      frameRate: 6,
      repeat: -1
    });

    this.scene.anims.create({
      key: 'apeDie',
      frames: [{key: this.spriteKey, frame: 2}],
      frameRate: 1
    });

    this.playAnim('apeWalk', true);
  }

  getSpeedDirection = () => {
    if (this.scene && this.scene.getPlayer().body.x < this.body.x) {
      this.direction = 'left';
      this.velocityX = -70;
      this.flipX = false;
    } else {
      this.direction = 'right';
      this.velocityX = 70;
      this.flipX = true;
    }

    return this.velocityX;
  }

  flipDirection = () => {
    if (this.direction === 'left') {
      this.direction = 'right';
      this.velocityX = 70;
      this.flipX = true;
    } else {
      this.direction = 'left';
      this.velocityX = -70;
      this.flipX = false;
    }
  }

  move = () => {
    if (this.active === true) {
      let bodyX = Math.floor(this.body.x);
      if (this.body.onFloor() === true && (this.body.onWall() || bodyX === this.oldX)) {
        this.setVelocityY(-160);
        this.jumpCounter++;
      }

      if (this.jumpCounter > 3) {
        this.flipDirection();
        this.jumpCounter = 0;
      }

      this.setVelocityX(this.velocityX);
      this.oldX = bodyX;
    }

    if (this.scene && !Phaser.Geom.Rectangle.Overlaps(this.scene.physics.world.bounds, this.getBounds())) {
      this.die('outofbounds');
    }
  }

  die = (type = '') => {
    this.setVelocityX(0);
    this.setVelocityY(0);
    this.playAnim('apeDie', true);

    if (type !== 'outofbounds' && this.scene) {
      this.scene.tweens.add({targets: this, x: this.x - 20, y: this.y +500, duration: 4000, onComplete: () => {
        this.setActive(false).setVisible(false).reset();
      }});
    } else {
      this.setActive(false).setVisible(false).reset();
    }
  }

  reset = () => {
    this.timeout = setTimeout(() => {
      if (this) {
        this.setX(this.spawn.x);
        this.setY(this.spawn.y);
        this.oldX = -1;
        this.jumpCounter = 0;
        this.getSpeedDirection();
        this.isStandingOnSomething(false);
        this.playAnim('apeWalk', true);
        this.setActive(true).setVisible(true);
      }
    }, 1000);
  }

  isStandingOnSomething = (is = -1) => {
    if (is === -1) {
      return  this.standingOnSomething;
    } else {
      this.standingOnSomething = is;
    }
  }

  clearTimeouts = () => {
    clearTimeout(this.timeout);
  }

}
