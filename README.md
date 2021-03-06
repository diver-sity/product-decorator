### Solution
The problem is modelled as an ETL process of combining data from two sources. Large files and large in-memory data structures are key concerns addressed by this solution. 
The solution involved following the HATEOAS `next` links, writing small temporary files for storing pages of products and finally combining these small files into an output file. The preferred order is ensured via two sets of temporary files:
1. one file for products with video URLs (this is also the final file)
2. a set of files for products without video URLs. Products without video URLs are the majority so one file could potentially be huge and hard to work with. Small files allow for trouble-shoooting. 

A common pain point of running a long ETL process is the loss of already processed things and having to start over again. The solution implemented a redo log mechanism so that the process can pick up from where it left if it failed due to errors such as timing out. HATEOAS link following enabled this mechanism to some extent. 

The original order within each set is maintained. 

Temporary files are cleaned up at the end. 

Code was written following TDD, in node.js 10.20, Typescript 3.9.5. out.json was also manually verified to be valid JSON. 


### Design
The data set could potentially reach 100 million items. If each item is of the size of about 3kb, the end result could be some hundred gigabytes, not something that can usually be held in memory. 
The code structure generally follows the principle of composition over inheritance. It makes heavy use of functions' status as the first-class citizen in the node.js world, something missing from some object-oriented programming languages, and also duck-typing in Typescript and the read-only nature of operations on the source data set. 
The initial design was to fail fast. When any remote access fails, the process was designed to fail. But reality indicated that the process would never finish due to various 503 errors when accessing video URL APIs: 
```
     data:
      { type: 'http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html',
        title: 'Service Unavailable',
        status: 503,
        detail:
         'Server error: `GET https://player.vimeo.com/video/454612934/config` resulted in a `503 backend read error` response:\n<!DOCTYPE html><!-- via fastly --><html lang=\\"en\\"><head><meta charset=\\"utf-8\\"><meta name=\\"robots\\" content=\\"nofoll (truncated...)\n' } },
```
The design then changed to log such failures but to continue processing other products. The outcome then becomes that even though some products may have video URLs according to https://eve.theiconic.com.au/catalog/products, such URLs may not be found in out.json due to processing errors. There was no requirement on this.


### Side note for VSCode users 
Some VSCode extensions run tests in the background. This was an issue while running the application. Some of the tests delete out.json to have a clean start and if they run in the background, the application's running data could be deleted unwittingly. 


### Installation

```bash
$ npm install
```

### Running the app

```bash
$ npm run start
```

The output file is `/tmp/out.json`. 

### Test

```bash
# unit tests
$ npm run test
```


### Assumptions
- when the application is following the next page links and reaches a page where there is no product (an empty array), it is correct to stop processing other pages. 
- The field video_count is a reliable indication of whether there is a video link or not for a given product. 
- There is enough disk space for storing all the files required for this ETL process, and relevant file operations are permitted, especially on /tmp. 
- If any API read fails, the ETL process should stop. The result will not have all products even if all other reads are fine. 
- Products that have preview videos are a very small minority. 
- HATEOAS is implemented with good consistency across `_links.last`, `page_size`, `total_items`, `page_count` and `page`.


### Code structure
As there is no request/response handling, no controller was created. Most functionalities and unit tests are in the `src/services` folder. End-to-end testing seems impractical given the size of the given data set, or lack of a smaller one. There seems a preference to put unit tests along source files. Otherwise, there would have been a `test` folder and that would better hold something like test fixtures. 
Under `src`
- `main.ts`: entry to the application
- `services`: data extraction, transformation, loading and related functionalities. `RestAPIExtractor` is the entry point to the ETL functionality. 
- `dto`: data transfer objects
- `errors`: custom errors
- `fixtures`: test fixtures
- `models`: data models


