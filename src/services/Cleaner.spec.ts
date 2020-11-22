import { v4 as generator } from "uuid";
import * as fs from "fs";
import cleanUp from "./Cleaner";
import { outPath } from "../config/constants";

let paths = [];

describe('Cleaner', () => {
  beforeEach(() => {
    paths = [
      `/tmp/product-decorator-Cleaner-spec-${generator()}.txt`,
      `/tmp/product-decorator-Cleaner-spec-${generator()}.txt`
    ];
  });

  describe('#cleanUp', () => {
    it('removes the given files', () => {
      paths.forEach(p => {
        fs.writeFileSync(p, p);
      });

      paths.push("/not/a/valid/path.txt");
      expect.assertions(3);
      return cleanUp(paths).then(() => {
        paths.forEach(p => {
          expect(fs.existsSync(p)).toBe(false);
        });
      });
    });

    describe('if no path is given', () => {
      it('should do nothing', () => {
        const unlink = jest.spyOn(fs, "unlink");

        expect.assertions(1);
        return cleanUp([]).then(() => {
          expect(unlink).toBeCalledTimes(0);
        });
      });
    });
  });

  describe('#deleteExistingOutFile', () => {
    it('delete out.json if it exists', () => {
      fs.writeFileSync(outPath, "opt");

      const result = fs.readFileSync(outPath);
      expect(result.toString()).toEqual("opt");
    });
  });

  afterAll(() => {
    try {
      paths.forEach(p => {
        fs.unlinkSync(p);
      });
    } catch (error) {
      console.error(`failed to remove files ${paths}`, JSON.stringify(error, undefined, 2));
    }
  })
});
