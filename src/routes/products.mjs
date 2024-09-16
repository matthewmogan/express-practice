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
    return response.status(200).send(mockProducts)
})
// Get request to send an array of all products

export default router