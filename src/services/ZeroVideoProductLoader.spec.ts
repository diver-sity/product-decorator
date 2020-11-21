import saveProducts from "./ZeroVideoProductLoader";
import { socks } from "../fixtures/Products";
import * as fs from "fs";

describe('ZeroVideoProductLoader', () => {

  describe('#saveProducts', () => {
    describe('if there is no product', () => {
      it('does nothing', () => {
        expect.assertions(1);
        return saveProducts([], 1).then((result) => {
          expect(result).toBeUndefined();
        })
      });
    });

    describe('if there is a product or more', () => {
      it('saves a stringified array of products, removing the brackets', () => {
        let pathToClear;
        expect.assertions(1);
        return saveProducts([socks], 1).then((path: string) => {
          const result = fs.readFileSync(path);
          pathToClear = path;
          expect(JSON.parse(result.toString())).toEqual(socks);
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

      describe('if write fails', () => {
        let writeFile: jest.SpyInstance;

        beforeEach(() => {
          jest.resetAllMocks();
          writeFile = jest.spyOn(fs.promises, "writeFile");
        })

        it('passes the error to the caller', () => {

          writeFile.mockRejectedValue(new Error("EACCES"));
          expect.assertions(1);
          return saveProducts([socks], 1).catch((error: Error) => {
            expect(error.message).toEqual("EACCES");
          })
        });
      })
    });
  });
});
