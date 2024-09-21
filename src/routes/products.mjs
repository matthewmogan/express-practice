import { Router} from "express"
import { validationResult, checkSchema, matchedData } from "express-validator"
import { productValidation } from "../utils/validationSchemas.mjs"
import { Product } from "../mongoose/schemas/product.mjs"

const router = Router()

// GET all products http://localhost:4001/api/products 

router.get("/api/products", async (request, response, next) => {
    const products = await Product.find(); // if no "usernameIncludes" parameter, then return all users in the User model
    return response.status(201).send(products)
})

// POST Create a product http://localhost:4001/api/products

router.post("/api/products", checkSchema(productValidation) , async (request, response, next) => {
    const result = validationResult(request) 
    if(!result.isEmpty()) return response.send(result.array()) 
    const data = matchedData(request)
    const newProduct = new Product(data)
    try {
        const savedProduct = await newProduct.save() 
        return response.status(201).send(savedProduct)
    } catch (err) {
        console.log(err)
        return response.sendStatus(400)
    }
})

export default router