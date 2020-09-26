import '../../phaser/phaser.min.js';

/*
  This is a helper class to get rid off of initialized data on a level when a restart is needed
*/
export default class RestartAmazon extends Phaser.Scene {

  constructor() {
    super({key: 'RestartAmazon'});
  }

  create = () => {
    this.scene.start('SceneAmazon');
  }

}
