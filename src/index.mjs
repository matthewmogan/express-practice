import express from "express";
// express is a top level finction, we need to call express to create the app

const app = express()
// This application object, commonly assigned to a variable like app, serves as the central component of your web application and provides a range of methods to handle HTTP requests, set up middleware, and configure settings.

const PORT = process.env.PORT || 4001
// process.env: An object in Node.js that contains the user environment variables.
// process.env.PORT: Retrieves the value of the PORT environment variable if it's set.


// ----- Mock data ----- //

let mockUsers = [
    {id: 1, username: "matt", displayName: "m23232"},
    {id: 2, username: "bill", displayName: "mergrg32"},
    {id: 3, username: "timmo", displayName: "nhn34342"}
]
let mockProducts = [
    {id: 1, name: "Taco powder", price: 5.99},
    {id: 1, name: "Taco seasoning", price: 8.99},
    {id: 1, name: "Taco shells", price: 12.99},
]
// Params

// app.param("id",(req, res, next ) => {
//     req.params.id = id
//     next()
// })

// ----- RESTfull API ROUTES ----- //

app.get("/api", (req, res, next) => {
    res.status(200).send({
        msg1: "hello",
        msg2: "world"
    })    
})
// format: route, request handler call back function
// Request object - contains http headers in request.headers, contains data in request.body
// Response object - what you can use to modify the response and send it back to the user. Can send back data, text, html, JSON object, and set HTTP status codes (404). res.send("<h1>Hello World</h1>") sends back html code!

app.get("/api/users", (req, res, next) => {
    res.status(200).send(mockUsers)
})
// Industry standard to prefix api routes with "API." If you are getting this data in your React code / app, you would go ahead and render this out to your users with something like a .map pattern

app.get("/api/users/:id", (req, res, next) => {
    const parsedID = parseInt(req.params.id)
    if (isNaN(parsedID)) {
        return res.status(404).send(`Invalid ID`)
    } 
    const findUser = mockUsers.find((element) => { 
        return element.id === parsedID
    })
    if (!findUser) {
        return res.status(404).send("Could not find user with submitted ID")
    }
    res.status(200).send(findUser)
})
// ID is a param here with the identity "id", can be accessed via the params attribute 

app.get("/api/products", (req, res, next) => {
    res.status(200).send(mockProducts)
})


// ----- START SERVER LISTENING TO THE PORT ----- //

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})
// starts the app listening for HTTP requests on port 4001
