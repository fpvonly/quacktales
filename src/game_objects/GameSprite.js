import '../phaser/phaser.min.js';

export default class GameSprite extends Phaser.Physics.Arcade.Sprite {

  constructor (scene, x, y, spriteKey) {
    super(scene, x, y, spriteKey);

    this.name = spriteKey;
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
  }

  playAnim = (key, ignoreIfPlaying = false, playReverse = false) => {
    if (key) {
      if (playReverse === true) {
        this.anims.playReverse(key, ignoreIfPlaying);
      } else {
        this.anims.play(key, ignoreIfPlaying);
      }

    }
  }

  stopAnim = () => {
    this.anims.stop();
  }

}
