import { Router } from "express"
import { validationResult, checkSchema, matchedData } from "express-validator"
import { mockUsers } from "../utils/constants/constants.mjs"
import { createUserValidationSchema } from "../utils/validationSchemas.mjs"
import { resolveIndexUserByID, extractUsername } from "../utils/middleware/middleware.mjs"
import { User } from "../mongoose/schemas/user.mjs"
import { hashPassword } from "../utils/encryption.mjs"

const router = Router()

// GET - request.QUERY by username, and get all users 
// GET http://localhost:4001/api/users?usernameIncludes=bill - this will return all documents where the username includes Bill. 
// GET http://localhost:4001/api/users - this will return all users 
// Industry standard to prefix api routes with "API." If you are getting this data in your React code / app, you would go ahead and render this out to your users with something like a .map pattern

router.get( "/api/users", async (request, response) => {
    const { query: {usernameIncludes} } = request
    if (usernameIncludes) {
        const search = RegExp(usernameIncludes) // create a regular expression to search for strings that include username
        const users = await User.find({username: search}) // async function to search the user model for the username keyword
        return response.status(201).send(users)
    }
    const users = await User.find(); // if no "usernameIncludes" parameter, then return all users in the User model
    return response.status(201).send(users)
})

// POST - CREATE USER with user specified in body
// POST http://localhost:4001/api/users - with a JSON body that includes username, displayname, and password that pass the validation schema checks. This will create a new user and save it to the user database. However, this doesn't log the user into the session and authenticate. It just creates and saves the user credentials. Needs app.use(express.json()) otherwise we won't be able to parse the body of the put request

router.post("/api/users", checkSchema(createUserValidationSchema), async (request, response) => {
    const result = validationResult(request) // grabs dynamic property that checkSchema added to the object
    if(!result.isEmpty()) return response.send(result.array()) // if not empty (meaning there are errors) we send back the results array full of errors
    const data = matchedData(request) // only returns the data that has been validated by express validator 
    data.password = hashPassword(data.password) // hash the password
    const newUser = new User(data) // creates a new instance of the User model, which represents a single document that will be stored in the MongoDB users collection.
    try {
        const savedUser = await newUser.save() 
        return response.status(201).send(savedUser)
    } catch (err) {
        console.log(err)
        return response.sendStatus(400)
    }
})

// DELETE A USER by USERNAME
// http://localhost:4001/api/users searches for a user with the exact username in the database, then deletes that user from the User model

router.delete("/api/users/:username",extractUsername, async (request, response) => {
    await User.findOneAndDelete({username: request.username}).exec()
    response.sendStatus(200)
})

// GET - request.PARAMS EXAMPLE //

router.get("/api/users/:username", extractUsername, async (request,response) => {
    const {username} = request
    const user = await User.findOne({username: username})
    if (!user) return response.status(404).send("Could not find user with submitted username")
    response.status(200).send(user)
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


export default router