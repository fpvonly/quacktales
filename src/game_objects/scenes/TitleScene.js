import '../../phaser/phaser.min.js';

export default class TitleScene extends Phaser.Scene {

  constructor() {
    super({key: 'TitleScene'});

    this.gameThemeAudio = null;
    this.pressedEnter = false;
  }

  create = () => {
    this.cameras.main.setBackgroundColor('#1863D6');
		let loadingText = this.add.text(400, 330, "Press Enter to play ", { fontSize: '20px', fill: '#FFF' });
    loadingText.setOrigin(0.5, 0);
    let guideText = this.add.text(400, 400, '', { fontSize: '20px', fill: '#FFF' });
    guideText.setText('             Controls:\n\n Arrow-keys = move, jump, duck, climb\n Space-key = pogo jump, hit objects');
    guideText.setOrigin(0.5, 0);

    this.gameThemeAudio = this.sound.add('ducktalesTheme');
    this.gameThemeAudio.setVolume(0.3);
    this.gameThemeAudio.play({loop: true});

    this.add.image(400, 200, 'logo');

    this.pressedEnter = false;
    this.input.keyboard.on('keydown_ENTER', this.play);
  }

  play = () => {
    if (this.pressedEnter === false) {
      this.pressedEnter = true;
      this.gameThemeAudio.stop();
      this.scene.start('SceneAmazon');
    }
  }
}
