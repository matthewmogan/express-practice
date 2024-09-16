// ----- BOILER PLATE ----- //

import express from "express";
// express is a top level finction, we need to call express to create the app
import {query, body, validationResult, matchedData, checkSchema} from "express-validator"
// used to validate query parameters
import { createUserValidationSchema } from "./utils/validationSchemas.mjs";

const app = express()
// This application object, commonly assigned to a variable like app, serves as the central component of your web application and provides a range of methods to handle HTTP requests, set up middleware, and configure settings.
app.use(express.json())
// Automatic Parsing: Automatically parses JSON data in the request body and makes it available on request.body.
// Error Handling: If the JSON is malformed, express.json() throws a 400 Bad request error, preventing the request from proceeding.
// Lightweight: Built directly into express, eliminating the need for additional packages to handle JSON parsing.
// Integration with Other Middleware: Can be used in conjunction with other middleware like express.urlencoded() for handling different content types.
// replaces express body-parser module
const PORT = process.env.PORT || 4001
// process.env: An object in Node.js that contains the user environment variables.
// process.env.PORT: Retrieves the value of the PORT environment variable if it's set.

// ----- MIDDLEWEAR ----- //

const resolveIndexUserByID = (request, response, next) => {
    const { params: {id} } = request
    const parsedID = parseInt(id)
    if (isNaN(parsedID)) return response.status(404).send(`Invalid ID`)
    const findUserIndex = mockUsers.findIndex((user) => user.id === parsedID)
    if(findUserIndex === -1) return response.sendStatus(404)
    request.findUserIndex = findUserIndex
    next()
}

const loggingMiddleware = (request, response, next) => {
    console.log(`${request.method} - ${request.url}`);
    next();
}

app.use(loggingMiddleware) // enables the middleware globally. to enable for individual routes, pass in betweeten the route. E.g:
// app.get("/api", loggingMiddleware, (request, response, next) => {
//     response.status(200).send({
//         msg1: "hello",
//         msg2: "world"
//     })    
// }) 
// must be registered BETWEEN app.use(express.json()) and routes

// ----- MOCK DATA ----- //

let mockUsers = [
    {id: 1, userName: "matt", displayName: "m23232"},
    {id: 2, userName: "bill", displayName: "mergrg32"},
    {id: 3, userName: "timmo", displayName: "nhn34342"},
    {id: 4, userName: "mxqkwos", displayName: "okiedjqw2"},

]
let mockProducts = [
    {id: 1, name: "Taco powder", price: 5.99},
    {id: 2, name: "Taco seasoning", price: 8.99},
    {id: 3, name: "Taco shells", price: 12.99},
]
// Params

// app.param("id",(request, response, next ) => {
//     request.params.id = id
//     next()
// })

// ----- RESTFULL API ROUTES ----- //

app.get("/api", (request, response, next) => {
    response.status(200).send({
        msg1: "hello",
        msg2: "world"
    })    
})
// format: route, request handler call back function
// request object - contains http headers in request.headers, contains data in request.body
// response object - what you can use to modify the response and send it back to the user. Can send back data, text, html, JSON object, and set HTTP status codes (404). response.send("<h1>Hello World</h1>") sends back html code!

// GET EXAMPLE //

app.get("/api/products", (request, response, next) => {
    return response.status(200).send(mockProducts)
})
// Get request to send an array of all products


// GET - request.QUERY EXAMPLE //

app.get(
    "/api/users", 
    (request, response) => {
        const result = validationResult(request)
        if (!result.isEmpty()) return response.status(400).send({errors: result.array()})
        console.log(result)
        const {
            query: {filter, value}
        } = request
        if (filter && value) 
            return response.send(
                mockUsers.filter((user) => user[filter].includes(value))
            )
        return response.send(mockUsers)
    }
)
// http://localhost:4001/api/users?filter=userName&value=m
// http://localhost:4001/api/products/?key1=value1&key2=value2
// Industry standard to prefix api routes with "API." If you are getting this data in your React code / app, you would go ahead and render this out to your users with something like a .map pattern

// GET - request.PARAMS EXAMPLE //

app.get("/api/users/:id", resolveIndexUserByID, (request,response) => {
    const {findUserIndex} = request
    if (!mockUsers[findUserIndex]) return response.status(404).send("Could not find user with submitted ID")
    response.status(200).send(mockUsers[findUserIndex])
})
// ID is a param here with the identity "id", can be accessed via the params attribute. Params are used to filter lists, etc. Also used for sending data you don't want to display in the browser route. Params are used with GET requests
// http://localhost:4001/api/users/1
    
// POST EXAMPLE //

app.post("/api/users",
    checkSchema(createUserValidationSchema),
    (request, response) => {
        const result = validationResult(request)
        const data = matchedData(request) // only returns the data that has been validated by express validator 
        if (!result.isEmpty()) return response.status(400).send({errors: result.array()})
        const newUser = {
            id: mockUsers[mockUsers.length-1].id+1, 
            ...data
        } // ... body spreads the contents of the request object into the newUser object
        mockUsers.push(newUser)
        return response.status(200).send(newUser)
})
// Create a new user and push into the user array. Needs app.use(express.json()) otherwise we won't be able to parse the body of the put request

// PUT EXAMPLE //

app.put("/api/users/:id",resolveIndexUserByID, (request, response) => {
    // destructure the body and split out findUserIndex so that we can spread the body, without passing in index as a parameter
    const {body, findUserIndex} = request
    mockUsers[findUserIndex] = {id: mockUsers[findUserIndex].id, ...body}
    return response.status(200).send(mockUsers[findUserIndex])
})
// Put requests are used to completely replace a resource. When you send a put request, you're expected to send the entire updated object, even if you are only changing part of it 

// PATCH EXAMPLE //

app.patch("/api/users/:id",resolveIndexUserByID,(request, response) => {
    const {body, findUserIndex} = request
    mockUsers[findUserIndex] = {id: mockUsers[findUserIndex].id, ...body}
    response.status(200).send(mockUsers[findUserIndex])
    // Be careful, if the patch request includes a misspelled key, we will create an extra key in the final object, which is not good. Prevent with validation techniques. 
})

app.delete("/api/users/:id",resolveIndexUserByID, (request, response) => {
    const {body, findUserIndex} = request
    mockUsers.splice(findUserIndex,1)
    response.sendStatus(200)
})

// ----- START SERVER LISTENING TO THE PORT ----- //

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})
// starts the app listening for HTTP requests on port 4001
