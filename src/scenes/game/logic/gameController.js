const { createSlice } = require('redux-starter-kit');
const { initialState } = require('./initialState');

const gameController = createSlice({
  slice: 'gameController',
  initialState,
  reducers: {
    setInmunity: (state, action) => {
      state.inmunity = action.payload;
    },

    moveTo: (state, action) => {
      // mutate the state all you want with immer            
      state.moveTo = action.payload;

      // animation
      let animation = 'turn';
      if (state.moveTo.left) {
        animation = 'left';
      } else if (state.moveTo.right) {
        animation = 'right';
      }

      // velocity
      state.velocity = {
        x: state.config.velocity * ((state.moveTo.left * -1) + (state.moveTo.right * 1)),
        y: state.config.velocity * state.moveTo.up * -2,
        animation
      };

      // Reduce Inmunity
      state.inmunity--;
    },

    collision: (state, action) => {
      if (action.payload === 'bomb') {
        // Game Over
        state.gameOver = state.inmunity < 1;
      } else {
        // Change score
        state.score = state.score + state.config.score[action.payload]; // mutate the state all you want with immer
      }
    },

    setInfo: (state, action) => {
      state.info = action.payload; // mutate the state all you want with immer
    }
  }
});

module.exports = {
  gameController
};
