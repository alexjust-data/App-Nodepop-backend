# Nodepop Engine

The Nodepop Engine is a server-side solution crafted using Node.js alongside Express. It serves as the backbone for a hypothetical product marketplace platform. Within this repository, you'll find the codebase and guidelines for deploying and operating the application across developmental and live setups.

## Install
Install dependencies:
```sh
# create a file for dependencies `package.json`
$ npm install
```

Review database connection on /lib/connectMongoose.js (see "Start a MongoDB Server in MacOS or Linux")

Load initial data:
```sh
# this command deletes all the data in the database and create default data
$ npm run init-db
```

## Start

```sh
# Run in production mode
npm start

# or run in development mode
npm run dev 
```

## Test microservice

```sh
npx nodemon npx nodemon testThumbnailService.js

Respuesta del servicio de thumbnails: 
{
  status: 'Completed',
  thumbnailPath: '/Users/alex/Desktop/KEEPKODING/Practica/App-Nodepop-backend/public/img/thumbnails/test_thumbnail6.png'
}
```



### Exemples


```sh
# username : 'admin@example.com'
# userpass : '1234'
```

Paths
```sh
# Filters
http://127.0.0.1:3000/?name=Bicicleta
# Pagination
http://127.0.0.1:3000/?skip=2&limit=7
# Sorting
http://127.0.0.1:3000/?sort=-price%20name
# Filters
http://127.0.0.1:3000/?tags=lifestyle,motor
http://127.0.0.1:3000/?venta=true
# cheack ads price between 10 y 100:
http://127.0.0.1:3000/?price=10-100
http://127.0.0.1:3000/?price=10-
http://127.0.0.1:3000/?price=-100
http://127.0.0.1:3000/?price=100

```

Api

```sh
# Api doc
http://127.0.0.1:3000/api-doc

# multiples gets by api
http://127.0.0.1:3000/api/ads?name=prueba&option=true&tags=motor&img
# res
{
    "result": {
        "_id": "659d2a6fbfda74c58f0dfbb7",
        "name": "Vespino",
        "option": true,
        "price": 2,
        "img": "img-1704798831210-1readme.png",
        "tags": [
            "lifestyle"
        ],
        "owner": {
            "_id": "659d275e2203518b634d43cc",
            "email": "admin@example.com"
        },
        "__v": 0
    }
}
