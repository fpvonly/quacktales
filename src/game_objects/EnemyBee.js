import '../phaser/phaser.min.js';
import GameSprite from './GameSprite.js';

export default class EnemyBee extends GameSprite {

  constructor (scene, spawn, x, y, spriteKey, delay) {
    super(scene, x, y, spriteKey);

    this.body.allowGravity = false;
    this.body.immovable = true;
    this.floatY = -25;
    this.origX = x;
    this.origY = y;
    this.velocityX = 40;
    this.direction = 'left';
    this.delay = delay;
    this.spriteKey = spriteKey;
    this.spawn = spawn;

    this.interval = null;

    this.initEnemy();
  }

  initEnemy() {
    this.setActive(false);
    this.setVisible(false);
    this.body.setAllowGravity(false);
    this.setSize(16, 16);
    this.setOffset(1, 1);
    this.setBounce(0);
    this.setGravityY(0);
    this.setGravityX(0);
    this.setCollideWorldBounds(true);
    this.setVelocityY(0);
    this.setVelocityX(0);

    this.getSpeedDirection();

    this.scene.anims.create({
      key: 'beeFly',
      frames: this.scene.anims.generateFrameNumbers(this.spriteKey, {start: 0, end: 1}),
      frameRate: 6,
      repeat: -1
    });

    this.flipX = (this.direction === 'right' ? true : false);
    this.playAnim('beeFly', true);
    if (this.direction === 'left') {
      this.velocityX = -40;
    }

    this.interval = setInterval(() => {
      this.floatY *= -1;
    }, 1500);

    setTimeout(() => {
      this.start();
    }, this.delay);
  }

  getSpeedDirection = () => {
    let velocityX = 0;
    if (this.scene && this.scene.getPlayer().x < this.x) {
      this.direction = 'left';
      this.velocityX = -40;
      this.flipX = false;
    } else {
      this.direction = 'right';
      this.velocityX = 40;
      this.flipX = true;
    }

    return velocityX;
  }


  flipDirection = () => {
    if (this.direction = 'left') {
      this.direction = 'right';
      this.velocityX = 40;
      this.flipX = true;
    } else {
      this.direction = 'left';
      this.velocityX = -40;
      this.flipX = false;
    }
  }

  start = () => {
    this.setActive(true).setVisible(true);
  }

  move = () => {
    if (this.active === true) {
      this.setVelocityY(this.floatY);
      this.setVelocityX(this.velocityX);

      if (this.scene && !Phaser.Geom.Rectangle.Overlaps(this.scene.physics.world.bounds, this.getBounds())) {
        this.die('outofbounds');
      }
    }
  }

  die = (type = '') => {
    this.setActive(false);
    this.setVelocityX(0);
    this.setVelocityY(0);
    if (this.scene && type !== 'outofbounds') {
      this.scene.tweens.add({
        targets: this,
        rotation: 10,
        x: this.x - (this.direction === 'right' ? -50 : 50),
        y: this.y + 500,
        duration: 3500,
        onComplete: () => {
          this.setVisible(false).reset();
        }
      });
    } else {
      this.setVisible(false).reset();
    }
  }

  reset = () => {
    clearInterval(this.interval);
    this.setX(this.spawn.x);
    this.setY(this.spawn.y);
    this.timeout = setTimeout(() => {
      if (this) {
        this.setActive(true).setVisible(true);
        this.getSpeedDirection();
        this.rotation = 0;
        this.interval = setInterval(() => {
          this.floatY *= -1;
        }, 1500);
      }

    }, this.delay);
  }

  clearTimeouts = () => {
    clearTimeout(this.timeout);
    clearInterval(this.interval);
  }

}
