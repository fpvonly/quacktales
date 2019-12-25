import '../../phaser/phaser.min.js';

export default class Preload extends Phaser.Scene {

  constructor() {
    super({key: 'PreloadScene'});

    this.loadingText = null;
    this.loadingBar = null;
    this.disclaimerText = null;
    this.pressedEnter = false;
  }

  preload () {
    this.load.audio('ducktalesTheme', 'assets/audio/ducktales_theme.mp3');
    this.load.audio('amazonTheme', 'assets/audio/amazon_theme.mp3');
    this.load.audio('gameOverSound', 'assets/audio/game_over.mp3');
    this.load.audio('deadSound', 'assets/audio/game_over.mp3');
    this.load.audio('bossBattle', 'assets/audio/boss_battle.mp3');
    this.load.audio('stageComplete', 'assets/audio/stage_complete.mp3');
    this.load.audio('pogo', 'assets/audio/pogo.wav');
    this.load.audio('hitFail', 'assets/audio/hit_fail.wav');
    this.load.audio('killEnemy', 'assets/audio/kill_enemy.wav');
    this.load.audio('touchDown', 'assets/audio/touch_down.wav');
    this.load.audio('hitOk', 'assets/audio/hit_ok.wav');
    this.load.audio('climb', 'assets/audio/climb.wav');
    this.load.audio('collect', 'assets/audio/collect.wav');
    this.load.tilemapTiledJSON('map1', 'assets/Amazon/ankronikka_level1.json');
    this.load.image('logo', 'assets/logo.png');
    this.load.image('tiles', 'assets/L1_amazon.png');
    this.load.image('hitbox', 'assets/hitbox.png');
    this.load.spritesheet('tilesB',
      'assets/L1_amazon_noextrusion.png',
      { frameWidth: 16, frameHeight: 16 }
    );
    this.load.spritesheet('items',
      'assets/items.png',
      { frameWidth: 16, frameHeight: 16 }
    );
    this.load.spritesheet('scrooge',
      'assets/scrooge.png',
      { frameWidth: 26, frameHeight: 32 }
    );
    this.load.spritesheet('scrooge_hurt',
      'assets/scrooge_hurt.png',
      { frameWidth: 24, frameHeight: 35 }
    );
    this.load.spritesheet('bee',
      'assets/bee.png',
      { frameWidth: 18, frameHeight: 18 }
    );
    this.load.spritesheet('snake',
      'assets/snake.png',
      { frameWidth: 24, frameHeight: 48 }
    );
    this.load.spritesheet('ape',
      'assets/ape.png',
      { frameWidth: 30, frameHeight: 33 }
    );
    this.load.spritesheet('plant',
      'assets/plant.png',
      { frameWidth: 24, frameHeight: 40 }
    );
    this.load.spritesheet('spider',
      'assets/spider.png',
      { frameWidth: 32, frameHeight: 32 }
    );
    this.load.spritesheet('rolling_stone',
      'assets/rolling_stone.png',
      { frameWidth: 32, frameHeight: 32 }
    );
    this.load.spritesheet('ghost',
      'assets/ghost.png',
      { frameWidth: 23, frameHeight: 24 }
    );
    this.load.spritesheet('boss',
      'assets/boss.png',
      { frameWidth: 30, frameHeight: 39 }
    );

    this.cameras.main.setBackgroundColor('#1863D6');

    this.loadingBarBG = this.add.graphics();
		this.loadingBar = this.add.graphics();
		let progressBar = new Phaser.Geom.Rectangle(200, 260, 400, 40);
		let progressBarFill = new Phaser.Geom.Rectangle(205, 265, 290, 30);
		this.loadingBarBG.fillStyle(0xffffff, 1);
		this.loadingBarBG.fillRectShape(progressBar);
		this.loadingBar.fillStyle(0x3587e2, 1);
		this.loadingBar.fillRectShape(progressBarFill);
		this.loadingText = this.add.text(320, 330, "Loading: ", { fontSize: '20px', fill: '#FFF' });

    this.load.on('progress', this.updateBar);
    this.load.on('complete', this.complete);
  }

  updateBar = (percentage) => {
    this.loadingBar.clear();
    this.loadingBar.fillStyle(0x3587e2, 1);
    this.loadingBar.fillRectShape(new Phaser.Geom.Rectangle(205, 265, percentage*390, 30));
    percentage = percentage * 100;
    this.loadingText.setText("Loading: " + percentage.toFixed(0) + "%");
	}

  complete = () => {
    this.loadingText.setText("Press Enter to continue");
    this.loadingText.setX(260);
    this.disclaimerText = this.add.text(50, 400, "", { fontSize: '20px', fill: '#FFF' });
    this.disclaimerText.setText(
      "Disclaimer: This game is made for personal educational and \ndemo purposes. The original DuckTales game is the property \nof Capcom Co., Ltd."
    );
    this.input.keyboard.on('keydown_ENTER', this.proceedToGameTitleScreen);
  }

  proceedToGameTitleScreen = () => {
    if (this.pressedEnter === false) { // avoid multiple key presses
      this.pressedEnter = true;
      this.scene.start('TitleScene');
    }
  }
}
