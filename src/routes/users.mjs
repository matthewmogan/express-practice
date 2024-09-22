import { Router } from "express"
import { validationResult, checkSchema, matchedData } from "express-validator"
import { userValidation } from "../utils/validationSchemas.mjs"
import { extractUsername, logSessionStore } from "../utils/middleware/middleware.mjs"
import { User } from "../mongoose/schemas/user.mjs"
import { hashPassword } from "../utils/encryption.mjs"

const router = Router()

// GET - request.QUERY by username, and get all users 
// GET http://localhost:4001/api/users?usernameIncludes=bill - this will return all documents where the username includes Bill. 
// GET http://localhost:4001/api/users - this will return all users 
// Industry standard to prefix api routes with "API." If you are getting this data in your React code / app, you would go ahead and render this out to your users with something like a .map pattern

router.get( "/api/users" ,logSessionStore, async (request, response) => {
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

router.post("/api/users", checkSchema(userValidation), async (request, response) => {
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
// http://localhost:4001/api/users/billballoon58 searches the User model for billballoon58 and returns the document that has billballoon58 saved as the username if it finds a match, returns status 404 if it can't find a match

router.get("/api/users/:username", extractUsername, async (request,response) => {
    const {username} = request
    const user = await User.findOne({username: username})
    if (!user) return response.status(404).send("Could not find user with submitted username")
    response.status(200).send(user)
})

// PUT EXAMPLE //
// Put requests are used to completely replace a resource. When you send a put request, you're expected to send the entire updated object, even if you are only changing part of it 

router.put("/api/users/:username", extractUsername, checkSchema(userValidation), async (request, response) => {
    const result = validationResult(request) 
    if(!result.isEmpty()) return response.send(result.array())
    const data = matchedData(request)
    data.password = hashPassword(data.password)
    const newUser = {...data}
    await User.findOneAndReplace({username: request.username}, {...newUser, username: request.body.username})
    return response.sendStatus(200)
})

// PATCH EXAMPLE //
// Update fields passed in in body, for the username specified in the params. runValidators = true pushes the updated fields through the validation schema in the model, and setting new to true tells the model to return the updated document, not the old document prior to the patch 

router.patch("/api/users/:username", extractUsername, async (request, response) => {
    const updates = request.body // extract an object with the key value pairs of all the updates from the body (password and display name)
    console.log(request.body)
    console.log(updates)
    try {
        const updatedUser = await User.findOneAndUpdate(
            {username: request.username},
            {$set: updates},
            {new: true, runValidators: true}
        );
        if (!updatedUser) {
            return response.status(404).send({ message: 'User not found' });
        }
        return response.status(200).send(updatedUser)
    } catch (error) {
        console.error('Error updating user:', error);
        return response.status(500).send({ message: 'Internal server error' });
    }
})

export default router