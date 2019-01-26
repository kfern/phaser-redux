import 'phaser';

const gameConfig = {
  width: window.innerWidth * window.devicePixelRatio > 800 ? 800 : window.innerWidth * window.devicePixelRatio,
  height: window.innerHeight * window.devicePixelRatio > 600 ? 600 : window.innerHeight * window.devicePixelRatio
};

export default {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: gameConfig.width,
  height: gameConfig.height,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  }

};
