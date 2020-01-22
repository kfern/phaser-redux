const initialState = {
  config: {
    velocity: 160,
    score: {
      star: 10
    }
  },
  inmunity: 15,
  gameOver: false,
  score: 0,
  velocity: {
    x: 0,
    y: 0,
    animation: 'turn'
  },
  moveTo: {
    left: false,
    right: false,
    up: false
  },
  info: {
    player: {
      x: 0,
      y: 0
    }
  }
};

module.exports = {
  initialState
};
