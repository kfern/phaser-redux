const { createSlice } = require('redux-starter-kit');

const initialState = {
  config: {
    velocity: 160
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

const gameSlice = createSlice({
  slice: 'gameSlice',
  initialState: initialState,
  reducers: {
    setGameOver: (state, action) => {
      state.gameOver = action.payload && state.inmunity < 1;
    },
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
  initialState,
  gameSlice
};
