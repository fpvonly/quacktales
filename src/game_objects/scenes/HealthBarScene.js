import '../../phaser/phaser.min.js';

export default class HealthBarScene extends Phaser.Scene {


  constructor (key) {
    super({
      key: 'HealthBarScene',
      active: true,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y : 0 },
          debug: true
        }
      }
    });

    this.items = [];
    this.lives = 0;
  }

  create() {
    this.lives = 3;
    this.physics.world.setBounds(0, 0, 100, 50);
    this.cameras.main.setBackgroundColor('#000000');
    this.cameras.main.setViewport(0, 0, 240, 35);

    let text = this.add.text(10, 10, " Lives: ", { fontSize: '20px', fill: '#FFF'});
    text.setOrigin(0, 0);

    this.items = this.physics.add.group({immovable: true, allowGravity: false});

    for (let i = 0; i < 6; i++) {
      let item = this.items.create(110 + (i*20),20, 'items');
      item.setFrame(5);
      if (this.lives >= i + 1) {
        item.alpha = 1;
      } else {
        item.alpha = 0.4;
      }
      item.setSize(16, 16);
      item.body.immovable = true;
      item.body.moves = false;
      item.body.allowGravity = false;
    }

    this.scene.get('SceneAmazon').events.on('decreaseLives', this.setLives);
    this.scene.get('SceneAmazon').events.on('increaseLives', this.setLives);
  }

  reset = () => {
    this.scene.setVisible(true);
    this.lives = 3;
    let i = 0;
    for (let item of this.items.children.entries) {
      if (this.lives >= i + 1) {
        item.alpha = 1;
      } else {
        item.alpha = 0.4;
      }
      i++;
    }
  }

  setLives = (livesCount) => {
    this.lives = livesCount;
  }

  update() {
    // let's not use a looping structure for better performance
    let items = this.items.children.entries;
    items[0].alpha = (this.lives >= 1 ? 1 : 0.4);
    items[1].alpha = (this.lives >= 2 ? 1 : 0.4);
    items[2].alpha = (this.lives >= 3 ? 1 : 0.4);
    items[3].alpha = (this.lives >= 4 ? 1 : 0.4);
    items[4].alpha = (this.lives >= 5 ? 1 : 0.4);
    items[5].alpha = (this.lives >= 6 ? 1 : 0.4);
  }

}
