# swapi-express-gateway

Deployed API: https://swapi-express-gateway.herokuapp.com/

## General

A gateway API to offload the logic/proxy calls necessary to the SWAPI (https://swapi.py4e.com/api) for the Frontend portion of the challenge, available at: https://swapi-challenge-fe.vercel.app/ . Tasked with composing a complete data payload that would require multiple API calls and data handling, this API offloads the logic from the frontend and houses it inside of an Express API server. While response times for a specific whole character object are on the slow side, such concerns are negated by the choice to render the web app at build time with SSG - providing a snappy web experience. 

## Endpoints

#### /characters

The endpoint allows for a search parameter. Using that query, a proxy call is made to `https://swapi.py4e.com/api/people/?search=${query}`, utilizing some of the functionality of their Django built API. The response is a list of large character objects, with a limit of 10 per page (example below). With the implementation of live search on the front end, I wanted to make the JSON object as small as possible and providing only what was needed: 

1 - the names of the possible matched characters
2 - the id of the character
3 - a link to the image

This was accomplished by initially making the call to the actual SWAPI, parsing the JSON object response, and filtering by the name property. This list is then mapped over to return only the name, id, and image. The name is straightforward as it's provided in the initial response. The id is gathered from the `url` property by splitting the URL string and targeting the correct index. The image is served from a static folder and is mapped to the id of the character. This is returned as a whole object, then sorted by ID, accomplished like so:

```
  const prunedList = results.map(c => {
    const urlsplit = c.url.split("/");
    const id = urlsplit[urlsplit.length - 2]
    const image = `https://swapi-express-gateway.herokuapp.com/assets/images/characters/${id}.jpg`
    const charObj = { name: c.name, id, image };
    return charObj;
  });
  const orderedList = prunedList.sort((a, b) => a.url - b.url);
```

The original payload response from SWAPI with query `https://swapi.py4e.com/api/people/?search=l`: 

```
{
    "count": 37,
    "next": "https://swapi.py4e.com/api/people/?search=l&page=2",
    "previous": null,
    "results": [
        {
            "name": "Luke Skywalker",
            "height": "172",
            "mass": "77",
            "hair_color": "blond",
            "skin_color": "fair",
            "eye_color": "blue",
            "birth_year": "19BBY",
            "gender": "male",
            "homeworld": "https://swapi.py4e.com/api/planets/1/",
            "films": [
                "https://swapi.py4e.com/api/films/1/",
                "https://swapi.py4e.com/api/films/2/",
                "https://swapi.py4e.com/api/films/3/",
                "https://swapi.py4e.com/api/films/6/",
                "https://swapi.py4e.com/api/films/7/"
            ],
            "species": [
                "https://swapi.py4e.com/api/species/1/"
            ],
            "vehicles": [
                "https://swapi.py4e.com/api/vehicles/14/",
                "https://swapi.py4e.com/api/vehicles/30/"
            ],
            "starships": [
                "https://swapi.py4e.com/api/starships/12/",
                "https://swapi.py4e.com/api/starships/22/"
            ],
            "created": "2014-12-09T13:50:51.644000Z",
            "edited": "2014-12-20T21:17:56.891000Z",
            "url": "https://swapi.py4e.com/api/people/1/"
        },
        {
            "name": "Leia Organa",
            "height": "150",
            "mass": "49",
            "hair_color": "brown",
            "skin_color": "light",
            "eye_color": "brown",
            "birth_year": "19BBY",
            "gender": "female",
            "homeworld": "https://swapi.py4e.com/api/planets/2/",
            "films": [
                "https://swapi.py4e.com/api/films/1/",
                "https://swapi.py4e.com/api/films/2/",
                "https://swapi.py4e.com/api/films/3/",
                "https://swapi.py4e.com/api/films/6/",
                "https://swapi.py4e.com/api/films/7/"
            ],
            "species": [
                "https://swapi.py4e.com/api/species/1/"
            ],
            "vehicles": [
                "https://swapi.py4e.com/api/vehicles/30/"
            ],
            "starships": [],
            "created": "2014-12-10T15:20:09.791000Z",
            "edited": "2014-12-20T21:17:50.315000Z",
            "url": "https://swapi.py4e.com/api/people/5/"
        },
    // and 8 more objects of this size...
    ]
}
```

Pruned response from gateway API with the same query params with link to statically hosted images:

```
[
    {
        "name": "Luke Skywalker",
        "id": "1",
        "image": "https://swapi-express-gateway.herokuapp.com/assets/images/characters/1.jpg"
    },
    {
        "name": "Leia Organa",
        "id": "5",
        "image": "https://swapi-express-gateway.herokuapp.com/assets/images/characters/5.jpg"
    },
    {
        "name": "Owen Lars",
        "id": "6",
        "image": "https://swapi-express-gateway.herokuapp.com/assets/images/characters/6.jpg"
    },
    {
        "name": "Beru Whitesun lars",
        "id": "7",
        "image": "https://swapi-express-gateway.herokuapp.com/assets/images/characters/7.jpg"
    },
    {
        "name": "Biggs Darklighter",
        "id": "9",
        "image": "https://swapi-express-gateway.herokuapp.com/assets/images/characters/9.jpg"
    },
    {
        "name": "Anakin Skywalker",
        "id": "11",
        "image": "https://swapi-express-gateway.herokuapp.com/assets/images/characters/11.jpg"
    },
    {
        "name": "Wilhuff Tarkin",
        "id": "12",
        "image": "https://swapi-express-gateway.herokuapp.com/assets/images/characters/12.jpg"
    },
    {
        "name": "Han Solo",
        "id": "14",
        "image": "https://swapi-express-gateway.herokuapp.com/assets/images/characters/14.jpg"
    },
    {
        "name": "Jabba Desilijic Tiure",
        "id": "16",
        "image": "https://swapi-express-gateway.herokuapp.com/assets/images/characters/16.jpg"
    },
    {
        "name": "Wedge Antilles",
        "id": "18",
        "image": "https://swapi-express-gateway.herokuapp.com/assets/images/characters/18.jpg"
    }
]
```

#### /characters/:id

This endpoint provides a rather cumbersome object. Large in size, the object is a compilation of all the needed data on the front end accomplished in a single API call. As mentioned above, the concern around the slow response times for the multiple proxy calls is negated by static site generation. Since the calls have already been made at build time, the response times are of no matter. That being said, I'd still like to look at compression. 

That original SWAPI call returns an object with properties with multiple other endpoints/arrays of endpoints as seen here:

```
 {
            "name": "Leia Organa",
            "height": "150",
            "mass": "49",
            "hair_color": "brown",
            "skin_color": "light",
            "eye_color": "brown",
            "birth_year": "19BBY",
            "gender": "female",
            "homeworld": "https://swapi.py4e.com/api/planets/2/",
            "films": [
                "https://swapi.py4e.com/api/films/1/",
                "https://swapi.py4e.com/api/films/2/",
                "https://swapi.py4e.com/api/films/3/",
                "https://swapi.py4e.com/api/films/6/",
                "https://swapi.py4e.com/api/films/7/"
            ],
            "species": [
                "https://swapi.py4e.com/api/species/1/"
            ],
            "vehicles": [
                "https://swapi.py4e.com/api/vehicles/30/"
            ],
            "starships": [],
            "created": "2014-12-10T15:20:09.791000Z",
            "edited": "2014-12-20T21:17:50.315000Z",
            "url": "https://swapi.py4e.com/api/people/5/"
        }
```

The logic inside the gateway checks each concerened property, whethere it's an array or a string, and performs the required logic to make a proxy call at that moment, or to recursively break apart the array to then access the string endpoint and make the proxy call. In the end, the object returned to the front end was...large, an example can be seen here: https://swapi-express-gateway.herokuapp.com/api/characters/1

#### /characters/ssg-paths

Similar to the logic at the `/characters` endpoint in that it recieves a list of large objects and prunes the data to only what is needed - in this case, a list of static paths to gather the needed static props to take advantage of state site generation. However, the decision was made to gather ALL of the characters (10 pages, 88 characters) in a single list by making the necessary calls to the SWAPI using a recursive function with a fetch to that API. 

The function compiles a single list of all the characters. That list is then mapped over to return only the ids, which is the list of static paths. While recursion can be dangerous, and all the more with an API call inside of it, I thought it was appropriate given the task at hand and the scope of the project. Knowing the data was stable and unlikely to change, I felt this was an acceptable decision, and opened the door for static site generation. The heart of the logic can be found inside of `utils/getCharacters`.

#### /assets/images/characters

A little win. Simply an endpoint to server static assets. My first exposure to this was needing to serve a file for `certbot` to authenticate a new SSL certificate...I had mistakenly thought it was somehow my own cer that had expired, which led down the deepest of rabbit holes. Well, it turns out it was the actual API that had expired SSL certs. I spent many hours trying to debug what was ultimately a broken source. Lessons learned...including how to serve static assets! Anyway, it's allowed me to serve up images and spice up the site.

### Other Learning

Express is a thing of beauty. It's extremely simple and generous in its advantages. To be able to apply middleware with one line of code that will allow me to traverse CORS issues across my endpoints, to bundle all my responses as JSON, to enable error handling for all endpoints, well geeze - that's pretty great! The available NPM packages make it simple, and with the semi-recent inclusion of ES6 syntax, I felt right at home. I'd love to dive back into Express and build out a backend for my past projects - my lessons have shown how simple it can be to build out full CRUD functionality while using `joi` to easily handle type checking. Very excited.

## Reflection

#### TODOs

* Prune unneeded data arrays inside the complete character object
* Better messaging where it comes to error handling
* Learn TDD for Express
* Paginating responses!
* POST/DELETE with local storage on the FE, or tie in MongoDB with Mongoose
* Build a truly recursive function when breaking apart arrays of endpoints

#### Wins

* I love Express!
* Learned to serve images and provide static assets
* In trying to debug something that was out of my hands (the original SWAPI), I learned a lot about SSL certs and how to go about issuing myself a new one with the help of certbot
* Solid architecture and good use of middleware

#### Challanges

* First time working with Express in a meaningful way
* Took some figuring out to serve static assets
* Async recursive functions with API calls
