const { createSlice } = require('redux-starter-kit');

const gameSlice = createSlice({
  slice: 'gameSlice',
  initialState: {
    config: {
      velocity: 160
    },
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
  },
  reducers: {
    setGameOver: (state, action) => {
      state.gameOver = action.payload;
    },

    moveTo: (state, action) => {
      // mutate the state all you want with immer            
      state.moveTo = action.payload;

      let animation = 'turn';
      if (state.moveTo.left) {
        animation = 'left';
      } else if (state.moveTo.right) {
        animation = 'right';
      }
      state.velocity = {
        x: state.config.velocity * ((state.moveTo.left * -1) + (state.moveTo.right * 1)),
        y: state.config.velocity * state.moveTo.up * -2,
        animation
      };
    },

    incrementScore: (state, action) => {
      const scoreData = {
        star: 10
      };
      state.score = state.score + scoreData[action.payload]; // mutate the state all you want with immer
    },

    setInfo: (state, action) => {
      state.info = action.payload; // mutate the state all you want with immer
    }
  }
});

module.exports = {
  gameSlice
};
