import './phaser/phaser.min.js';
import GameSprite from './GameSprite.js';

export default class Pompeli extends GameSprite {

  constructor (scene, x, y, spriteKey) {

    super(scene, x, y, spriteKey);

    this.setSize(16, 16);
    this.setBounce(0);
    this.setCollideWorldBounds(true);
    this.body.immovable = true;
    this.moving = false;
    this.body.allowGravity = true;

    this.scene.anims.create({
      key: 'pompeli',
      frames: [{key: 'items', frame: 18}],
      frameRate: 1
    });

    this.setVelocityX(0);
    this.setVelocityY(0);

    this.playAnim('pompeli');
  }

  moveTo = (dir = 'right') => {
    this.moving = true;

    if (this.body.onWall()) {
      this.moving = false;
    } else {
      this.moving = true;
    }
    if (this.moving === true) {
      if (dir === 'right') {
        this.setVelocityX(200);
        this.setVelocityY(0);
      } else {
        this.setVelocityX(-200);
        this.setVelocityY(0);
      }
    }

  }

}
