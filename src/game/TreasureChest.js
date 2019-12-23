import './phaser/phaser.min.js';
import GameSprite from './GameSprite.js';
import Diamond from './Diamond.js';

export default class TreasureChest extends GameSprite {

  constructor (scene, x, y, spriteKey) {

    super(scene, x, y, spriteKey);

    this.setSize(16, 16);
    this.setBounce(0);
    this.setCollideWorldBounds(true);
    this.body.immovable = true;
    this.body.allowGravity = true;

    this.scene.anims.create({
      key: 'chest',
      frames: [{key: 'items', frame: 19}],
      frameRate: 1
    });

    this.scene.anims.create({
      key: 'explode',
      frames: [{key: 'items', frame: 22}, {key: 'items', frame: 23}, {key: 'items', frame: 29}],
      frameRate: 8,
      repeat: 0
    });

    this.setVelocityX(0);
    this.setVelocityY(0);

    this.playAnim('chest');

    this.diamond = new Diamond(scene, this.x, this.y, 'items', this);
    this.diamond.setActive(false);
    this.diamond.setVisible(false);
  }

  explode = () => {
    this.playAnim('explode', true);
    this.body.enable = false;
    this.diamond.activate();
    this.once('animationcomplete', () => {
      this.setActive(false);
      this.setVisible(false);          
    });
  }

}
