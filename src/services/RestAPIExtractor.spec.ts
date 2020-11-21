import axios from "../config/axiosInstance";
import fetchFromSource from "./RestAPIExtractor";

describe('RestAPIExtractor', () => {
  let get: jest.SpyInstance;

  beforeEach(() => {
    get = jest.spyOn(axios, "get");
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

  });
});
