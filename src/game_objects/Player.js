import GameSprite from './GameSprite.js';

export default class Player extends GameSprite {

  constructor (scene, x, y, spriteKey, audio) {
    super(scene, x, y, spriteKey);

    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.oldX = -1;
    this.gravityY = 50;
    this.lives = 3;
    this.jumpState = false;
    this.pogoState = false;
    this.hitState = false;
    this.playHit = false;
    this.playHitFail = false;
    this.hitCallback = () => {};
    this.getHitObject = () => { return null; };
    this.hitObjectClassNamePrevious = '';
    this.playerDirection = 'right'; //  left, right
    this.overlappingLian = [];
    this.playerClimbing = false;
    this.cancelClimb = false;
    this.standingOnSomething = false;
    this.hurtState = false;
    this.stuck = false;
    this.stuckTimeout = null;
    this.hurtResetCallback = function() {};

    this.pogoAudio = audio.pogoAudio;
    this.touchDownAudio = audio.touchDownAudio;
    this.hitOkAudio = audio.hitOkAudio;
    this.hitFailAudio = audio.hitFailAudio;
    this.climbAudio = audio.climbAudio;
    this.playHitFailTimeout = null;
    this.playTouchDownSoundOnce = false;

    this.jumpKeyDownAndUp = false;

    this.initPlayer();
  }

  initPlayer() {
    this.setSize(24, 25);
    this.setOffset(1, 7);
    this.setBounce(0);
    this.setCollideWorldBounds(true);
    //this.body.immovable = true;
    this.body.setMaxSpeed(250); // needed for physics engine to prevent falling through the tiles
    this.body.setMaxVelocity(250);

    this.scene.anims.create({
      key: 'left',
      frames: this.scene.anims.generateFrameNumbers('scrooge', {start: 5, end: 2}),
      frameRate: 6,
      repeat: -1
    });

    this.scene.anims.create({
      key: 'right',
      frames: this.scene.anims.generateFrameNumbers('scrooge', {start: 6, end: 9}),
      frameRate: 6,
      repeat: -1
    });

    this.scene.anims.create({
      key: 'turnLeft',
      frames: [{key: 'scrooge', frame: 0}],
      frameRate: 1
    });

    this.scene.anims.create({
      key: 'turnRight',
      frames: [{key: 'scrooge', frame: 1}],
      frameRate: 1
    });

    this.scene.anims.create({
      key: 'duckLeft',
      frames: this.scene.anims.generateFrameNumbers('scrooge', {start: 17, end: 16}),
      frameRate: 2,
      repeat: 0
    });

    this.scene.anims.create({
      key: 'duckRight',
      frames: this.scene.anims.generateFrameNumbers('scrooge', {start: 19, end: 18}),
      frameRate: 2,
      repeat: 0
    });

    this.scene.anims.create({
      key: 'jumpLeft',
      frames: [{key: 'scrooge', frame: 10}],
      frameRate: 10
    });

    this.scene.anims.create({
      key: 'jumpRight',
      frames: [{key: 'scrooge', frame: 11}],
      frameRate: 10
    });

    this.scene.anims.create({
      key: 'pogoLeft_1',
      frames: [{key: 'scrooge', frame: 13}, {key: 'scrooge', frame: 13}],
      frameRate: 1
    });

    this.scene.anims.create({
      key: 'pogoLeft_2',
      frames: [{key: 'scrooge', frame: 12}],
      frameRate: 1
    });

    this.scene.anims.create({
      key: 'pogoRight_1',
      frames: [{key: 'scrooge', frame: 15}, {key: 'scrooge', frame: 15}],
      frameRate: 1
    });

    this.scene.anims.create({
      key: 'pogoRight_2',
      frames: [{key: 'scrooge', frame: 14}],
      frameRate: 1
    });

    this.scene.anims.create({
      key: 'hitLeft1',
      frames: [{key: 'scrooge', frame: 24}],
      frameRate: 1
    });

    this.scene.anims.create({
      key: 'hitLeftFull',
      frames: this.scene.anims.generateFrameNumbers('scrooge', {start: 24, end: 26}),
      frameRate: 3,
      repeat: 0
    });

    this.scene.anims.create({
      key: 'hitRight1',
      frames: [{key: 'scrooge', frame: 29}],
      frameRate: 1
    });

    this.scene.anims.create({
      key: 'hitRightFull',
      frames: this.scene.anims.generateFrameNumbers('scrooge', {start: 29, end: 27}),
      frameRate: 3,
      repeat: 0
    });

    this.scene.anims.create({
      key: 'shakeLeft',
      frames: this.scene.anims.generateFrameNumbers('scrooge', {start: 32, end: 33}),
      frameRate: 10,
      repeat: -1
    });

    this.scene.anims.create({
      key: 'shakeRight',
      frames: this.scene.anims.generateFrameNumbers('scrooge', {start: 35, end: 34}),
      frameRate: 10,
      duration: 10000,
      repeat: -1
    });

    this.scene.anims.create({
      key: 'leftClimb',
      frames: this.scene.anims.generateFrameNumbers('scrooge', {start: 20, end: 21}),
      frameRate: 6,
      repeat: -1
    });

    this.scene.anims.create({
      key: 'rightClimb',
      frames: this.scene.anims.generateFrameNumbers('scrooge', {start: 23, end: 22}),
      frameRate: 6,
      repeat: -1
    });

    this.scene.anims.create({
      key: 'hurtRight',
      frames: [{key: 'scrooge_hurt', frame: 1}],
      frameRate: 1
    });

    this.scene.anims.create({
      key: 'hurtLeft',
      frames: [{key: 'scrooge_hurt', frame: 0}],
      frameRate: 1
    });

    this.scene.anims.create({
      key: 'hurtRightHalf',
      frames: [{key: 'scrooge_hurt', frame: 3}],
      frameRate: 1
    });

    this.scene.anims.create({
      key: 'hurtLeftHalf',
      frames: [{key: 'scrooge_hurt', frame: 2}],
      frameRate: 1
    });

    this.playAnim((this.playerDirection === 'right' ? 'turnRight' : 'turnLeft'));

    this.scene.input.keyboard.on('keydown_SPACE', (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (this.hit() === false) {
        this.pogo(true);
      } else {
        this.playHit = true;
      }
    });

    this.scene.input.keyboard.on('keyup_SPACE', (event) => {
      event.preventDefault();
      event.stopPropagation();
      this.pogo(false);
      this.setVelocityY(0); // must be here to kill the upward motion after releasing the space-key in-air
    });

  }

  control = () => {
    if ((this.playerClimbing === false || this.cancelClimb === true || this.pogo() === true) && this.stuck === false) {

      this.body.gravity.y = this.gravityY; // reset gravity
      this.body.allowGravity = true; // reset gravity

      if (this.cursors.left.isDown) {
        if (this.playerDirection === 'left' && (Math.floor(this.body.x) === this.oldX || this.body.onWall()) && this.jump() === false && this.pogo() === false) {

          if (this.hit() === false && this.playHit === false && this.playHitFail === false) {  // HIT PHASE 0
            this.hit(true);
          } else if (this.hit() === true && this.playHit === false) { // HIT PHASE 2
            this.playAnim('hitLeft1');
          } else if (this.playHit === true) {   // HIT PHASE 2
            this.playAnim('hitLeftFull', true);
            this.once('animationcomplete', () => {
              this.hitCallback();
              this.playHit = false;
              this.hit(false);
              let hitObjectClassName = this.getHitObject();
              this.playHitFail = true;
              if (hitObjectClassName === 'Pompeli' || hitObjectClassName === 'RoundRock' || hitObjectClassName === 'TreasureChest') {
                this.playHitFail = false;
                if(hitObjectClassName === 'RoundRock') {
                  this.hitObjectClassNamePrevious = 'RoundRock'; // needed for not giving a hit fail animation after the rock has vanished and the re-hit hits the air
                }
              } else {
                if (this.hitOkAudio.isPlaying === false) {
                  this.hitOkAudio.play({loop: false});
                }
              }
            });
          } else if (this.playHitFail === true) { // HIT PHASE 3 (hit fail)
            this.playAnim('shakeLeft', true);
            if (this.hitFailAudio.isPlaying === false) {
              this.hitFailAudio.play({loop: false});
            } else {
              this.playHitFailTimeout = setTimeout(() => {
                this.playHitFail = false;
                clearTimeout(this.hitFailAudio);
              }, 1000);
            }
          }

        } else {
          this.playAnim('left', true);
          this.playerDirection = 'left';
          this.setVelocityX(-80);
          this.playHitFail = false;
          this.hit(false);
          this.oldX = Math.floor(this.body.x);
          this.hitObjectClassNamePrevious = '';
        }

        this.setSize(24, 25);
        this.setOffset(1, 7);
      } else if (this.cursors.right.isDown) {
        if (this.playerDirection === 'right' && (Math.floor(this.body.x) === this.oldX || this.body.onWall()) && this.jump() === false && this.pogo() === false) {

          if (this.hit() === false && this.playHit === false && this.playHitFail === false) {  // HIT PHASE 0
            this.hit(true);
          } else if (this.hit() === true && this.playHit === false) { // HIT PHASE 1
            this.playAnim('hitRight1');
          } else if (this.playHit === true) {   // HIT PHASE 2
            this.playAnim('hitRightFull', true);
            this.once('animationcomplete', () => {
              this.hitCallback();
              this.playHit = false;
              this.hit(false);
              let hitObjectClassName = this.getHitObject();
              this.playHitFail = true;
              if (hitObjectClassName === 'Pompeli' || hitObjectClassName === 'RoundRock' || hitObjectClassName === 'TreasureChest') {
                this.playHitFail = false;
                if(hitObjectClassName === 'RoundRock') {
                  this.hitObjectClassNamePrevious = 'RoundRock';
                }
              } else {
                if (this.hitOkAudio.isPlaying === false) {
                  this.hitOkAudio.play({loop: false});
                }
              }
            });
          } else if (this.playHitFail === true) { // HIT PHASE 3 (hit fail)
            this.playAnim('shakeRight', true);
            if (this.hitFailAudio.isPlaying === false) {
              this.hitFailAudio.play({loop: false});
            } else {
              this.playHitFailTimeout = setTimeout(() => {
                this.playHitFail = false;
                clearTimeout(this.hitFailAudio);
              }, 1000);
            }
          }
        } else  {
          this.playAnim('right', true);
          this.playerDirection = 'right';
          this.setVelocityX(80);
          this.hit(false);
          this.playHitFail = false;
          this.oldX = Math.floor(this.body.x);
          this.hitObjectClassNamePrevious = '';
        }

        this.setSize(24, 25);
        this.setOffset(1, 7);
      } else if (this.cursors.down.isDown) {
        this.setVelocityX(0);
        this.playAnim((this.playerDirection === 'right' ? 'duckRight' : 'duckLeft'), false);
        this.setSize(24, 16);
        this.setOffset(0, 16);
      } else {
        this.setVelocityX(0);
        this.playAnim((this.playerDirection === 'right' ? 'turnRight' : 'turnLeft'));
        this.hit(false);
        this.oldX = -1;
        this.setSize(24, 25);
        this.setOffset(1, 7);
      }

      this.controlJump();

    } else if (this.stuck === true) {
      if (this.cursors.left.isDown) {
        this.playerDirection = 'left';
      } else if (this.cursors.right.isDown) {
        this.playerDirection = 'right';
      }
      this.playAnim((this.playerDirection === 'right' ? 'hurtRightHalf' : 'hurtLeftHalf'), true);
      this.controlJump();
    } else { // if climbing
      this.playAnim((this.playerDirection === 'right' ? 'rightClimb' : 'leftClimb'), true);

      if (this.playerClimbing === true && this.jumpKeyDownAndUp === true && (this.cursors.left.isDown || this.cursors.right.isDown) && this.cursors.up.isDown) {
        this.climb(false);
        this.setVelocityY(-180);
        this.jump(true);
      } else {
        this.controlClimb();
      }
    }

    if (this.hit() === false) {
      this.registerHitCallback(() => {}, () => { return null; });
    }
  }

  controlClimb = () => {
    if (this.cursors.up.isDown) {
      this.body.velocity.y = -90;
      if (this.climbAudio.seek > 0.15 || this.climbAudio.seek === 0) {
        this.climbAudio.play({loop: false});
      }
    } else {
      this.jumpKeyDownAndUp = true;
    }

    if (this.cursors.down.isDown) {
      this.body.velocity.y = 90;
      if (this.climbAudio.seek > 0.15 || this.climbAudio.seek === 0) {
        this.climbAudio.play({loop: false});
      }
    }

    if (this.cursors.left.isDown) {
      this.playerDirection = 'left';
    }

    if (this.cursors.right.isDown) {
      this.playerDirection = 'right';
    }

    if (!this.cursors.up.isDown && !this.cursors.down.isDown) {
      this.body.velocity.y = 0;
      this.stopAnim();
    }

    // This is for stopping the climb after reaching the bottom end of the lian
    if (this.playerClimbing === true && this.scene.physics.overlap(this, this.overlappingLian[0]) === false) {
      this.climb(false);
    }
  }

  controlJump = () => {

    /* If player gets hurt, it will cancel jump */
    if (this.hurtState === true) {
      if (this.stuck === true) {
        this.playAnim((this.playerDirection === 'right' ? 'hurtRightHalf' : 'hurtLeftHalf'), true);
      } else {
        this.playAnim((this.playerDirection === 'right' ? 'hurtRight' : 'hurtLeft'), true);
      }
      setTimeout(() => {
        if (this.body.onFloor() === true || this.isStandingOnSomething() === true) {
          this.cancelClimb = false;
          this.hurtState = false;
          this.hurtResetCallback();
        }
      }, 200);
      return true;
    }

    // BASIC JUMP -->
    if (this.cursors.up.isDown) {
      if (this.jump() === false && this.body.onFloor()) {
        this.jump(true);
        this.setVelocityY(-180);
        this.jumpKeyDownAndUp = false;
        this.playTouchDownSoundOnce = true;
      } else if (this.isStandingOnSomething() === true) {
        this.jump(true);
        this.setVelocityY(-180);
        this.isStandingOnSomething(false);
        this.jumpKeyDownAndUp = false;
        this.playTouchDownSoundOnce = true;
      }
    }
    // BASIC JUMP <--

    // If player jumps to a lian, activate climbing mode
    if (this.jump() === true && this.scene.physics.overlap(this, this.overlappingLian[0]) && this.cancelClimb === false) {
      this.climb(true);
    }

    if (this.pogo() === true) { // Pogo situations
      this.playTouchDownSoundOnce = true;
      if (this.body.onFloor()) {
        this.pogoAudio.play({loop: false});
        this.setVelocityY(-250);
        this.playAnim((this.playerDirection === 'right' ? 'pogoRight_1' : 'pogoLeft_1'));
      } else {
        this.climb(false);
        this.playAnim((this.playerDirection === 'right' ? 'pogoRight_2' : 'pogoLeft_2'));
      }
      this.setSize(4, 25);
      this.setOffset(10, 7);
    } else { // Normal jumping and freefall situations
      if (this.jump() === true) {
        if (this.body.onFloor()) {
          this.cancelClimb = false;
          if (this.cursors.up.isUp) { // prevent continuous jumping
            this.jump(false);
          }

          // If the up key is pressed and player is falling down and hits the floor
          if (this.body.velocity.y > 0 && this.body.onFloor() && this.playTouchDownSoundOnce === true) {
            this.touchDownAudio.play({loop: false});
            this.playTouchDownSoundOnce = false;
          }
        } else if (this.playerClimbing === true) {
          this.setVelocityX(0);
          this.jump(false);
        } else {
          if (this.scene.physics.overlap(this, this.overlappingLian[0]) === false) {
             this.cancelClimb = false;
          }
          this.playAnim((this.playerDirection === 'right' ? 'jumpRight' : 'jumpLeft'));
        }

        if (!this.body.onFloor() && this.isStandingOnSomething() === true) { // if standing on an object
          this.jump(false);
        }

      } else if (!this.body.onFloor()) { // freefall
        if (this.scene.physics.overlap(this, this.overlappingLian[0]) && this.cancelClimb === false) {
          this.climb(true);
        } else if (this.isStandingOnSomething() === true) { // if standing on an object
          this.jump(false);
        } else {
          this.cancelClimb = false;
          this.playAnim((this.playerDirection === 'right' ? 'jumpRight' : 'jumpLeft'));
        }
      } else if (this.playerClimbing === false) {
        if (this.playTouchDownSoundOnce  === true) {
          this.touchDownAudio.play({loop: false});
          this.playTouchDownSoundOnce = false;
        }
        this.setVelocityY(0);
      }

    } // else ends

  }

  jump = (state = null) => {
    if (state === null) {
      return this.jumpState;
    } else {
      if (state === true) {
        this.isStandingOnSomething(false);
      }
      this.jumpState = state;
    }
  }

  pogo = (state = null) => {
    if (this.hit() === true) {
      this.pogoState = false;
      return false;
    }
    if (state === null) {
      return this.pogoState;
    } else {
      if (state === true) {
        this.isStandingOnSomething(false);
      }
      this.pogoState = state;
    }
  }

  climb = (state = false) => {
    this.playerClimbing = state;
    if (state === true) {
      this.body.gravity.y = 0;
      this.body.allowGravity = false;
      this.body.velocity.x = 0;
      this.pogo(false);
      this.jump(false);
      this.cancelClimb = false;
      if (this.x != this.overlappingLian[0].x) {
        this.scene.tweens.add({targets: this, x: this.overlappingLian[0].x, duration: 40});
      }
    } else {
      this.cancelClimb = true;
      this.body.gravity.y = this.gravityY; // reset gravity
      this.body.allowGravity = true; // reset gravity
      this.overlappingLian = [];
    }
  }

  hit = (state = null) => {
    if (state === null) {
      return this.hitState;
    } else {
      this.hitState = state;
    }
  }

  hurt = (resetEnemyColliders, stuck = false, enemy = null, enemyYisFlipped, bounceWhenHurt = true) => {
    if (this.hurtState === false) {
      this.stuck = stuck;
      this.hurtState = true;
      this.setVelocityY(0);
      this.pogo(false);
      this.jump(false);
      this.climb(false);

      if (this.stuck === true) {
        this.body.gravity.y = 0;
        this.body.allowGravity = false;
        this.setVelocityX(0);
        this.setVelocityY(0);
        if (enemyYisFlipped === true) {
          this.flipY = true;
          this.setX(enemy.body.x + enemy.body.halfWidth);
          this.setY(enemy.body.y + enemy.body.height);
        } else {
          this.setX(enemy.x);
          this.setY(enemy.y - this.body.height - 20);
        }

        if (this.stuckTimeout === null) {
          this.stuckTimeout = setTimeout(() => {
            this.stuck = false;
            this.flipY = false;
            this.setVelocityY(-180*(enemyYisFlipped === true ? -1 : 1));
            this.setVelocityX(this.playerDirection === 'right' ? -150 : 150);
            this.stuckTimeout = null;
          }, 2000);
        }

      } else {
        this.body.gravity.y = this.gravityY; // reset gravity
        this.body.allowGravity = true; // reset gravity
        if (bounceWhenHurt === true) {
          this.setVelocityY(-180);
        }
        this.setVelocityX(this.playerDirection === 'right' ? -50 : 50);
      }
      this.hurtResetCallback = resetEnemyColliders;
      this.lives = (this.lives > 0) ? this.lives-1 : this.lives;
      this.scene.events.emit('decreaseLives', this.lives);
    }
  }

  healPlayer = () => {
    this.lives = (this.lives < 6) ? this.lives+1 : this.lives;
    this.scene.events.emit('increaseLives', this.lives);
  }

  isStandingOnSomething = (is = -1) => {
    if (is === -1) {
      return  this.standingOnSomething;
    } else {
      this.standingOnSomething = is;
    }
  }

  registerLian = (overlapLian) => {
    this.overlappingLian[0] = overlapLian;
  }

  registerHitCallback = (cb, getHitObject) => {
    this.hitCallback = cb;
    this.getHitObject = () => {
      let o = getHitObject();
      let hitObjectClassName = (o !== null ? o.gameObjectName : (this.hitObjectClassNamePrevious === 'RoundRock' ? this.hitObjectClassNamePrevious : ''));

      return hitObjectClassName;
    }
  }

}
