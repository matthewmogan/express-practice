import express from "express";
import routes from "./routes/index.mjs"
import cookieParser from "cookie-parser"
import session from "express-session"
import passport from "passport"
import "./strategies/local-strategy.mjs"
import mongoose from "mongoose"
import dotenv from "dotenv";
dotenv.config();

const app = express()

// --- CONNECT TO MONGODB SERVER --- //

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.caxxj.mongodb.net/?retryWrites=true&w=majority&appName=${process.env.DB_NAME}`;
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
async function run() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await mongoose.disconnect();
  }
}
run().catch(console.dir);

// --- SET UP EXPRESS APP --- //

app.use(express.json()) // Automatically parses JSON data in the request body and makes it available on request.body
app.use(cookieParser("TravisPalmPWord")) // need to pass this in before we use the router. can pass a SECRET, e.g. "secretpassword"
app.use(session({secret: "LawrenceGilroyPWord", saveUninitialized: false, resave: false, cookie: { maxAge: 1000*60*30 } })) // use sessions and set session expiration
app.use(passport.initialize()) // call AFTER session and BEFORE app.use(ROUTES)
app.use(passport.session())
app.use(routes) // make app use routes in routers

// --- AUTH ROUTES --- //

app.post("/api/auth", passport.authenticate("local"),(request, response) => {
    response.sendStatus(200)
})

app.get("/api/auth/status", (request, response) => {
    console.log(" ")
    console.log("Inside /auth/status endpoint:")
    console.log(" ")
    console.log("request.user:")
    console.log(request.user)
    console.log(" ")
    console.log("request.session:")
    console.log(request.session)
    console.log(" ")
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
app.listen(PORT, () => { console.log(`Server listening on port ${PORT}`) })
// starts the app listening for HTTP requests on port 4001

// app.get("/", (request, response) => {
//     console.log("request session ID: " + request.session.id);
//     request.session.visited = true // this is important. it stops the session ID from regenerating each time a new request is made
//     response.cookie( // cookie options
//         "hello",
//         "world",
//         {
//             maxAge: 1000 * 60 * 30, // expire cookie after 30 minutes
//             signed: true // encrypts the cookie, cookie must be given a SECRET in cookieParser
//         }
//     ) 
//    // 60,000 miliseconds is a 60 second cookie that expires after 2 minutes
//    response.status(201).send({msg: "cookie test"})
// });
