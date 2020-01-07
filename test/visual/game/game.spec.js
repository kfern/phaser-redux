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

  it('should match visual screenshot', async () => {
    await page.waitFor(27000); // 27 Seconds. All stars must be stopped
    const image = await page.screenshot();
    const maxDiff = 250 + 600; // bomb + player
    const options = {
      customSnapshotIdentifier: 'game-init.png',
      failureThreshold: maxDiff, 
      failureThresholdType: 'pixel'
    }
    await expect(image).toMatchImageSnapshot(options);
  }, 30000); // 30 Seconds

})