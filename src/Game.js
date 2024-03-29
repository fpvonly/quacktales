import './phaser/phaser.min.js';
import PreloadScene from './game_objects/scenes/PreloadScene.js';
import TitleScene from './game_objects/scenes/TitleScene.js';
import RestartAmazon from './game_objects/scenes/RestartAmazon.js';
import SceneAmazon from './game_objects/scenes/SceneAmazon.js';

let isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
let isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  pixelArt: true,
  antialias: false,
  roundPixels: false,
  fps: {target: 240}
};

let game = new Phaser.Game(config);
game.scene.add('PreloadScene', PreloadScene);
game.scene.add('TitleScene', TitleScene);
game.scene.add('RestartAmazon', RestartAmazon);
game.scene.add('SceneAmazon', SceneAmazon);
game.scene.start('PreloadScene');
