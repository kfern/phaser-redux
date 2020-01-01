const { store, gameSlice } = require('../../../src/scenes/game/store');
const { initialState } = require('../../../src/scenes/game/store/slices');

describe('store', () => {
  let storeTesting;
  beforeEach(async () => {
    storeTesting = store;
  });

  describe('scenes/game', () => {
    it('start with default values', async () => {
      const result = await storeTesting.getState();
      expect(result.gameSlice).toBe(initialState);
    });

    it('action: moveTo right', async () => {
      // Move the player to the right
      const nextMoveTo = {
        left: false,
        right: true,
        up: false    
      };
      await storeTesting.dispatch(gameSlice.actions.moveTo(nextMoveTo));

      // Checks
      const result = storeTesting.getState();
      expect(result.gameSlice.velocity.animation).toBe('right');
      expect(result.gameSlice.velocity.x).toBeGreaterThan(initialState.velocity.x);
      expect(parseInt(result.gameSlice.velocity.y)).toBe(initialState.velocity.y);
    });

    it('action: moveTo left', async () => {
      // Move the player to the left
      const nextMoveTo = {
        left: true,
        right: false,
        up: false    
      };
      await storeTesting.dispatch(gameSlice.actions.moveTo(nextMoveTo));

      // Checks
      const result = storeTesting.getState();
      expect(result.gameSlice.velocity.animation).toBe('left');
      expect(result.gameSlice.velocity.x).toBeLessThan(initialState.velocity.x);
      expect(parseInt(result.gameSlice.velocity.y)).toBe(initialState.velocity.y);
    });

    it('action: moveTo up', async () => {
      // Move the player up
      const nextMoveTo = {
        left: false,
        right: false,
        up: true    
      };
      await storeTesting.dispatch(gameSlice.actions.moveTo(nextMoveTo));

      // Checks
      const result = storeTesting.getState();
      expect(result.gameSlice.velocity.animation).toBe('turn');
      expect(result.gameSlice.velocity.x).toBe(initialState.velocity.x);
      expect(result.gameSlice.velocity.y).toBeLessThan(initialState.velocity.y);
    });

    it('action: incrementScore star', async () => {
      await storeTesting.dispatch(gameSlice.actions.incrementScore('star'));

      // Checks
      const result = storeTesting.getState();
      expect(result.gameSlice.score).toBeGreaterThan(initialState.score);
    });

    it('action: setGameOver true', async () => {
      await storeTesting.dispatch(gameSlice.actions.setGameOver(true));

      // Checks
      const result = storeTesting.getState();
      expect(result.gameSlice.gameOver).toBe(true);
    });

    it('action: setinfo', async () => {
      const infoData = {
        test: true
      };
      await storeTesting.dispatch(gameSlice.actions.setInfo(infoData));

      // Checks
      const result = storeTesting.getState();
      expect(result.gameSlice.info).toBe(infoData);
    });

  });
});

