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


### Exemples

Admin 
```sh
http://127.0.0.1:3000/admin
# username : 'admin'
# userpass : '1234'
```
> only admin with privileges to add ads

Paths
```sh
# Filters
http://127.0.0.1:3000/?name=Bicicleta
# Pagination
http://127.0.0.1:3000/?skip=2&limit=7
# Sorting
http://127.0.0.1:3000/?sort=-price%20name
# Field Selection
http://127.0.0.1:3000/?fields=name%20-_id%20option
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
# multiples gets by api
http://127.0.0.1:3000/api/ads?tag=mobile&option=false&name=ip&price=50-&start=0&limit=2&sort=price
# res
{
  "results": [
    {
      "_id": "651d273960e534d500295730",
      "name": "iPhone 3GS",
      "option": false,
      "price": 50,
      "img": "2.png",
      "tags": [
        "lifestyle",
        "mobile"
      ],
      "__v": 0
    },
    {
      "_id": "651d273960e534d500295733",
      "name": "iPad Pro",
      "option": true,
      "price": 799,
      "img": "5.png",
      "tags": [
        "mobile"
      ],
      "__v": 0
    }
  ]
}
