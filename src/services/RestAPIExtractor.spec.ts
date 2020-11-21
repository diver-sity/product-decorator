import axios from "../config/axiosInstance";
import fetchFromSource from "./RestAPIExtractor";
import * as ZeroVideoProductLoader from "./ZeroVideoProductLoader";
import * as VideoLinkedProductLoader from "./VideoLinkedProductLoader";
import * as VideoLinkDecorator from "./VideoLinkDecorator";
import { productWithNoVideo, productWithVideo, productWithVideoURL } from "../fixtures/Products";

describe('RestAPIExtractor', () => {
  let get: jest.SpyInstance;
  let saveProducts: jest.SpyInstance;
  let saveLinkedProducts: jest.SpyInstance;
  let addVideoURL: jest.SpyInstance;

  beforeEach(() => {
    get = jest.spyOn(axios, "get");
    saveProducts = jest.spyOn(ZeroVideoProductLoader, "default");
    saveLinkedProducts = jest.spyOn(VideoLinkedProductLoader, "default");
    addVideoURL = jest.spyOn(VideoLinkDecorator, "default");;
  });

  describe('#fetchFromSource', () => {
    describe('fetches a page', () => {
      describe('if the page has next page', () => {
        it('continues to fetch the next page', () => {
          get.mockResolvedValueOnce({
            data: {
              _links: {
                next: {
                  href: "http://localhost/2"
                }
              }
            }
          }).mockResolvedValueOnce({
            data: {
              _links: {

              }
            }
          })


          expect.assertions(1);
          return fetchFromSource("http://localhost/1").then(() => {
            expect(get).toBeCalledTimes(2);
          })
        });
      });
    });

    describe('if the page has products', () => {
      it('separates the products into two sets, decorates one set and saves products into files', () => {
        get.mockResolvedValueOnce({
          data: {
            _embedded: {
              product: [productWithNoVideo, productWithVideo]
            }
          }
        });

        saveProducts.mockResolvedValue("/path/to/temp/file");
        saveLinkedProducts.mockResolvedValue(null);
        addVideoURL.mockResolvedValue(productWithVideoURL);
        expect.assertions(3);
        return fetchFromSource("http://localhost/1").then(() => {
          expect(saveProducts).toBeCalledTimes(1);
          expect(saveLinkedProducts).toBeCalledTimes(1);
          expect(addVideoURL).toBeCalledTimes(1);
        })
      });
    });

  });
});
