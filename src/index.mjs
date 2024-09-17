import express from "express";
import routes from "./routes/index.mjs"
import cookieParser from "cookie-parser"
import session from "express-session"
import { mockUsers } from "./utils/constants/constants.mjs";

const app = express()

app.use(express.json()) // Automatic Parsing: Automatically parses JSON data in the request body and makes it available on request.body.
app.use(cookieParser("secretpassword")) // need to pass this in before we use the router. can pass a SECRET, e.g. "secretpassword"
app.use(session({
  secret: "LawrenceGilroyEndeavours",
  saveUninitialized: false,
  resave: false, 
  cookie: {
    maxAge: 1000*60*30 // stay signed in for 20 seconds (1000 ms * 20)
  } 
})) 
app.use(routes) // code to make the app use both the index router, which includes the User router and Products router

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

app.post("/api/auth",(request, response) => {
    const { body: {userName, password} } = request;
    const findUser = mockUsers.find(user => user.userName === userName);
    if (!findUser || findUser.password !== password) return response.status(401).send({msg: "bad credentials"})
    request.session.user = findUser // attaches a new property (username) to the session
    return response.status(200).send(findUser)
})

app.get("/api/auth/status",(request, response) => {
    request.sessionStore.get(request.sessionID,(error,sessionStore) => console.log(sessionStore));
    return request.session.user
        ? response.status(200).send(request.session.user) 
        : response.status(401).send({msg: "Not Authenticated"})
})

app.post('/api/cart', (request, response) => {
    if(!request.session.user) return response.status(401),send({msg: "User not logged in"}) 
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