import '../../phaser/phaser.min.js';
import HealthBarScene from './HealthBarScene.js';
import Player from '../Player.js';
import Enemy from '../Enemy.js';
import RoundRock from '../RoundRock.js';
import Pompeli from '../Pompeli.js';
import TreasureChest  from  '../TreasureChest.js';
import FallingStone from '../FallingStone.js';
import RollingStone from '../RollingStone.js';
import GameSprite from '../GameSprite.js';

export default class SceneAmazon extends Phaser.Scene {

  constructor() {
    super({
      key: 'SceneAmazon',
      active: false,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y : 300 },
          tileBias: 5,
          debug: false
        }
      }

      });

      this.cameraOrigY = 0;
      this.fixedX = 0;

      this.map;
      this.mapTiles;
      this.platforms;
      this.player;
      this.FINAL_BOSS_FIGHT = false;
      this.activateBossFightInterval = null;
      this.hitObject = null; // hit enabled object currently ready
      this.bridgeIsCrumbling = false;

      // Sprites and groups
      this.enemies = null;
      this.enemiesFloating = null;
      this.lians = null;
      this.rocks = null;
      this.pompelis = null;
      this.spikeAreas = null;
      this.rollingStoneBall = null;
      this.BOSS = null;
      this.deathSpots = null;

      // Spawns
      this.bridge = [];
      this.fallingCeiling = [];
      this.roundRockSpawnPoints = [];
      this.pompeliSpawnPoints = [];
      this.treasureSpawnPoints = [];
      this.apeSpawnPoints = [];
      this.snakeSpawnPoints = [];
      this.plantSpawnPoints = [];
      this.plantUpsideDownSpawnPoints = [];
      this.beeSpawnPoints = [];
      this.ghostSpawnPoints = [];
      this.spiderSpawnPoints = [];

      // Enemy/player collision listener objects
      this.collideWithBees = null;
      this.collideWithGroundEnemies = null;
      this.collideWithHangingPlantEnemies = null;
      this.collideWithHangingSpiderEnemies = null;
      this.collideWithSpikes = null;
      this.collideWithGhosts = null;

      this.cameraLvl = 1; // 0 (underground area), 1, 2, 3, 4, 5 (top-most boss level corridor)

      this.levelThemeAudio = null;
      this.gameOverAudio = null;
      this.gameWinAudio = null;
      this.bossBattleAudio = null;
      this.pogoAudio = null;
      this.hitFailAudio = null;

      this.HealthBarScene = null;
  }

  preload () {}

  create () {
    this.restartInit = false; // prevent events causing multiple restarts at once

    this.HealthBarScene = this.scene.get('HealthBarScene');
    if (typeof this.HealthBarScene === 'undefined' || this.HealthBarScene === null) {
      this.HealthBarScene = this.scene.add('HealthBarScene', HealthBarScene, true, { x:0, y:0 });
      this.HealthBarScene.reset();
    } else {
      this.HealthBarScene.reset();
    }

    this.FINAL_BOSS_FIGHT = false;
    this.bridgeIsCrumbling = false;
    this.physics.world.setFPS(60);
    this.cameraLvl = 1;
    this.cam = this.cameras.main;
    this.cam.roundPixels = false;
    this.cam.setZoom(2.4);
    this.cam.fadeIn(1000);

    // Audio
    this.levelThemeAudio = this.sound.add('amazonTheme');
    this.levelThemeAudio.setVolume(0.3);
    this.levelThemeAudio.play({loop: true});
    this.gameOverAudio = this.sound.add('gameOverSound');
    this.gameOverAudio.setVolume(0.3);
    this.gameWinAudio = this.sound.add('stageComplete');
    this.gameWinAudio.setVolume(0.3);
    this.bossBattleAudio = this.sound.add('bossBattle');
    this.bossBattleAudio.setVolume(0.3);
    this.pogoAudio = this.sound.add('pogo');
    this.pogoAudio.setVolume(0.3);
    this.hitFailAudio = this.sound.add('hitFail');
    this.hitFailAudio.setVolume(0.3);
    this.killAudio = this.sound.add('killEnemy');
    this.killAudio.setVolume(0.3);
    this.touchDownAudio = this.sound.add('touchDown');
    this.touchDownAudio.setVolume(0.3);
    this.hitOkAudio = this.sound.add('hitOk');
    this.hitOkAudio.setVolume(0.3);
    this.climbAudio = this.sound.add('climb');
    this.climbAudio.setVolume(0.3);
    this.collectAudio = this.sound.add('collect');
    this.collectAudio.setVolume(0.3);


    // Map and Layers
    this.map = this.make.tilemap({key: 'map1'});
    this.map.setCollisionByProperty({ collides: true });
    this.mapTiles = this.map.addTilesetImage('L1_amazon', 'tiles', 16, 16, 1, 2); // name, spritesheet key, width, height, margin to image sheet edge, spacing between spritesheet tiles
    this.bgLayer = this.map.createDynamicLayer('bg', this.mapTiles, 0, 0);
    this.platforms = this.map.createDynamicLayer('level platforms', this.mapTiles, 0, 0);
    this.physics.world.setBounds(0, 0, this.bgLayer.width, this.bgLayer.height);
    this.platforms.setCollisionByExclusion([-1]);
    this.platforms.setScale(1.0);

    // Spawn points and other game objects
    this.PLAYER_SPAWN_LEVEL_0 = this.map.createFromObjects('PLAYER SPAWN', 'player0')[0];
    this.PLAYER_SPAWN_LEVEL_1 = this.map.createFromObjects('PLAYER SPAWN', 'player1')[0];
    this.PLAYER_SPAWN_LEVEL_2 = this.map.createFromObjects('PLAYER SPAWN', 'player2')[0];
    this.PLAYER_SPAWN_LEVEL_3 = this.map.createFromObjects('PLAYER SPAWN', 'player3')[0];
    this.PLAYER_SPAWN_LEVEL_4 = this.map.createFromObjects('PLAYER SPAWN', 'player4')[0];
    this.PLAYER_SPAWN_LEVEL_5 = this.map.createFromObjects('PLAYER SPAWN', 'player5')[0];
    this.ACTIVATE_BOSS_FIGHT = this.map.createFromObjects('BOSS FIGHT', 'activate_boss_fight')[0];
    this.BOSS_SPAWN_POINT = this.map.createFromObjects('BOSS FIGHT', 'boss_spawn')[0];
    this.DEATH_SPOTS = this.map.createFromObjects('DEATH SPOTS', 'death_spot');
    this.spikeObjects = this.map.createFromObjects('Spike areas', 'spike area');
    this.lianObjects = this.map.createFromObjects('Lian objects', 'lian');
    this.bridge = this.map.createFromObjects('Bridge', 'bridge_brick');
    this.fallingCeiling = this.map.createFromObjects('Falling ceiling', 'ceiling_stone');
    this.rollingRockBallSpawnPoint = this.map.createFromObjects('Rolling rock ball', 'ball')[0];
    this.roundRockSpawnPoints = this.map.createFromObjects('Rock spawn points', 'rock_spawn');
    this.pompeliSpawnPoints = this.map.createFromObjects('Pompeli spawn points', 'pompeli_spawn');
    this.treasureSpawnPoints = this.map.createFromObjects('Treasure spawn points', 'treasure_spawn');
    this.apeSpawnPoints = this.map.createFromObjects('Enemy spawn points', 'ape_spawn');
    this.snakeSpawnPoints = this.map.createFromObjects('Enemy spawn points', 'snake_spawn');
    this.plantSpawnPoints = this.map.createFromObjects('Enemy spawn points', 'plant_spawn');
    this.plantUpsideDownSpawnPoints = this.map.createFromObjects('Enemy spawn points', 'plant_upsidedown_spawn');
    this.beeSpawnPoints = this.map.createFromObjects('Enemy spawn points', 'bee_spawn');
    this.ghostSpawnPoints = this.map.createFromObjects('Enemy spawn points', 'ghost_spawn');
    this.spiderSpawnPoints = this.map.createFromObjects('Enemy spawn points', 'spider_spawn');


    // CAMERA settings based on the map loaded
    this.cameraOrigX = this.map.createFromObjects('Camera levels', 'platform_1')[0].x;
    this.cameraOrigY = this.map.createFromObjects('Camera levels', 'platform_1')[0].y - 70;
    this.cameraLevel0 = this.map.createFromObjects('Camera levels', 'platform_0')[0];
    this.cameraLevel1 = this.map.createFromObjects('Camera levels', 'platform_1')[0];
    this.cameraLevel2 = this.map.createFromObjects('Camera levels', 'platform_2')[0];
    this.cameraLevel3 = this.map.createFromObjects('Camera levels', 'platform_3')[0];
    this.cameraLevel4 = this.map.createFromObjects('Camera levels', 'platform_4')[0];
    this.cameraLevel5 = this.map.createFromObjects('Camera levels', 'platform_5')[0];


    // Init player and add to the map and make camera follow
    this.player = new Player(this,
      this.PLAYER_SPAWN_LEVEL_1.x,
      this.PLAYER_SPAWN_LEVEL_1.y,
      'scrooge',
      {
        'pogoAudio': this.pogoAudio,
        'hitOkAudio': this.hitOkAudio,
        'hitFailAudio': this.hitFailAudio,
        'touchDownAudio': this.touchDownAudio,
        'climbAudio': this.climbAudio
      }
    );
    this.cam.setBounds(0, 0, this.platforms.width, this.platforms.height);
    this.camDolly = new Phaser.Geom.Point(this.player.x, this.cameraOrigY);
    this.cam.startFollow(this.camDolly);


    /** ENEMIES **/

    this.enemies = this.physics.add.group({immovable: false});

    // apes
    for (let apeSpawn of this.apeSpawnPoints) {
      for (let i = 1; i < 3; i++) {
        let ape = new Enemy(this, apeSpawn, apeSpawn.x, apeSpawn.y, 'ape', 'APE', i * 4000);
        this.enemies.add(ape, true);
      }
    }

    // snakes
    for (let snakeSpawn of this.snakeSpawnPoints) {
      let snake = new Enemy(this, snakeSpawn, snakeSpawn.x, snakeSpawn.y - 50, 'snake', 'SNAKE');
      this.enemies.add(snake, true);
    }

    // plants
    for (let plantSpawn of this.plantSpawnPoints) {
      let plant = new Enemy(this, plantSpawn, plantSpawn.x, plantSpawn.y, 'plant', 'PLANT');
      this.enemies.add(plant, true);
    }

    // plants upsidedown
    this.hangingPlantEnemies = this.physics.add.group({immovable: true, allowGravity: false});
    for (let plantSpawn of this.plantUpsideDownSpawnPoints) {
      let plant = new Enemy(this, plantSpawn, plantSpawn.x, plantSpawn.y, 'plant', 'PLANTUPSIDEDOWN');
      this.hangingPlantEnemies.add(plant, true);
    }

    // spiders
    this.hangingSpiderEnemies = this.physics.add.group({immovable: true, allowGravity: false});
    let everyOther = false;
    for (let spiderspawn of this.spiderSpawnPoints) {
      everyOther = !everyOther;
      let spider = new Enemy(this, spiderspawn, spiderspawn.x, spiderspawn.y, 'spider', 'SPIDER', (everyOther ? 2000 : 3300));
      this.hangingSpiderEnemies.add(spider, true);
    }

    // bees
    this.beeEnemies = this.physics.add.group({
        immovable: true,
        allowGravity: false
    });

    for (let beeSpawn of this.beeSpawnPoints) {
      for (let i = 1; i < 3; i++) {
        let bee = new Enemy(this, beeSpawn, beeSpawn.x, beeSpawn.y, 'bee', 'BEE', i * 10000);
        this.beeEnemies.add(bee, true);
      }
    }

    // ghosts
    this.ghostEnemies = this.physics.add.group({
        immovable: true,
        allowGravity: false
    });

    for (let ghostSpawn of this.ghostSpawnPoints) {
      for (let i = 0; i < 5; i++) {
        let ghost = new Enemy(this, ghostSpawn, ghostSpawn.x, ghostSpawn.y, 'ghost', 'GHOST', i * 6000);
        this.ghostEnemies.add(ghost, true);
      }
    }

    // The BOSS
    this.BOSS = new Enemy(this, this.BOSS_SPAWN_POINT, this.BOSS_SPAWN_POINT.x, this.BOSS_SPAWN_POINT.y, 'boss', 'BOSS');

    /** DYNAMIC MAP PARTS **/

    // Death over spots
    this.deathSpots = this.physics.add.group({immovable: true});
    for (let death of this.DEATH_SPOTS) {
      let d = this.deathSpots.create(death.x, death.y, 'hitbox');
      d.setSize(death.displayWidth, death.displayHeight);
      d.body.immovable = true;
      d.body.moves = false;
      d.body.allowGravity = false;
    }

    // Boss fight trigger
    this.bossFightTriggerPoint = this.physics.add.sprite(this.ACTIVATE_BOSS_FIGHT.x, this.ACTIVATE_BOSS_FIGHT.y, 'hitbox').setInteractive();
    this.bossFightTriggerPoint.setCollideWorldBounds(true);
    this.bossFightTriggerPoint.setSize(16, 16);
    this.bossFightTriggerPoint.allowGravity = false;
    this.bossFightTriggerPoint.immovable = true;

    // Bridge
    this.bridgeStones = this.physics.add.group({immovable: true, allowGravity: false});
    for (let st of this.bridge) {
      let stone = new FallingStone(this, st.x, st.y, 'tilesB', this.bridgeStones, this.interactWithBridge, false);
      stone.setSize(st.displayWidth, st.displayHeight);
      stone.body.immovable = true;
      stone.body.moves = false;
      stone.body.allowGravity = false;
      this.bridgeStones.add(stone, true);
    }

    // Falling ceiling
    this.ceilingStones = this.physics.add.group({immovable: true, allowGravity: false});
    for (let ct of this.fallingCeiling) {
      let stone = new FallingStone(this, ct.x, ct.y, 'tilesB', this.ceilingStones, this.interactWithCeiling, true, this.hurtPlayer);
      stone.setSize(ct.displayWidth, ct.displayHeight);
      this.ceilingStones.add(stone, true);
    }

    // Spikes
    this.spikeAreas = this.physics.add.group({immovable: true});
    for (let spikeArea of this.spikeObjects) {
      let spike = this.spikeAreas.create(spikeArea.x, spikeArea.y, 'hitbox');
      spike.setSize(spikeArea.displayWidth, spikeArea.displayHeight);
      spike.name = 'spikes';
      spike.body.immovable = true;
      spike.body.moves = false;
      spike.body.allowGravity = false;
      this.spikeAreas.add(spike, true);
    }

    // Lians
    this.lians = this.physics.add.group({immovable: true, allowGravity: false});
    for (let child of this.lianObjects) {
      let lian = this.lians.create(child.x, child.y, 'hitbox');
      lian.body.immovable = true;
      lian.body.moves = false;
      lian.body.allowGravity = false;
      lian.setSize(2, child.height*child._scaleY);
      this.lians.add(lian, true);
    }

    // Rolling stone ball
    this.rollingStoneBall = new RollingStone(this, this.rollingRockBallSpawnPoint.x, this.rollingRockBallSpawnPoint.y, 'rolling_stone', this.hurtPlayer);

    // Round rocks
    this.rocks = this.physics.add.group({immovable: true, allowGravity: true});
    for (let rockSpawn of this.roundRockSpawnPoints) {
      let rock = new RoundRock(this, rockSpawn.x, rockSpawn.y-20, 'items');
      this.rocks.add(rock, true);
    }

    // Pompelis
    this.pompelis = this.physics.add.group({immovable: true, allowGravity: true});
    for (let pompeliSpawn of this.pompeliSpawnPoints) {
      let pompeli = new Pompeli(this, pompeliSpawn.x, pompeliSpawn.y, 'items');
      this.pompelis.add(pompeli, true);
    }

    // Treasure chests
    this.treasures = this.physics.add.group({immovable: true, allowGravity: true});
    for (let treasureSpawn of this.treasureSpawnPoints) {
      let treasure = new TreasureChest(this, treasureSpawn.x, treasureSpawn.y, 'items');
      this.treasures.add(treasure, true);
    }


    // Interactions between player and game world

    // collisions
    this.c1 = this.physics.add.collider(this.player, this.platforms);
    this.c2 = this.physics.add.collider(this.player, this.rocks, this.enableHitRock);
    this.c3 = this.physics.add.collider(this.player, this.pompelis, this.enableHitPompeli);
    this.c4 = this.physics.add.collider(this.player, this.treasures, this.enableHitTreasure);
    this.c5 = this.physics.add.collider(this.rocks, this.platforms, this.destroyRock);
    this.c6 = this.physics.add.collider(this.pompelis, this.platforms);
    this.c7 = this.physics.add.collider(this.treasures, this.platforms);
    this.c8 = this.physics.add.collider(this.enemies, this.platforms);
    this.c9 = this.physics.add.collider(this.enemies, this.rocks, this.apeCollideWithRockPompeli);
    this.c10 = this.physics.add.collider(this.enemies, this.pompelis, this.apeCollideWithRockPompeli);
    this.c11 = this.physics.add.collider(this.bossFightTriggerPoint, this.platforms);


    // overlaps
    this.deathOverlaps = this.physics.add.overlap(this.player, this.deathSpots, this.playerKill);
    this.collideWithSpikes = this.physics.add.overlap(this.player, this.spikeAreas, this.hurtPlayer);
    this.lianOverlaps = this.physics.add.overlap(this.player, this.lians, this.overlapLian, null, this);
    this.collideWithGroundEnemies = this.physics.add.overlap(this.player, this.enemies, this.killEnemy);
    this.collideWithBees = this.physics.add.overlap(this.player, this.beeEnemies, this.killEnemy);
    this.collideWithGhosts = this.physics.add.overlap(this.player, this.ghostEnemies, this.killEnemy);
    this.collideWithHangingPlantEnemies = this.physics.add.overlap(this.player, this.hangingPlantEnemies, this.killEnemy);
    this.collideWithHangingSpiderEnemies = this.physics.add.overlap(this.player, this.hangingSpiderEnemies, this.killEnemy);
    this.o1 = this.physics.add.overlap(this.rocks, this.hangingSpiderEnemies, this.killEnemyByRock);
    this.o2 = this.physics.add.overlap(this.player, this.bossFightTriggerPoint, this.activateBossFightTriggerInterval);
    this.collideWithBoss = this.physics.add.overlap(this.player, this.BOSS, this.killEnemy);

  }

  update (time, delta) {

    this.controlCamera();

    this.player.control();

    if (this.getCameraLevel() === 0 || this.getCameraLevel() === 1 || this.getCameraLevel() === 3) {
      this.enemies.children.iterate((enemy) => {
        enemy.move();
      });
    }

    this.hangingPlantEnemies.children.iterate((enemy) => {
      enemy.move();
    });

    if (this.getCameraLevel() === 0 || this.getCameraLevel() === 4) {
      this.hangingSpiderEnemies.children.iterate((enemy) => {
        enemy.move();
      });
    }

    this.beeEnemies.children.iterate((enemy) => {
      enemy.move();
    });

    this.ghostEnemies.children.iterate((enemy) => {
      enemy.move();
    });

    if (this.getCameraLevel() === 5) {
      this.ceilingStones.children.iterate((stone) => {
        stone.checkFallDownTrigger(this.player);
      });
    }

    if (this.getCameraLevel() === 4) {
      this.rollingStoneBall.checkFallDownTrigger(this.player);
    }

  }

  getCameraLevel = () => {
    let newLevel = this.cameraLvl;

    if (this.player.y > this.cameraLevel0.y) {
      newLevel = 0;
    } else if (this.player.y > this.cameraLevel2.y && this.player.y < this.cameraLevel0.y) {
      newLevel = 1;
    } else if (this.player.y < this.cameraLevel2.y && this.player.y > this.cameraLevel3.y) {
      newLevel = 2;
    } else if (this.player.y < this.cameraLevel3.y && this.player.y > this.cameraLevel4.y) {
      newLevel = 3;
    } else if (this.player.y < this.cameraLevel4.y && this.player.y > this.cameraLevel5.y) {
      newLevel = 4;
    } else if (this.player.y < this.cameraLevel5.y) {
      newLevel = 5;
    }

    if (this.cameraLvl < newLevel && this.player.playerClimbing === true) {
      this.cameraLvl = newLevel;
    } else if (this.cameraLvl > newLevel) {
      this.cameraLvl = newLevel;
    }

    return this.cameraLvl;
  }

  controlCamera = () => {

    if (this.FINAL_BOSS_FIGHT === true) {
      this.tweens.add({
        targets: this.camDolly,
        y: Math.floor(this.bossFightTriggerPoint.y - 150),
        x: Math.floor(this.bossFightTriggerPoint.x - 150),
        duration: 450}
      );

      return true;
    }

    let platformLevel = this.getCameraLevel();

    if (platformLevel === 1) {
      if (this.player.y > this.cameraLevel0.y) {
        this.tweens.add({targets: this.camDolly, y: Math.floor(this.cameraOrigY), duration: 450});
      } else {
        this.tweens.add({targets: this.camDolly, y: Math.floor(this.cameraOrigY), duration: 450});
        this.camDolly.x = this.player.x;
      }
      this.fixedX = 0;
    } else if (platformLevel === 0) {
      this.tweens.add({targets: this.camDolly, y: Math.floor( Math.floor(this.cameraLevel0.y) + 200), duration: 450});
      this.camDolly.x = this.player.x;
      this.fixedX = 0;
    } else if (platformLevel === 2) {
      this.tweens.add({targets: this.camDolly, y: Math.floor(this.cameraLevel2.y - 92), duration: 450});
      if (this.fixedX === 0) {
        this.fixedX = this.player.x;
        this.camDolly.x = this.fixedX;
      }
    } else if (platformLevel === 3) {
      if (this.player.y < this.cameraLevel3.y + 150 && this.player.y > this.cameraLevel3.y - 100) {
        this.tweens.add({targets: this.camDolly, y: Math.floor(this.cameraLevel3.y), duration: 450});
        this.fixedX = this.player.x;
        this.camDolly.x = this.fixedX;
      } else {
        this.tweens.add({targets: this.camDolly, y: Math.floor(this.cameraLevel3.y - 270), duration: 450});
        this.fixedX = this.player.x;
        this.camDolly.x = this.fixedX;
      }
    } else if (platformLevel === 4) {
      this.tweens.add({targets: this.camDolly, y: Math.floor(this.cameraLevel4.y - 150), duration: 450});
      this.fixedX = this.player.x;
      this.camDolly.x = this.fixedX;
    } else if (platformLevel === 5) {
      this.tweens.add({targets: this.camDolly, y: Math.floor(this.cameraLevel5.y - 200), duration: 450});
      this.fixedX = this.player.x;
      this.camDolly.x = this.fixedX;
    }
  }

  activateBossFightTriggerInterval = (player, triggerPoint) => {
    clearInterval(this.activateBossFightInterval);
    this.activateBossFightInterval = setInterval(() => {
      this.activateBossFight(player, triggerPoint);
    }, 500);
  }

  activateBossFight = (player, triggerPoint) => {
    if (this.getCameraLevel() === 5 && this.FINAL_BOSS_FIGHT === false && (triggerPoint.x - player.body.x > 35)) {
      clearInterval(this.activateBossFightInterval);
      this.controlCamera();
      this.levelThemeAudio.stop();
      let bossAreaBlockStone = this.physics.add.sprite(this.bossFightTriggerPoint.x, this.bossFightTriggerPoint.y, 'tilesB');
      bossAreaBlockStone.setFrame(29);
      bossAreaBlockStone.setCollideWorldBounds(true);
      bossAreaBlockStone.setSize(16, 16);
      bossAreaBlockStone.body.immovable = true;
      bossAreaBlockStone.body.allowGravity = false;
      this.physics.add.collider(bossAreaBlockStone, this.platforms);
      this.physics.add.collider(this.player, bossAreaBlockStone);
      setTimeout(() => {
        this.bossBattleAudio.play({loop: true});
        this.BOSS.activate();
      }, 2000);
      this.FINAL_BOSS_FIGHT = true;
    }
  }

  healPlayer = (chest, diamond, player) => {
    if (diamond.active === true) {
      this.lives = (this.lives > 0 && this.lives < 10) ? this.lives++ : this.lives;
      diamond.collect();
      this.collectAudio.play({loop: false});
      this.player.healPlayer();
      chest.setActive(false);
      chest.destroy();
    }
  }

  hurtPlayer = (player, enemy) => {
    if (enemy.active == false) {
      return false;
    }
    if (player === null) {
      player = this.player;
    }

    let hurtWhilePogoing = false;
    if (enemy.name === 'spikes' && player.body.y  > enemy.body.y) {
      hurtWhilePogoing = true;

    }
    let stuck = false;
    if (enemy.name === 'plant') {
      stuck = true;
    }
    if (hurtWhilePogoing === true || (player.pogo() === false || (player.pogo() === true && player.body.y - player.body.halfHeight > enemy.body.y - enemy.body.halfHeight))) {
      this.collideWithBees.active = false;
      this.collideWithGroundEnemies.active = false;
      this.collideWithHangingPlantEnemies.active = false;
      this.collideWithHangingSpiderEnemies.active = false;
      this.collideWithSpikes.active = false;
      this.collideWithGhosts.active = false;
      this.player.hurt(this.resetEnemyColliders, stuck, enemy, (enemy.yIsFlipped && enemy.yIsFlipped === true ? true : false));

      if (this.FINAL_BOSS_FIGHT === true && this.player.lives === 0) {
        this.gameOverAndReset(false);
      } else if (this.player.lives === 0) {
        this.playerKill();
      }

    }
  }

  killEnemy = (player, enemy) => {
    if (enemy.active === true) {
      let hurtPlayer = false;
      if (enemy.constructor.name === 'EnemyPlant' && enemy.yIsFlipped === false) {
        hurtPlayer = true;
      }
      if (player.pogo() === true && player.body.y + player.body.halfHeight < enemy.body.y && hurtPlayer === false) {
        this.killAudio.play({loop: false});
        this.player.setVelocityY(-210);
        enemy.die();
      } else {
        this.hurtPlayer(player, enemy);
      }
    }
  }

  killEnemyByRock = (rock, enemy) => {
    if (enemy.active === true) {
      enemy.die();
    }
  }

  resetEnemyColliders = () => {
    this.collideWithBees.active = true;
    this.collideWithGroundEnemies.active = true;
    this.collideWithHangingPlantEnemies.active = true;
    this.collideWithHangingSpiderEnemies.active = true;
    this.collideWithSpikes.active = true;
    this.collideWithGhosts.active = true;
  }

  overlapLian = (player, lian) => {
    this.player.registerLian(lian);
  }

  destroyRock = (rock, walls) => {
    if (rock.moving === true) {
      rock.disable();
    }
  }

  interactWithBridge = (stone, player) => {
    if (player.pogo() === true) {
      this.pogoAudio.play({loop: false});
      player.setVelocityY(-250);
    } else if (player.body.onFloor() === false) {
      player.isStandingOnSomething(true);
    }

    let i = 0;
    if (this.bridgeIsCrumbling === false) {
      for (let stone of this.bridgeStones.children.entries){
        i++;
        stone.crumble(250*i, true);
      }

      this.bridgeIsCrumbling = true;
    }
  }

  interactWithCeiling = (stone, player) => {
    let i = 0;
    for (let stone of this.ceilingStones.children.entries){
      i++;
      if (stone.isFalling === false) {
        stone.crumble(300*i, false);
      }
    }
  }

  enableHitRock  = (player, rock) => {
    if (player.pogo() === true) {
      this.pogoAudio.play({loop: false});
      player.setVelocityY(-250);
    } else if (player.body.onFloor() === false) {
      player.isStandingOnSomething(true);
    } else {
      this.hitObject = rock;
      this.player.registerHitCallback(this.hitRock, this.hitObject);
    }
  }

  hitRock = () => {
    if (this.hitObject != null) {
      this.hitObject.moveTo(this.player.playerDirection);
    }
  }

  enableHitTreasure  = (player, treasure) => {
    if (player.pogo() === true) {
      this.pogoAudio.play({loop: false});
      player.setVelocityY(-250);
      if (typeof treasure.pogoHitCount === 'undefined' || (treasure.pogoHitCount && treasure.pogoHitCount > 0)) {
        treasure.explode();
      }

      if (typeof treasure.pogoHitCount !== 'undefined' && treasure.pogoHitCount >= 0) {
        treasure.pogoHitCount++;
      }
    } else if (player.body.onFloor() === false) {
      if (player.isStandingOnSomething() === false) {
        treasure.pogoHitCount = 0;
      }
      player.isStandingOnSomething(true);
    } else {
      this.hitObject = treasure;
      player.registerHitCallback(this.hitTreasure, this.hitObject);
    }
  }

  hitTreasure = () => {
    if (this.hitObject != null) {
      this.hitObject.explode();
    }
  }

  enableHitPompeli  = (player, pompeli) => {
    if (player.pogo() === true) {
      this.pogoAudio.play({loop: false});
      player.setVelocityY(-250);
    } else if (player.body.onFloor() === false) {
      player.isStandingOnSomething(true);
    } else {
      this.hitObject = pompeli;
      player.registerHitCallback(this.hitPompeli, this.hitObject);
    }
  }

  hitPompeli = () => {
    if (this.hitObject != null) {
      if (this.getCameraLevel() === 4) {
        if (this.player.playerDirection === 'right') {
          this.hitObject.moveTo('right');
        }
      } else {
        this.hitObject.moveTo(this.player.playerDirection);
      }
    }
  }

  apeCollideWithRockPompeli = (ape, obj) => {
    if (ape && ape.isStandingOnSomething) {
      ape.isStandingOnSomething(true);
    }
  }

  playerKill = () => {
    this.levelThemeAudio.stop();
    this.gameOverAudio.play({loop: false});
    this.scene.pause();
    setTimeout(() => {
      this.resetGame();
    }, 3000);
  }

  resetGame = () => {
    let resetPlaceWithNoTimeout = function(toReset) {
      let o = toReset.children.iterate(function(o) {
        o.setX(0); o.setY(0); o.setActive(false); o.setVisible(false);
      });
      return o;
    };
    let temp = null;

    this.bridgeStones.children.iterate(function(o) {
      o.clearTimeouts();
    });
    this.ceilingStones.children.iterate(function(o) {
      o.clearTimeouts();
    });
    this.ghostEnemies.children.iterate(function(o) {
      o.clearTimeouts();
    });
    this.enemies.children.iterate(function(o) {
      if (o.clearTimeouts) {
        o.clearTimeouts();
      }
    });

    this.BOSS.clearTimeouts();
    this.BOSS.destroy();
    this.player.destroy();

    temp = resetPlaceWithNoTimeout(this.enemies);
    temp = resetPlaceWithNoTimeout(this.hangingPlantEnemies);
    temp = resetPlaceWithNoTimeout(this.hangingSpiderEnemies);
    temp = resetPlaceWithNoTimeout(this.beeEnemies);
    temp = resetPlaceWithNoTimeout(this.ghostEnemies);

    this.sound.removeByKey('amazonTheme');
    this.sound.removeByKey('gameOverSound');
    this.sound.removeByKey('stageComplete');
    this.sound.removeByKey('bossBattle');
    this.sound.removeByKey('pogo');
    this.sound.removeByKey('hitFail');
    this.sound.removeByKey('killEnemy');
    this.sound.removeByKey('touchDown');
    this.sound.removeByKey('hitOk');
    this.sound.removeByKey('climb');
    this.sound.removeByKey('collect');

    this.registry.destroy();
    this.events.off();

    if(this.restartInit === false){
      this.restartInit = true;
      this.scene.start('RestartAmazon');
    }
  }

  gameOverAndReset = (win = false) => {
    if (win == true) {
      this.levelThemeAudio.stop();
      this.bossBattleAudio.stop();
      this.gameWinAudio.play({loop: false});
      let camView = this.cam.worldView;
      this.successTxt = this.add.text(camView.centerX, camView.centerY, 'SUCCESS!', { font: 'bold Arial', fontSize: '32px', fill: '#FFF' });
      this.successTxt.setOrigin(0.5);
      this.scene.pause();
      setTimeout(() => {
        this.scene.start('TitleScene');
      }, 8000);
    } else {
      this.levelThemeAudio.stop();
      this.bossBattleAudio.stop();
      this.gameOverAudio.play({loop: false});
      let camView = this.cam.worldView;
      this.failTxt = this.add.text(camView.centerX, camView.centerY, 'GAME OVER', { font: 'bold Arial', fontSize: '32px', fill: '#FFF' });
      this.failTxt.setOrigin(0.5);
      this.scene.pause();
      setTimeout(() => {
        this.scene.start('TitleScene');
      }, 5000);
    }
    this.HealthBarScene.scene.setVisible(false);
  }

  setHitObject = (o) => {
    this.hitObject = o;
  }

  getHitObject = () => {
    return this.hitObject;
  }

  getScenePlatforms = () => {
    return this.platforms;
  }

  getCam = () => {
    return this.cam;
  }

  getPlayer = () => {
    return this.player;
  }

}
