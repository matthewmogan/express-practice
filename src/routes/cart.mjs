import {Router} from "express"

const router = Router()

router.post('/api/cart', (request, response) => {
    if(!request.user) return response.status(401).send({msg: "User not logged in"}) 
    const { body: item } = request // pulls the body of the request and creates a const named Item from the body
    const {cart} = request.session // extracts the cart property from request.session, and creates sets it to undefined if it does not exist
    if (cart) {
        cart.push(item); // if cart does exist, we push item into the cart
    } else {
        request.session.cart = [item] // if cart does not exist, we instantiate cart, and set it equal to an array with items
    }
    return response.status(201).send(request.session.cart )
})

router.get('/api/cart', (request, response) => {
    if(!request.user) return response.status(401),send({msg: "User not logged in"})
    if(request.session.cart) return response.status(200).send(request.session.cart)
    return response.status(401).send({msg: "cart is empty"})
})

export default router