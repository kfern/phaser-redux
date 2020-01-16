const { toMatchImageSnapshot } = require('jest-image-snapshot');
expect.extend({ toMatchImageSnapshot });

const {
  getImageFrom,
  findImageInImage,
  getItemsFoundInImage
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
    const maxDiff = 700;
    const options = {
      customSnapshotIdentifier: 'game-init',
      failureThreshold: maxDiff,
      failureThresholdType: 'pixel'
    }
    await expect(image).toMatchImageSnapshot(options);
  }, 30000); // 30 Seconds

  it('should match visual find when move to the right', async () => {
    // Get a similar image to find (left dude)
    const imageToFind = await getImageFrom('./test/utils/images/dude-left.png');

    // Move to the right
    await page.keyboard.press('ArrowRight', { delay: 5000 });

    // Capture ScreenShot
    const canvas = await page.screenshot();
    const imageJsFromCanvas = await getImageFrom(canvas);

    // Visual diff
    const maxDiff = 1100;
    const options = {
      customSnapshotIdentifier: 'game-right',
      failureThreshold: maxDiff,
      failureThresholdType: 'pixel'
    }
    await expect(canvas).toMatchImageSnapshot(options);    

    // Find left dude o similar in ScreenShot
    const findData = await findImageInImage(imageJsFromCanvas, imageToFind, imageJsFromCanvas.width / 4, imageJsFromCanvas.height / 4);
    const lastCell = findData[findData.length - 1];

    // Check row and column. Must be in the right of the screen
    const result = findData.filter(i => i.found > 0).sort((a, b) => b.found - a.found);

    // ScreenShot for analysis
    if (result.length === 0){
      const maxDiff = 0;
      const options = {
        customSnapshotIdentifier: 'move-right',
        failureThreshold: maxDiff,
        failureThresholdType: 'pixel'
      }
      await expect(canvas).toMatchImageSnapshot(options);
    }
    // Sometimes, the following line causes a TypeError: Cannot read property 'row' of undefined
    // If this happens, repeat the test
    expect(result[0].row).toBe(lastCell.row);
    expect(result[0].column).toBe(lastCell.column);

    // How many stars are in the Scene?
    const filePathStar = './test/utils/images/star.png';
    const imageStar = await getImageFrom(filePathStar);
    // Act: How many stars are in the image?
    const starsFound = await getItemsFoundInImage(imageStar, imageJsFromCanvas);
    // Check Stars. 2 stars have been recollected, so there are 10 stars
    expect(starsFound).toBe(10);
    // How many bombs are in the Scene?
    const filePathBomb = './test/utils/images/bomb.png';
    const imageBomb = await getImageFrom(filePathBomb);
    // Act: How many bombs are in the image?
    const bombsFound = await getItemsFoundInImage(imageBomb, imageJsFromCanvas);
    // Check Bombs
    expect(bombsFound).toBe(1);
  }, 12000); // 12 Seconds

  it('should match visual screenshot when move to the left', async () => {
    // Get a similar image to find (left dude)
    const imageToFind = await getImageFrom('./test/utils/images/dude-left.png');

    // Move to the left
    await page.keyboard.press('ArrowLeft', { delay: 5000 });

    // Capture ScreenShot
    const canvas = await page.screenshot();
    const imageJsFromCanvas = await getImageFrom(canvas);

    // Find left dude o similar in ScreenShot
    const findData = await findImageInImage(imageJsFromCanvas, imageToFind, imageJsFromCanvas.width / 4, imageJsFromCanvas.height / 4);
    const lastCell = findData[findData.length - 1];

    // Check row and column. Must be in the left of the screen
    const result = findData.filter(i => i.found > 0).sort((a, b) => b.found - a.found);

    // ScreenShot for analysis
    if (result.length === 0){
      const maxDiff = 0;
      const options = {
        customSnapshotIdentifier: 'move-left',
        failureThreshold: maxDiff,
        failureThresholdType: 'pixel'
      }
      await expect(canvas).toMatchImageSnapshot(options);
    }
    // Sometimes, the following line causes a TypeError: Cannot read property 'row' of undefined
    // If this happens, repeat the test
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
    
    // ScreenShot for analysis
    if (result.length === 0){
      const maxDiff = 0;
      const options = {
        customSnapshotIdentifier: 'move-up',
        failureThreshold: maxDiff,
        failureThresholdType: 'pixel'
      }
      await expect(canvas).toMatchImageSnapshot(options);
    }
    // Sometimes, the following line causes a TypeError: Cannot read property 'row' of undefined
    // If this happens, repeat the test
    expect(result[0].row).toBeLessThan(lastCell.row);
    expect(result[0].column).toBe(0); // It's in the left
  }, 12000); // 12 Seconds  
})