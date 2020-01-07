const { toMatchImageSnapshot } = require('jest-image-snapshot');
expect.extend({ toMatchImageSnapshot });

const gameUrl = 'http://127.0.0.1:8080';

describe('scenes/game', () => {
  let page;
  beforeAll(async () => {
    page = await browser.newPage();
    await page.setViewport({
      width: 800,
      height: 600,
      deviceScaleFactor: 1,
    });
    await page.goto(gameUrl, { "waitUntil": "load", "timeout": 0 })
  }, 30000);

  it('should match html snapshot', async () => {
    await expect(await page.content()).toMatchSnapshot();
  }, 10000);

  it('should match visual screenshot (init)', async () => {
    await page.waitFor(27000); // 27 Seconds. All stars must be stopped
    const image = await page.screenshot();
    const maxDiff = 700// bomb
    const options = {
      customSnapshotIdentifier: 'game-init.png',
      failureThreshold: maxDiff, 
      failureThresholdType: 'pixel'
    }
    await expect(image).toMatchImageSnapshot(options);
  }, 30000); // 30 Seconds

  it('should match visual screenshot when move to the right', async () => {
    for (let index = 0; index < 5; index++) {
      await page.keyboard.press('ArrowRight', {delay: 1000});
    }
    const image = await page.screenshot();
    const maxDiff = 700 + 700;// bomb + pixels of player + S
    const options = {
      customSnapshotIdentifier: 'game-arrow-right.png',
      failureThreshold: maxDiff, 
      failureThresholdType: 'pixel'
    }
    await expect(image).toMatchImageSnapshot(options);
  }, 10000); // 10 Seconds

  it('should match visual screenshot when move to the left', async () => {
    for (let index = 0; index < 5; index++) {
      await page.keyboard.press('ArrowLeft', {delay: 1000});
    }
    const image = await page.screenshot();
    const maxDiff = 700 + 700;// bomb + pixels of player
    const options = {
      customSnapshotIdentifier: 'game-arrow-left.png',
      failureThreshold: maxDiff, 
      failureThresholdType: 'pixel'
    }
    await expect(image).toMatchImageSnapshot(options);
  }, 10000); // 10 Seconds

  it('should match visual screenshot when move to up', async () => {
    for (let index = 0; index < 5; index++) {
      await page.keyboard.press('ArrowUp', {delay: 1000});
    }
    const image = await page.screenshot();
    const maxDiff = 700 + 1300;// bomb + pixels of player
    const options = {
      customSnapshotIdentifier: 'game-arrow-up.png',
      failureThreshold: maxDiff, 
      failureThresholdType: 'pixel'
    }
    await expect(image).toMatchImageSnapshot(options);
  }, 10000); // 10 Seconds  
})