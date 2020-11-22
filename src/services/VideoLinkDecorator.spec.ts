import axios from "../config/axiosInstance";
import addVideoURL from "./VideoLinkDecorator";
import { socks } from "../fixtures/Products";
import Product from "src/models/Product";

describe('VideoLinkDecorator', () => {
  let get: jest.SpyInstance;

  beforeEach(() => {
    get = jest.spyOn(axios, "get");
  });

  describe('#addVideoURL', () => {
    it('fetches video URLs for a given product', () => {
      get.mockResolvedValue({
        data: { "_links": { "self": { "href": "https:\/\/eve.theiconic.com.au\/catalog\/products\/cm638aa10yrl\/videos?page=1" } }, "_embedded": { "videos_url": [{ "url": "https:\/\/video_host\/1271455204.mp4", "_links": { "self": { "href": "https:\/\/video_host\/catalog\/products\/cm638aa10yrl\/videos" } } }] }, "page_count": 1, "page_size": 25, "total_items": 1, "page": 1 }
      })

      expect.assertions(1);
      return addVideoURL(socks).then((result: Product) => {
        expect(result.video_urls).toEqual(["https:\/\/video_host\/1271455204.mp4"])
      })
    });

    describe('if fetch fails', () => {
      it('it logs the error and does not pass it to the caller', () => {
        get.mockRejectedValue({
          toJSON: () => {
            return "cannot connect";
          }
        });
        expect.assertions(1);
        return addVideoURL(socks).then(result => {
          expect(result).toEqual(socks);
        })
      });
    });
  });
});
