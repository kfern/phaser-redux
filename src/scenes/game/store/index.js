const { combineReducers } = require('redux');
const { configureStore } = require('redux-starter-kit');

const { gameSlice } = require('./slices');

const gameLogic = combineReducers({
  gameSlice: gameSlice.reducer
});

const store = configureStore({
  reducer: gameLogic,
  devTools: true
});

module.exports = {
  store,
  gameSlice
}
