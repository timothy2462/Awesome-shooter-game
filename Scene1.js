class Scene1 extends Phaser.Scene {
  constructor() {
    super('bootGame');
  }

  preload() {
    this.load.image('bg', 'assets/background.png');
    this.load.spritesheet('ship', 'sprites/ship.png', {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet('ship2', 'sprites/ship2.png', {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet('ship3', 'sprites/ship3.png', {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet('explosion', 'sprites/explosion.png', {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet('power-up', 'sprites/power-up.png', {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet('player', 'sprites/player.png', {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet('beam', 'sprites/beam.png', {
      frameWidth: 16,
      frameHeight: 16,
    });

    // 1.1 load sounds in both formats mp3 and ogg
    this.load.audio('audio_beam', ['sounds/beam.ogg', 'sounds/beam.mp3']);
    this.load.audio('audio_explosion', [
      'sounds/explosion.ogg',
      'sounds/explosion.mp3',
    ]);
    this.load.audio('audio_pickup', ['sounds/pickup.ogg', 'sounds/pickup.mp3']);
    this.load.audio('music', [
      'sounds/sci-fi_platformer12.ogg',
      'sounds/sci-fi_platformer12.mp3',
    ]);
  }
  create() {
    this.add.text(config.width / 2, config.height / 2, 'loading...');
    // return;
    setTimeout(() => this.scene.start('playGame'), 500);
  }
}
