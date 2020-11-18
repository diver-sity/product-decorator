
## Design
The design/code structure generally follows the principle of composition over inheritance. It makes heavy use of functions' status as the first-class citizen in the node.js world, something missing from some object-oriented programming languages. 


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


