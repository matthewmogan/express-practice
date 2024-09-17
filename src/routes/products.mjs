import {Router} from "express"
// import {
//     validationResult, 
//     checkSchema, 
//     matchedData
// } from "express-validator"
// import { createUserValidationSchema } from "../utils/validationSchemas.mjs"
import { mockProducts } from "../utils/constants/constants.mjs"

const router = Router()

// GET EXAMPLE //

router.get("/api/products", (request, response, next) => {
    if(request.signedCookies.hello && request.signedCookies.hello === "world"){ // check if there is a "hello" value in the cookie, and the value of the hello value is "world"
        return response.status(200).send(mockProducts) 
    } else
        return response.send("Sorry you need the correct cookie")
    }
)
// Get request to send an array of all products

export default router