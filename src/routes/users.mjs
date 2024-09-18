import {Router} from "express"
import {
    validationResult, 
    checkSchema, 
    matchedData
} from "express-validator"
import { mockUsers } from "../utils/constants/constants.mjs"
import { createUserValidationSchema } from "../utils/validationSchemas.mjs"
import { resolveIndexUserByID } from "../utils/middleware/middleware.mjs"

const router = Router()

// GET - request.QUERY EXAMPLE //

router.get(
    "/api/users", 
    (request, response) => {
        console.log(request.sessionID)
        const result = validationResult(request)
        if (!result.isEmpty()) return response.status(400).send({errors: result.array()})
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
// http://localhost:4001/api/users?filter=username&value=m
// http://localhost:4001/api/products/?key1=value1&key2=value2
// Industry standard to prefix api routes with "API." If you are getting this data in your React code / app, you would go ahead and render this out to your users with something like a .map pattern

// POST EXAMPLE //

router.post("/api/users",
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

// GET - request.PARAMS EXAMPLE //

router.get("/api/users/:id", resolveIndexUserByID, (request,response) => {
    const {findUserIndex} = request
    if (!mockUsers[findUserIndex]) return response.status(404).send("Could not find user with submitted ID")
    response.status(200).send(mockUsers[findUserIndex])
})
// ID is a param here with the identity "id", can be accessed via the params attribute. Params are used to filter lists, etc. Also used for sending data you don't want to display in the browser route. Params are used with GET requests
// http://localhost:4001/api/users/1

// PUT EXAMPLE //

router.put("/api/users/:id",resolveIndexUserByID, (request, response) => {
    // destructure the body and split out findUserIndex so that we can spread the body, without passing in index as a parameter
    const {body, findUserIndex} = request
    mockUsers[findUserIndex] = {id: mockUsers[findUserIndex].id, ...body}
    return response.status(200).send(mockUsers[findUserIndex])
})
// Put requests are used to completely replace a resource. When you send a put request, you're expected to send the entire updated object, even if you are only changing part of it 

// PATCH EXAMPLE //

router.patch("/api/users/:id",resolveIndexUserByID,(request, response) => {
    const {body, findUserIndex} = request
    mockUsers[findUserIndex] = {...mockUsers[findUserIndex], ...body}
    response.status(200).send(mockUsers[findUserIndex])
    // Be careful, if the patch request includes a misspelled key, we will create an extra key in the final object, which is not good. Prevent with validation techniques. 
})

router.delete("/api/users/:id",resolveIndexUserByID, (request, response) => {
    const {body, findUserIndex} = request
    console.log("delete request received")
    mockUsers.splice(findUserIndex,1)
    response.sendStatus(200)
})

export default router