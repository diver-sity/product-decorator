import { v4 as generator } from "uuid";
import * as fs from "fs";
import cleanUP from "./Cleaner";

let paths = [];

describe('Cleaner', () => {
  beforeEach(() => {
    paths = [
      `/tmp/product-decorator-Cleaner-spec-${generator()}.txt`,
      `/tmp/product-decorator-Cleaner-spec-${generator()}.txt`
    ];
  });

  describe('#cleanUP', () => {
    it('removes the given files', () => {
      paths.forEach(p => {
        fs.writeFileSync(p, p);
      });

      paths.push("/not/a/valid/path.txt");
      expect.assertions(3);
      return cleanUP(paths).then(() => {
        paths.forEach(p => {
          expect(fs.existsSync(p)).toBe(false);
        });
      });
    });

    describe('if no path is given', () => {
      it('should do nothing', () => {
        const unlink = jest.spyOn(fs, "unlink");

        expect.assertions(1);
        return cleanUP([]).then(() => {
          expect(unlink).toBeCalledTimes(0);
        });
      });
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
