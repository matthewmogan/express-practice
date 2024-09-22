import { Router } from "express"
import { Product } from "../mongoose/schemas/product.mjs"
import mongoose from "mongoose"
const router = Router()

// POST - add an item to the cart, or create the cart if cart doesn't exist. The cart does not exist in the MONGO database, but instead lives in the session. It is destroyed if the session closes (we need session store to fix this)

router.post('/api/cart', async (request, response) => {
    try {
        if(!request.user) return response.status(401).send({msg: "User not logged in"}) // check user logged in to the session
        const itemID = request.body.itemID // pulls the body of the request and creates a const named ItemID from the body
        const {cart} = request.session // extracts the cart property from request.session, and sets it to undefined if it does not exist - this allows us to create the cart if it doesn't exist
        // const products = await Product.find()
        // console.log(products)
        const item = await Product.findById(itemID).exec()
        console.log("HELLLOIOOOOO")
        console.log(item)
        if (cart) {
            cart.push(item); // if cart does exist, we push item into the cart
        } else {
            request.session.cart = [item] // if cart does not exist, we instantiate cart, and set it equal to an array with items
        }
        return response.status(201).send(request.session.cart)
    } catch(error) {
        console.log(error)
    }
})

// GET - returns the entire cart

router.get('/api/cart', (request, response) => {
    if(!request.user) return response.status(401).send({msg: "User not logged in"})
    if(request.session.cart) return response.status(200).send(request.session.cart)
    return response.status(401).send({msg: "cart is empty"})
})

// DELETE an item from the cart 

router.delete("/api/cart", async (request, response) => {
    const {cart} = request.session
    if (!cart) return response.status(401).send({msg: "Cart doesn't exist"})
    cart.ie
    // index of, delete item from cart, add error handling if cart doesn't exist, or item doesn't exist
})

export default router