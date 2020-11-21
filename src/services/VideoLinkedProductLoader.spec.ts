import saveProducts, { path } from "./VideoLinkedProductLoader";
import { socks } from "../fixtures/Products";
import * as fs from "fs";

describe('VideoLinkedProductLoader', () => {

  describe('#saveProducts', () => {
    beforeEach(() => {
      fs.writeFileSync(path, "");
    });

    describe('if there is no product', () => {
      it('does nothing', () => {
        expect.assertions(1);
        return saveProducts([], 1).then((result) => {
          expect(result).toBeUndefined();
        })
      });
    });

    describe('if there is a product or more', () => {
      describe('if it is the first page', () => {
        it('saves a stringified array of products, removing the closing bracket', () => {
          expect.assertions(1);
          return saveProducts([socks], 1).then(() => {
            const result = fs.readFileSync(path);
            expect(JSON.parse(result.toString() + "]")).toEqual([socks]);
          });
        });
      });

      describe('if it is not the first page', () => {
        it('saves a stringified array of products, removing the opening and closing brackets, adding a comma in front', () => {
          let pathToClear = path;
          expect.assertions(1);
          return saveProducts([socks], 2).then(() => {
            const result = fs.readFileSync(path);
            expect(JSON.parse("[" + result.toString().substr(1) + "]")).toEqual([socks]);
          }).finally(() => {
            if (pathToClear) {
              try {
                fs.unlinkSync(pathToClear);
              } catch (error) {
                console.error(`failed to remove ${pathToClear}, ${error}`)
              }
            }
          })
        });
      });

      describe('if write fails', () => {
        let appendFile: jest.SpyInstance;

        beforeEach(() => {
          jest.resetAllMocks();
          appendFile = jest.spyOn(fs.promises, "appendFile");
        })

        it('passes the error to the caller', () => {

          appendFile.mockRejectedValue(new Error("EACCES"));
          expect.assertions(1);
          return saveProducts([socks], 1).catch((error: Error) => {
            expect(error.message).toEqual("EACCES");
          })
        });
      })
    });
  });
});
