import EnemyApe from './EnemyApe.js';
import EnemySnake from './EnemySnake.js';
import EnemyBee from './EnemyBee.js';
import EnemyPlant from './EnemyPlant.js';
import EnemySpider from './EnemySpider.js';
import EnemyGhost from './EnemyGhost.js';
import EnemyBoss from './EnemyBoss.js';

export default class Enemy {

  constructor (scene, spawn, x, y, spriteKey, type, delay = 1000, doNotReAppearAfterDeath = false) {
    if (type === 'APE') {
      return new EnemyApe(scene, spawn, x, y, spriteKey, delay, doNotReAppearAfterDeath);
    } else if (type === 'SNAKE') {
      return new EnemySnake(scene, spawn, x, y, spriteKey);
    } else if (type === 'BEE') {
      return new EnemyBee(scene, spawn, x, y, spriteKey, delay);
    } else if (type === 'PLANT') {
      return new EnemyPlant(scene, spawn, x, y, spriteKey);
    } else if (type === 'PLANTUPSIDEDOWN') {
      return new EnemyPlant(scene, spawn, x, y, spriteKey, true);
    } else if (type === 'SPIDER') {
      return new EnemySpider(scene, spawn, x, y, spriteKey, delay);
    } else if (type === 'GHOST') {
      return new EnemyGhost(scene, spawn, x, y, spriteKey, delay);
    } else if(type === 'BOSS') {
      return new EnemyBoss(scene, x, y, spriteKey);
    }
  }

}
