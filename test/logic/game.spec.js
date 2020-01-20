const { gameStore, gameController } = require('../../src/scenes/game/logic');
const { initialState } = require('../../src/scenes/game/logic/initialState');

describe('scenes/game', () => {
  let storeTesting;
  beforeEach(async () => {
    storeTesting = gameStore;
  });

  it('start with default values', async () => {
    const result = await storeTesting.getState();
    expect(result.gameController).toBe(initialState);
    expect(result).toMatchSnapshot();
  });

  it('action: moveTo right', async () => {
    // Move the player to the right
    const nextMoveTo = {
      left: false,
      right: true,
      up: false
    };
    await storeTesting.dispatch(gameController.actions.moveTo(nextMoveTo));

    // Checks
    const result = storeTesting.getState();
    expect(result.gameController.velocity.animation).toBe('right');
    expect(result.gameController.velocity.x).toBeGreaterThan(initialState.velocity.x);
    expect(parseInt(result.gameController.velocity.y)).toBe(initialState.velocity.y);
  });

  it('action: moveTo left', async () => {
    // Move the player to the left
    const nextMoveTo = {
      left: true,
      right: false,
      up: false
    };
    await storeTesting.dispatch(gameController.actions.moveTo(nextMoveTo));

    // Checks
    const result = storeTesting.getState();
    expect(result.gameController.velocity.animation).toBe('left');
    expect(result.gameController.velocity.x).toBeLessThan(initialState.velocity.x);
    expect(parseInt(result.gameController.velocity.y)).toBe(initialState.velocity.y);
  });

  it('action: moveTo up', async () => {
    // Move the player up
    const nextMoveTo = {
      left: false,
      right: false,
      up: true
    };
    await storeTesting.dispatch(gameController.actions.moveTo(nextMoveTo));

    // Checks
    const result = storeTesting.getState();
    expect(result.gameController.velocity.animation).toBe('turn');
    expect(result.gameController.velocity.x).toBe(initialState.velocity.x);
    expect(result.gameController.velocity.y).toBeLessThan(initialState.velocity.y);
  });

  it('action: incrementScore star', async () => {
    await storeTesting.dispatch(gameController.actions.incrementScore('star'));

    // Checks
    const result = storeTesting.getState();
    expect(result.gameController.score).toBeGreaterThan(initialState.score);
  });

  it('action: setGameOver true with inmunity', async () => {
    await storeTesting.dispatch(gameController.actions.setInmunity(100));
    await storeTesting.dispatch(gameController.actions.setGameOver(true));

    // Checks
    const result = storeTesting.getState();
    expect(result.gameController.gameOver).toBe(false);
  });

  it('action: setGameOver true without inmunity', async () => {
    await storeTesting.dispatch(gameController.actions.setInmunity(0));
    await storeTesting.dispatch(gameController.actions.setGameOver(true));

    // Checks
    const result = storeTesting.getState();
    expect(result.gameController.gameOver).toBe(true);
  });  

  it('action: setinfo', async () => {
    const infoData = {
      test: true
    };
    await storeTesting.dispatch(gameController.actions.setInfo(infoData));

    // Checks
    const result = storeTesting.getState();
    expect(result.gameController.info).toBe(infoData);
  });

  it('action: setInmunity', async () => {
    const steps = 1; // moveTo inmune steps
    await storeTesting.dispatch(gameController.actions.setInmunity(steps));

    // Checks Before
    const resultBefore = storeTesting.getState();
    expect(resultBefore.gameController.inmunity).toBe(steps);

    // moveTo must reduce inmunity
    const nextMoveTo = {
      left: false,
      right: false,
      up: true
    };
    await storeTesting.dispatch(gameController.actions.moveTo(nextMoveTo));

    // Checks After
    const resultAtfer = storeTesting.getState();
    expect(resultAtfer.gameController.inmunity).toBe(steps-1);

  });  
});


