import { User } from "../mongoose/schemas/user.mjs";
import { validationResult, matchedData } from "express-validator";
import { hashPassword } from "../utils/encryption.mjs";

export const getUserByUsername = async (request,response) => {
    console.log("request object:")
    console.log(request)
    const {username} = request
    const user = await User.findOne({username: username})
    if (!user) return response.sendStatus(404)
    response.status(200).send(user)
}

export const createUser = async (request, response) => {
    const result = validationResult(request) // grabs dynamic property that checkSchema added to the object
    if(!result.isEmpty()) return response.status(400).send(result.array()) // if not empty (meaning there are errors) we send back the results array full of errors
    const data = matchedData(request) // only returns the data that has been validated by express validator 
    data.password = hashPassword(data.password)
    const newUser = new User(data) // creates a new instance of the User model, which represents a single document that will be stored in the MongoDB users collection.
    try {
        const savedUser = await newUser.save() 
        return response.status(201).send(savedUser)
    } catch (err) {
        console.log(err)
        return response.sendStatus(400)
    }
}