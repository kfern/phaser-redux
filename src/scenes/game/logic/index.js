const { createStore, combineReducers } = require('redux');
const { devToolsEnhancer } = require('redux-devtools-extension');

const { gameController } = require('./gameController');

const gameLogic = combineReducers({
  gameController: gameController.reducer
});

const gameStore = createStore(gameLogic, /* preloadedState, */ devToolsEnhancer(
  // Specify name here, actionsBlacklist, actionsCreators and other options if needed
  {
    actionsBlacklist: [ 'gameSlice/setInfo' ] // hide this actions in redux devTools
  }
));

module.exports = {
  gameStore,
  gameController
};
