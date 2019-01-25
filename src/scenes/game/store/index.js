const { createStore, combineReducers } = require('redux');
const { devToolsEnhancer } = require('redux-devtools-extension');

const { gameSlice } = require('./slices');

const gameLogic = combineReducers({
  gameSlice: gameSlice.reducer
});

const store = createStore(gameLogic, /* preloadedState, */ devToolsEnhancer(
  // Specify name here, actionsBlacklist, actionsCreators and other options if needed
  {
    actionsBlacklist: [ 'gameSlice/setInfo' ] // hide this actions in redux devTools
  }
));

module.exports = {
  store,
  gameSlice
};
