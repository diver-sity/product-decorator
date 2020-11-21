##Solution
The problem is modelled as an ETL process of combining data from two sources. 
The process involved writing small temporary files for storing pages of products and finally combining these small files into an output file. 


## Design
The data set could potentially reach 100 million items. If each item is of the size of about 3kb, the end result could be some hundred gigabytes, not something that can usually be held in memory. 
The code structure generally follows the principle of composition over inheritance. It makes heavy use of functions' status as the first-class citizen in the node.js world, something missing from some object-oriented programming languages. 


## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test
```


#Assumptions
- when the application is following the next page links and reaches a page where there is no product (an empty array), it is correct to stop processing other pages. 
- The field video_count is a reliable indication of whether there is a video link or not for a given product. 
- There is enough disk space for storing all the files required for this ETL process, and relevant file operations are permitted, especially on /tmp. 
- If any API read fails, the ETL process should stop. The result will not have all products even if all other reads are fine. 
- Products that have preview videos are a very small minority. 
- HATEOAS is implemented with good consistency across `_links.last`, `page_size`, `total_items`, `page_count` and `page`.

