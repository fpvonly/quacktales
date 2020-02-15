import GameSprite from './GameSprite.js';
import {playerInRange} from './funcs.js';

export default class EnemyPlant extends GameSprite {

  constructor (scene, spawn, x, y, spriteKey, flipY = false) {
    super(scene, x, y, spriteKey);

    this.yIsFlipped = flipY;
    this.gravityY = 0;
    this.body.allowGravity = (flipY === true ? false : true);
    this.spawnPosX = x;
    this.spawnPosY = y;
    this.origPosX = x;
    this.origPosY = y;
    this.attackPosY = y;
    this.spriteKey = spriteKey;
    this.spawn = spawn;

    this.hasBeenInit = false;
    this.interval = null;

    this.initEnemy();
  }

  initEnemy() {
    this.setActive(false);
    this.flipY = this.yIsFlipped;
    if (this.yIsFlipped === true) {
      this.setOrigin(0.5, 0)
    } else  {
      this.setOrigin(0.5, 1)
    }
    this.setBounce(0);
    this.setVelocityX(0);
    this.setVelocityY(0);
    this.setGravityY(this.gravityY);
    this.setCollideWorldBounds(true);
    this.body.immovable = true;

    this.scene.anims.create({
      key: 'plantDown',
      frames: [{key: this.spriteKey, frame: 0}],
      frameRate: 1
    });

    this.scene.anims.create({
      key: 'plantUp',
      frames: this.scene.anims.generateFrameNumbers(this.spriteKey, {start: 1, end: 2}),
      frameRate: 6,
      repeat: -1
    });

    this.scene.anims.create({
      key: 'plantDie',
      frames: [{key: this.spriteKey, frame: 3}],
      frameRate: 1
    });

    this.plantDown();
  }

  move = () => {
    if (this.hasBeenInit === false && (this.body.onFloor() === true || this.yIsFlipped === true)) {
      this.origPosY = this.y;
      this.setY(this.origPosY);
      this.origPosX = this.x;
      this.attackPosY = this.origPosY;
      this.setActive(true);
      this.hasBeenInit = true;
    } else if (playerInRange(this, this.scene.getPlayer()) === true) {
      this.plantUp();
    } else {
      this.plantDown();
    }
  }

  die = () => {
    this.setActive(false);
    this.plantDie();
    if (this.scene) {
      this.scene.tweens.add({targets: this, x: this.x - 20, y: this.y + 500, duration: 3000, onComplete: this.activateReset});
    }
  }

  activateReset = () => {
    this.setActive(false).setVisible(false);
    this.interval = setInterval(() => {
      if (this.hasBeenInit === true && this.active === false) {
        let r = this.reset();
      }
    }, 3000);
  }

  reset = () => {
    if (this && this.scene && this.scene.cam.worldView.contains(this.spawn.x, this.spawn.y) === false) {
      this.setY(this.spawn.y);
      this.setX(this.spawn.x);
      this.setVelocityY(0);
      this.setVelocityX(0);
      this.plantDown();
      this.hasBeenInit = false;
      this.setActive(true).setVisible(true);
    }
  }

  plantUp = () => {
    this.setSize(24, 40);
    this.playAnim('plantUp', true);
    if (this.yIsFlipped === false) {
      this.setOffset(0, 0);
    }
    //this.setOffset(0, (this.yIsFlipped === true ? 40 : 0));
  }

  plantDown = () => {
    this.setSize(24, 20);
    this.playAnim('plantDown', true);
    if (this.yIsFlipped === false) {
      this.setOffset(0, 20);
    } else {
      this.setOffset(0, 0);
    }
    //this.setOffset(0, (this.yIsFlipped === true ? 40 : 20));
  }

  plantDie = () => {
    this.setSize(24, 20);
    this.playAnim('plantDie', true);
    this.setOffset(0, (this.yIsFlipped === true ? 40 : 20));
  }

  clearTimeouts = () => {
    clearTimeout(this.timeout);
    clearInterval(this.interval);
  }

}
