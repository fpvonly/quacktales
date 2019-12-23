import './phaser/phaser.min.js';
import GameSprite from './GameSprite.js';

export default class RoundRock extends GameSprite {

  constructor (scene, x, y, spriteKey) {

    super(scene, x, y, spriteKey);

    this.setSize(16, 16);
    this.setBounce(0);
    this.setCollideWorldBounds(true);
    this.body.immovable = true;
    this.moving = false;
    this.body.allowGravity = true;

    this.scene.anims.create({
      key: 'rock_ok',
      frames: [{key: 'items', frame: 17}],
      frameRate: 1
    });

    this.scene.anims.create({
      key: 'rock_hit',
      frames: [{key: 'items', frame: 13}],
      frameRate: 1
    });

    this.setVelocityX(0);
    this.setVelocityY(0);

    this.playAnim('rock_ok');
  }

  disable = () => {
    this.playAnim('rock_hit');
    this.setVelocityX(0);
    this.setVelocityY(0);
    this.moving = false;
    this.allowGravity = false;
    setTimeout(() => {
      this.destroy();
    }, 100);
  }


  moveTo = (dir = 'right', rock) => {
    this.moving = true;
    if (dir === 'right') {
      this.allowGravity = false;
      this.setBounce(1);
      this.setVelocity(250, -250);
      this.setCollideWorldBounds(true);
    } else {
      this.allowGravity = false;
      this.setBounce(1);
      this.setVelocity(-250, -250);
      this.setCollideWorldBounds(true);
    }
  }

}
