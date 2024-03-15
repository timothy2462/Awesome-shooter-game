const config = {
  type: Phaser.AUTO,
  width: 456,
  height: 472,
  scene: [Scene1, Scene2],
  parent: 'bad',
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
    },
  },
};

const game = new Phaser.Game(config);
