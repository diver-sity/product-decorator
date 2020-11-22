import axios from "../config/axiosInstance";
import fetchFromSource from "./RestAPIExtractor";
import * as ZeroVideoProductLoader from "./ZeroVideoProductLoader";
import * as VideoLinkedProductLoader from "./VideoLinkedProductLoader";
import * as VideoLinkDecorator from "./VideoLinkDecorator";
import { productWithNoVideo, productWithVideo, productWithVideoURL } from "../fixtures/Products";
import ProductFetchError from "../errors/ProductFetchError";
import FileOperationError from "../errors/FileOperationError";

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

    describe('if fetch fails', () => {
      it('throws an error', () => {
        get.mockRejectedValueOnce(new Error("no connection"));

        expect.assertions(1);
        return fetchFromSource("http://localhost/1").catch((error) => {
          expect(error).toBeInstanceOf(ProductFetchError);
        })
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

      describe('if file operation fails', () => {
        it('throws an error', () => {
          get.mockResolvedValueOnce({
            data: {
              _embedded: {
                product: [productWithNoVideo, productWithVideo]
              }
            }
          });

          saveProducts.mockRejectedValue(new Error("no connection"));
          saveLinkedProducts.mockResolvedValue(null);
          addVideoURL.mockResolvedValue(productWithVideoURL);
          expect.assertions(1);
          return fetchFromSource("http://localhost/1").catch((error) => {
            expect(error).toBeInstanceOf(FileOperationError);
          })
        });
      })
    });

  });
});
