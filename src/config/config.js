import 'phaser';

const gameConfig = {
  width: 800,
  height: 600
};

export default {
  type: Phaser.AUTO,
  scale: {
    parent: 'phaser-example',
    width: gameConfig.width,
    height: gameConfig.height,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  render: {
    pixelArt: true
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  }

};
