import './phaser/phaser.min.js';
import PreloadScene from './Preload.js';
import TitleScene from './titleScene.js';
import RestartAmazon from './RestartAmazon.js';
import SceneAmazon from './SceneAmazon.js';

var config = {
  type: Phaser.CANVAS,
  width: 800,
  height: 600,
  pixelArt: true,
  antialias: false,
  roundPixels: false,
  fps: {target: 60}
};

let game = new Phaser.Game(config);
game.scene.add('PreloadScene', PreloadScene);
game.scene.add('TitleScene', TitleScene);
game.scene.add('RestartAmazon', RestartAmazon);
game.scene.add('SceneAmazon', SceneAmazon);
game.scene.start('PreloadScene');
