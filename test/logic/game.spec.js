const { store, gameSlice } = require('../../src/scenes/game/store');
const { initialState } = require('../../src/scenes/game/store/slices');

describe('scenes/game', () => {
  let storeTesting;
  beforeEach(async () => {
    storeTesting = store;
  });

  it('start with default values', async () => {
    const result = await storeTesting.getState();
    expect(result.gameSlice).toBe(initialState);
    expect(result).toMatchSnapshot();
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

  it('action: setGameOver true with inmunity', async () => {
    await storeTesting.dispatch(gameSlice.actions.setInmunity(100));
    await storeTesting.dispatch(gameSlice.actions.setGameOver(true));

    // Checks
    const result = storeTesting.getState();
    expect(result.gameSlice.gameOver).toBe(false);
  });

  it('action: setGameOver true without inmunity', async () => {
    await storeTesting.dispatch(gameSlice.actions.setInmunity(0));
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

  it('action: setInmunity', async () => {
    const steps = 1; // moveTo inmune steps
    await storeTesting.dispatch(gameSlice.actions.setInmunity(steps));

    // Checks Before
    const resultBefore = storeTesting.getState();
    expect(resultBefore.gameSlice.inmunity).toBe(steps);

    // moveTo must reduce inmunity
    const nextMoveTo = {
      left: false,
      right: false,
      up: true
    };
    await storeTesting.dispatch(gameSlice.actions.moveTo(nextMoveTo));

    // Checks After
    const resultAtfer = storeTesting.getState();
    expect(resultAtfer.gameSlice.inmunity).toBe(steps-1);

  });  
});


