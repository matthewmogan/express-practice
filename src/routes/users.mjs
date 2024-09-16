import {Router} from "express"
import {
    query, 
    validationResult, 
    checkSchema, 
    matchedData
} from "express-validator"
import { mockUsers } from "../utils/constants/constants.mjs"
import { createUserValidationSchema } from "../utils/validationSchemas.mjs"

const router = Router()

// GET - request.QUERY EXAMPLE //

router.get(
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

export default router