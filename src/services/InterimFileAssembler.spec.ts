import * as fs from "fs";
import assembleSmallFiles from "./InterimFileAssembler";

describe('InterimFileAssembler', () => {
  const EXPECTED = [{ "video_count": 2, "price": 2.5, "markdown_price": 2, "special_price": 1.5, "returnable": false, "final_sale": false, "final_price": null, "sku": "ksk53-skd82-gg232-jd8s2", "name": "soccer socks" }, { "video_count": 2, "price": 2.5, "markdown_price": 2, "special_price": 1.5, "returnable": false, "final_sale": false, "final_price": null, "sku": "ksk53-skd82-gg232-jd8s2", "name": "soccer socks" }, { "video_count": 2, "price": 2.5, "markdown_price": 2, "special_price": 1.5, "returnable": false, "final_sale": false, "final_price": null, "sku": "ksk53-skd82-gg232-jd8s2", "name": "soccer socks" }, { "video_count": 2, "price": 2.5, "markdown_price": 2, "special_price": 1.5, "returnable": false, "final_sale": false, "final_price": null, "sku": "ksk53-skd82-gg232-jd8s2", "name": "soccer socks" }];


  beforeEach(() => {
    const data = fs.readFileSync("./src/fixtures/out.copy.json");
    fs.writeFileSync("/tmp/out.json", data);
  });

  describe('#assembleSmallFiles', () => {
    describe('if the video linked file and zero-video product files exist', () => {
      it('appends the latter to the first to create a final file', () => {
        assembleSmallFiles([
          "./src/fixtures/product-decorator-1-51909db3-62c2-4e72-af19-8a202e38ab42.txt",
          "./src/fixtures/product-decorator-1-ee01cab1-315b-4ed7-8f24-9c913c8373c5.txt"
        ]);
        return fs.promises.readFile("/tmp/out.json").then(buffer => {
          const result = JSON.parse(buffer.toString());
          expect(result).toEqual(EXPECTED);
        });
      });
    });

    describe('if zero-video files do not exist', () => {
      it('appends a closing bracket to the final file', () => {
        assembleSmallFiles([]);
        return fs.promises.readFile("/tmp/out.json").then(buffer => {
          const result = JSON.parse(buffer.toString());
          const originallyInOutJson = [{ "video_count": 2, "price": 2.5, "markdown_price": 2, "special_price": 1.5, "returnable": false, "final_sale": false, "final_price": null, "sku": "ksk53-skd82-gg232-jd8s2", "name": "soccer socks" }, { "video_count": 2, "price": 2.5, "markdown_price": 2, "special_price": 1.5, "returnable": false, "final_sale": false, "final_price": null, "sku": "ksk53-skd82-gg232-jd8s2", "name": "soccer socks" }];
          expect(result).toEqual(originallyInOutJson);
        });
      });
    });

    describe('if no files exist', () => {
      it('creates a final file with an empty array inside', () => {
        fs.unlinkSync("/tmp/out.json");
        assembleSmallFiles([]);
        return fs.promises.readFile("/tmp/out.json").then(buffer => {
          const result = JSON.parse(buffer.toString());
          expect(result).toEqual([]);
        });
      });
    });
  });

  afterEach(() => {
    fs.unlinkSync("/tmp/out.json");
  });
});
