const { toMatchImageSnapshot } = require('jest-image-snapshot');
expect.extend({ toMatchImageSnapshot });

const {
  getGridBase,
  getImageFrom,
  getSimilarity,
  findImageInImage,
  getImageFromImage,
  getItemsFoundInImage,
  getImageWithThreshold,
  getAllColorsFromColorHistogram
} = require('../../src/utils/imageLib')

describe('imageLib', () => {
  describe('unit tests', () => {
    describe('getGridBase', () => {
      it('works with 800x600 - 100x100', async () => {
        const dimensions = {
          container: {
            w: 800,
            h: 600
          },
          region: {
            w: 100,
            h: 100
          }
        }
        const result = await getGridBase(dimensions);
        // result is an objects array
        expect(result.length).toBe(48);
        const expected = {
          first: {
            row: 0,
            column: 0,
            x: 0,
            y: 0,
            w: dimensions.region.w,
            h: dimensions.region.h
          },
          last: {
            row: 5,
            column: 7,
            x: 700,
            y: 500,
            w: dimensions.region.w,
            h: dimensions.region.h
          }
        }
        expect(result[0]).toStrictEqual(expected.first);
        expect(result[result.length - 1]).toStrictEqual(expected.last);
      });

      it('works with 100x100 - 33x33', async () => {
        const dimensions = {
          container: {
            w: 100,
            h: 100
          },
          region: {
            w: 33,
            h: 33
          }
        }
        const result = await getGridBase(dimensions);
        // result is an objects array
        expect(result.length).toBe(9);
        const expected = {
          last: {
            row: 2,
            column: 2,
            x: 66,
            y: 66,
            w: dimensions.region.w,
            h: dimensions.region.h
          }
        }
        expect(result[result.length - 1]).toStrictEqual(expected.last);
      });

      it('works with 110x110 - 33x33', async () => {
        const dimensions = {
          container: {
            w: 110,
            h: 110
          },
          region: {
            w: 33,
            h: 33
          }
        }
        const result = await getGridBase(dimensions);
        // result is an objects array
        expect(result.length).toBe(9);
        const expected = {
          last: {
            row: 2,
            column: 2,
            x: 66,
            y: 66,
            w: dimensions.region.w,
            h: dimensions.region.h
          }
        }
        expect(result[result.length - 1]).toStrictEqual(expected.last);
      });
    });

    it('getImageFrom', async () => {
      const filePath = './test/utils/images/dude.png';
      const image = await getImageFrom(filePath);
      expect(image.width).toBe(288);
      expect(image.height).toBe(48);
      const maxDiff = 0;
      const options = {
        customSnapshotIdentifier: 'getImageFrom',
        failureThreshold: maxDiff,
        failureThresholdType: 'pixel'
      }
      await expect(await image.toBase64({ type: 'image/png' })).toMatchImageSnapshot(options);
    });

    it('getImageWithThreshold', async () => {
      const filePath = './test/utils/images/game-init-left.png';
      const image = await getImageFrom(filePath);
      const threshold = 205;
      const imageWithThreshold = await getImageWithThreshold(image, threshold, 'black');
      const maxDiff = 0;
      const options = {
        customSnapshotIdentifier: 'getImageWithThreshold',
        failureThreshold: maxDiff,
        failureThresholdType: 'pixel'
      }
      await expect(await imageWithThreshold.toBase64({ type: 'image/png' })).toMatchImageSnapshot(options);
    });

    describe('getAllColorsFromColorHistogram', () => {
      it('Only return existing colors', async () => {
        // Create a fake
        const fakeColorHistogram = new Array(512).fill(0);
        fakeColorHistogram[20] = 25;
        fakeColorHistogram[31] = 75;
        const result = await getAllColorsFromColorHistogram(fakeColorHistogram);
        const expected = [
          { index: 20, value: 25 },
          { index: 31, value: 75 },
        ];
        expect(result).toStrictEqual(expected);
      });
    });

    it('getImageFromImage', async () => {
      const filePath = './test/utils/images/dude.png';
      const imagesDude = await getImageFrom(filePath);
      const dimensions = {
        container: {
          w: imagesDude.width,
          h: imagesDude.height
        },
        region: {
          w: imagesDude.width / 9,
          h: imagesDude.height
        }
      };
      const gridData = await getGridBase(dimensions);
      const imageData = gridData.filter(i => i.row === 0 && i.column === 0);
      const result = await getImageFromImage(imagesDude, imageData[0]);
      expect(result.width).toBe(dimensions.region.w);

      const maxDiff = 0;
      const options = {
        customSnapshotIdentifier: 'getImageFromImage',
        failureThreshold: maxDiff,
        failureThresholdType: 'pixel'
      }
      await expect(await result.toBase64({ type: 'image/png' })).toMatchImageSnapshot(options);

    });

    it('findImageInImage', async () => {
      // imageContainer path, imageFind path
      // return region

      // Get images
      const filePathF = './test/utils/images/dude-left.png';
      const imageFind = await getImageFrom(filePathF);
      const filePathC = './test/utils/images/game-init-left.png';
      const imageContainer = await getImageFrom(filePathC);
      // get Regions
      const region = {
        w: imageContainer.width / 10,
        h: imageContainer.height / 10
      };
      const findData = await findImageInImage(imageContainer, imageFind, region.w, region.h);
      // Check ronw and column
      const result = findData.filter(i => i.found > 0).sort((a, b) => b.found - a.found);
      expect(result[0].row).toBe(8);
      expect(result[0].column).toBe(1);
      // Visual SnapShot
      const maxDiff = 0;
      const options = {
        customSnapshotIdentifier: 'findImage',
        failureThreshold: maxDiff,
        failureThresholdType: 'pixel'
      };
      const resultImage = await getImageFromImage(imageContainer, result[0]);
      await expect(await resultImage.toBase64({ type: 'image/png' })).toMatchImageSnapshot(options);
    });

    it('getItemsFoundInImage', async () => {
      // How many stars are in the image?
      // Get images
      const filePathItem = './test/utils/images/star.png';
      const imageItem = await getImageFrom(filePathItem);
      const filePathScene = './test/utils/images/game-init-stars-mov.png';
      const imageScene = await getImageFrom(filePathScene);
      // Act: How many stars are in the image?
      const itemsFound = await getItemsFoundInImage(imageItem, imageScene);
      // Check
      expect(itemsFound).toBe(12);
    });

  });

  describe('integration tests', () => {
    it('find By Similarity', async () => {
      const filePath = './test/utils/images/dude.png';
      const imagesDude = await getImageFrom(filePath);
      const dimensions = {
        container: {
          w: imagesDude.width,
          h: imagesDude.height
        },
        region: {
          w: imagesDude.width / 9,
          h: imagesDude.height
        }
      };
      const indexImageToFind = 3;
      const gridData = await getGridBase(dimensions);
      const imageData = gridData.filter(i => i.row === 0 && i.column === indexImageToFind);
      const imageToFind = await getImageFromImage(imagesDude, imageData[0]);

      // Regions Loop
      const findData = [];
      for (let index = 0; index < gridData.length; index++) {
        const item = gridData[index];
        const tmpImage = await getImageFromImage(imagesDude, item);
        const newData = {
          row: item.row,
          column: item.column,
          similarity: await getSimilarity(imageToFind, tmpImage)
        };
        findData.push(newData);
      }

      // Check
      const result = findData.sort((a, b) => b.similarity - a.similarity);
      expect(result[0].column).toBe(indexImageToFind);
      expect(parseInt(result[0].similarity * 100)).toBe(100); // 100%
    });

    it('How many boms are in the image?', async () => {
      // Get images
      const filePathItem = './test/utils/images/bomb.png';
      const imageItem = await getImageFrom(filePathItem);
      const filePathScene = './test/utils/images/game-init-stars-mov.png';
      const imageScene = await getImageFrom(filePathScene);

      // Act: How many boms are in the image?
      const itemsFound = await getItemsFoundInImage(imageItem, imageScene);

      // Check
      expect(itemsFound).toBe(1);
    });

    it('test morphologicalGradient', async () => {
      const filePathItem = './test/utils/images/game-over.png';
      const imageItem = await getImageFrom(filePathItem);
      const resultImage = imageItem.grey().morphologicalGradient();

      // Visual SnapShot
      const maxDiff = 0;
      const options = {
        customSnapshotIdentifier: 'morphologicalGradient',
        failureThreshold: maxDiff,
        failureThresholdType: 'pixel'
      };
      await expect(await resultImage.toBase64({ type: 'image/png' })).toMatchImageSnapshot(options);
      
    });
  });

});