import saveProducts from "./ZeroVideoProductLoader";
import { socks } from "../fixtures/Products";
import * as fs from "fs";

describe('VideoLinkDecorator', () => {

  describe('#saveProducts', () => {
    it('saves a stringified array of products, removing the brackets', () => {
      let pathToClear;
      expect.assertions(1);
      return saveProducts([socks], 1).then(path => {
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
