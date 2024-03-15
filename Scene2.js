class Scene2 extends Phaser.Scene {
  constructor() {
    super('playGame');
    this.score = 0;
  }

  create() {
    // console.log(config);
    console.log(this);
    this.background = this.add
      .tileSprite(0, 0, config.width, config.height, 'bg')
      .setOrigin(0, 0)
      .setScale(2);

    this.ship1 = this.add.sprite(
      config.width / 2 - 50,
      config.height / 2,
      'ship'
    );
    this.ship2 = this.add.sprite(config.width / 2, config.height / 2, 'ship2');
    this.ship3 = this.add.sprite(
      config.width / 2 + 50,
      config.height / 2,
      'ship3'
    );
    this.player = this.physics.add.sprite(
      config.width / 2 + 50,
      config.height - 64,
      'player'
    );

    this.anims.create({
      key: 'ship1_anim',
      frames: this.anims.generateFrameNumbers('ship'),
      frameRate: 20,
      repeat: -1,
    });
    this.anims.create({
      key: 'ship2_anim',
      frames: this.anims.generateFrameNumbers('ship2'),
      frameRate: 20,
      repeat: -1,
    });
    this.anims.create({
      key: 'ship3_anim',
      frames: this.anims.generateFrameNumbers('ship3'),
      frameRate: 20,
      repeat: -1,
    });

    this.anims.create({
      key: 'explode_anim',
      frames: this.anims.generateFrameNumbers('explosion'),
      frameRate: 20,
      repeat: 0,
      hideOnComplete: true,
    });

    this.anims.create({
      key: 'red',
      frames: this.anims.generateFrameNumbers('power-up', {
        start: 0,
        end: 1,
      }),
      frameRate: 20,
      repeat: -1,
    });
    this.anims.create({
      key: 'gray',
      frames: this.anims.generateFrameNumbers('power-up', {
        start: 2,
        end: 3,
      }),
      frameRate: 20,
      repeat: -1,
    });
    this.anims.create({
      key: 'thrust',
      frames: this.anims.generateFrameNumbers('player'),
      frameRate: 20,
      repeat: -1,
    });
    this.anims.create({
      key: 'beam_anim',
      frames: this.anims.generateFrameNumbers('beam'),
      frameRate: 20,
      repeat: -1,
    });

    this.powerUps = this.physics.add.group();
    this.projectiles = this.physics.add.group();

    var maxObjects = 4;
    for (var i = 0; i <= maxObjects; i++) {
      var powerUp = this.physics.add.sprite(16, 16, 'power-up');
      this.powerUps.add(powerUp);
      powerUp.setRandomPosition(0, 0, game.config.width, game.config.height);

      if (Math.random() > 0.5) {
        powerUp.play('red');
      } else {
        powerUp.play('gray');
      }

      powerUp.setVelocity(100, 100);
      powerUp.setCollideWorldBounds(true);
      powerUp.setBounce(1);
    }

    this.ship1.play('ship1_anim');
    this.ship2.play('ship2_anim');
    this.ship3.play('ship3_anim');
    this.player.play('thrust');
    this.cursor = this.input.keyboard.createCursorKeys();
    this.spacebar = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    this.ship1.setInteractive();
    this.ship2.setInteractive();
    this.ship3.setInteractive();

    this.player.setCollideWorldBounds(true);
    this.input.on('gameobjectdown', this.destroyShip, this);

    this.physics.add.collider(
      this.projectiles,
      this.powerUps,
      (projectile, powerUp) => {
        projectile.destroy();
      }
    );

    this.physics.add.overlap(
      this.player,
      this.powerUps,
      this.pickPowerUp,
      null,
      this
    );

    this.enemies = this.physics.add.group();
    this.enemies.add(this.ship1);
    this.enemies.add(this.ship2);
    this.enemies.add(this.ship3);

    this.physics.add.overlap(
      this.player,
      this.enemies,
      this.hurtPlayer,
      null,
      this
    );

    this.physics.add.overlap(
      this.projectiles,
      this.enemies,
      this.hitEnemy,
      null,
      this
    );

    this.scoreLabel = this.add.text(20, 20, 'SCORE', {
      fill: 'yellow',
    });

    this.beamSound = this.sound.add('audio_beam');
    this.explosionSound = this.sound.add('audio_explosion');
    this.pickupSound = this.sound.add('audio_pickup');

    this.music = this.sound.add('music');

    var musicConfig = {
      mute: false,
      volume: 1,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: false,
      delay: 0,
    };

    this.music.play(musicConfig);
  }

  hitEnemy(projectile, enemy) {
    const explosion = new Explosion(this, enemy.x, enemy.y);
    this.score += 10;
    this.scoreLabel.setText(`SCORE : ${this.score}`);
    projectile.destroy();
    this.resetShipPos(enemy);
    this.explosionSound.play();
  }

  pickPowerUp(player, powerUp) {
    console.log({ player, powerUp });
    powerUp.disableBody(true, true);
    this.score += 50;
    this.scoreLabel.setText(`SCORE : ${this.score}`);
    this.pickupSound.play();
  }

  hurtPlayer(player, enemy) {
    this.resetShipPos(enemy);
    if (this.player.alpha < 1) {
      return;
    }
    const explosion = new Explosion(this, player.x, player.y);
    player.disableBody(true, true);
    this.time.addEvent({
      delay: 1000,
      callback: this.resetPlayer(player),
      callbackScope: this,
      loop: false,
    });
  }

  resetPlayer(player) {
    player.x = config.width / 2 - 8;
    player.y = config.height + 64;
    player.enableBody(true, player.x, player.y, true, true);

    player.alpha = 0.5;

    var tween = this.tweens.add({
      targets: player,
      y: config.height - 64,
      duration: 1500,
      repeat: 0,
      onComplete: () => {
        player.alpha = 1;
      },
      callbackScope: this,
    });
  }
  update() {
    this.moveShip(this.ship1, 2);
    this.moveShip(this.ship2, 4);
    this.moveShip(this.ship3, 6);
    this.background.tilePositionY -= 0.5;
    this.movePlayer();

    if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
      if (this.player.active) {
        this.shoot();
      }
    }

    for (var x = 0; x < this.projectiles.getChildren().length; x++) {
      var beam = this.projectiles.getChildren()[x];
      beam.update();
    }
  }

  shoot() {
    var beam = new Beam(this);
    this.beamSound.play();
  }

  moveShip(ship, speed) {
    ship.y += speed;

    if (ship.y > config.height) {
      this.resetShipPos(ship);
    }
  }

  resetShipPos(ship) {
    ship.y = 0;
    ship.x = Phaser.Math.Between(0, config.width);
  }

  destroyShip(pointer, object) {
    object.setTexture('explosion');
    object.play('explode_anim');
  }

  movePlayer() {
    if (this.cursor.left.isDown) {
      this.player.setVelocityX(-200);
    } else if (this.cursor.right.isDown) {
      this.player.setVelocityX(200);
    } else if (this.cursor.up.isDown) {
      this.player.setVelocityY(-200);
    } else if (this.cursor.down.isDown) {
      this.player.setVelocityY(200);
    } else {
      this.player.setVelocity(0);
      this.player.setVelocityY(0);
    }
  }
}
