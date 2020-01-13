const { toMatchImageSnapshot } = require('jest-image-snapshot');
expect.extend({ toMatchImageSnapshot });

const {
  getImageFrom,
  findImageInImage
} = require('../../../src/utils/imageLib');

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

  it('should match visual find when move to the right', async () => {
    // Get a similar image to find (left dude)
    const imageToFind = await getImageFrom('./test/utils/images/dude-left.png');

    // Move to the right
    for (let index = 0; index < 5; index++) {
      await page.keyboard.press('ArrowRight', { delay: 1000 });
    }

    // Capture ScreenShot
    const canvas = await page.screenshot();
    const imageJsFromCanvas = await getImageFrom(canvas);

    // Find left dude o similar in ScreenShot
    const findData = await findImageInImage(imageJsFromCanvas, imageToFind, imageJsFromCanvas.width / 4, imageJsFromCanvas.height / 4);
    const lastCell = findData[findData.length - 1];

    // Check row and column. Must be in the right of the screen
    const result = findData.filter(i => i.found > 0).sort((a, b) => b.found - a.found);
    expect(result[0].row).toBe(lastCell.row);
    expect(result[0].column).toBe(lastCell.column);

    // Compare screenshot. Score should be 20
    const imageRight = await page.screenshot();
    const maxDiff = 700;// bomb + font
    const options = {
      customSnapshotIdentifier: 'game-right.png',
      failureThreshold: maxDiff,
      failureThresholdType: 'pixel'
    }
    await expect(imageRight).toMatchImageSnapshot(options);
  }, 12000); // 12 Seconds

  it('should match visual screenshot when move to the left', async () => {
    // Get a similar image to find (left dude)
    const imageToFind = await getImageFrom('./test/utils/images/dude-left.png');

    // Move to the left
    for (let index = 0; index < 5; index++) {
      await page.keyboard.press('ArrowLeft', { delay: 1000 });
    }

    // Capture ScreenShot
    const canvas = await page.screenshot();
    const imageJsFromCanvas = await getImageFrom(canvas);

    // Find left dude o similar in ScreenShot
    const findData = await findImageInImage(imageJsFromCanvas, imageToFind, imageJsFromCanvas.width / 4, imageJsFromCanvas.height / 4);
    const lastCell = findData[findData.length - 1];

    // Check row and column. Must be in the left of the screen
    const result = findData.filter(i => i.found > 0).sort((a, b) => b.found - a.found);
    expect(result[0].row).toBe(lastCell.row);
    expect(result[0].column).toBe(0);
  }, 12000); // 12 Seconds

  it('should match visual screenshot when move to up', async () => {
    // Get a similar image to find (left dude)
    const imageToFind = await getImageFrom('./test/utils/images/dude-left.png');

    // Move up
    for (let index = 0; index < 5; index++) {
      await page.keyboard.press('ArrowUp', { delay: 1000 });
    }

    // Capture ScreenShot
    const canvas = await page.screenshot();
    const imageJsFromCanvas = await getImageFrom(canvas);
    
    // Find left dude o similar in ScreenShot
    const findData = await findImageInImage(imageJsFromCanvas, imageToFind, 100, 100);
    const lastCell = findData[findData.length - 1];

    // Check row and column. It should be on the left of the screen, on the floor
    const result = findData.filter(i => i.found > 0).sort((a, b) => b.found - a.found);
    expect(result[0].row).toBeLessThan(lastCell.row);
    expect(result[0].column).toBe(0); // It's in the left
  }, 12000); // 12 Seconds  
})