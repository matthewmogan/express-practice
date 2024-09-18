import express from "express";
import routes from "./routes/index.mjs"
import cookieParser from "cookie-parser"
import session from "express-session"
import { mockUsers } from "./utils/constants/constants.mjs";
import passport from "passport"
import "./strategies/local-strategy.mjs"

const app = express()

app.use(express.json()) // Automatically parses JSON data in the request body and makes it available on request.body
app.use(cookieParser("TravisPalmPWord")) // need to pass this in before we use the router. can pass a SECRET, e.g. "secretpassword"
app.use(session({secret: "LawrenceGilroyPWord", saveUninitialized: false, resave: false, cookie: { maxAge: 1000*60*30 } })) 

app.use(passport.initialize()) // call AFTER session and BEFORE app.use(ROUTES)
app.use(passport.session())
app.use(routes) // make app use routes in routers

app.post("/api/auth", passport.authenticate("local"),(request, response) => {
    response.sendStatus(200)
})

app.get("/api/auth/status", (request, response) => {
    console.log("Inside /auth/status endpoint")
    console.log(request.user)
    console.log(request.session)
    return request.user ? response.send(request.user) : response.sendStatus(401)
})

app.post ("/api/auth/logout", (request, response) => {
    if (!request.user) return response.sendStatus(400)
    request.logout((err) => {
        if (err) return response.sendStatus(400);
        response.sendStatus(200)
    });
});

const PORT = process.env.PORT || 4001 // process.env: An object in Node.js that contains the user environment variables. process.env.PORT: Retrieves the value of the PORT environment variable if it's set.

// ----- START SERVER LISTENING TO THE PORT ----- //

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})
// starts the app listening for HTTP requests on port 4001

app.get("/", (request, response) => {
    console.log("request session ID: " + request.session.id);
    request.session.visited = true // this is important. it stops the session ID from regenerating each time a new request is made
    response.cookie( // cookie options
        "hello",
        "world",
        {
            maxAge: 1000 * 60 * 30, // expire cookie after 30 minutes
            signed: true // encrypts the cookie, cookie must be given a SECRET in cookieParser
        }
    ) 
   // 60,000 miliseconds is a 60 second cookie that expires after 2 minutes
   response.status(201).send({msg: "cookie test"})
});


// AUTHENTICATION METHODS WITHOUT EXPRESS PASSPORT


// app.post("/api/auth",(request, response) => {
//     const { body: {username, password} } = request;
//     const findUser = mockUsers.find(user => user.username === username);
//     if (!findUser || findUser.password !== password) return response.status(401).send({msg: "bad credentials"})
//     request.session.user = findUser // attaches a new property (username) to the session
//     return response.status(200).send(findUser)
// })

// app.get("/api/auth/status",(request, response) => {
//     request.sessionStore.get(request.sessionID,(error,sessionStore) => console.log(sessionStore));
//     return request.session.user
//         ? response.status(200).send(request.session.user) 
//         : response.status(401).send({msg: "Not Authenticated"})
// })


// CART API METHODS


app.post('/api/cart', (request, response) => {
    if(!request.session.user) return response.status(401).send({msg: "User not logged in"}) 
    const { body: item } = request // pulls the body of the request and creates a const named Item from the body
    const {cart} = request.session // extracts the cart property from request.session, and creates sets it to undefined if it does not exist
    if (cart) {
        cart.push(item); // if cart does exist, we push item into the cart
    } else {
        request.session.cart = [item] // if cart does not exist, we instantiate cart, and set it equal to an array with items
    }
    return response.status(201).send(request.session.cart )
})

app.get('/api/cart', (request, response) => {
    if(!request.session.user) return response.status(401),send({msg: "User not logged in"})
    if(request.session.cart) return response.status(200).send(request.session.cart)
    return response.status(401).send({msg: "cart is empty"})
})