import express from "express";
import routes from "./routes/index.mjs"
import cookieParser from "cookie-parser"
import session from "express-session"
// import passport from "passport"
import passport from "./strategies/local-strategy.mjs"
import mongoose from "mongoose"
import dotenv from "dotenv";
dotenv.config();

const app = express()

// --- CONNECT TO MONGODB SERVER --- //

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.caxxj.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
async function run() {
  try {
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.log(error)
  }
}
run().catch(console.dir);

// --- SET UP EXPRESS APP --- //

app.use(express.json()) // Parse JSON data on request body and make available on req.body
app.use(session({secret: process.env.SESSION_SECRET, saveUninitialized: false, resave: false, cookie: { maxAge: 1000*60*30 } })) // use sessions and set session expiration
app.use(cookieParser(process.env.COOKIE_SECRET)) // need to pass this in before we use the router. can pass a SECRET, e.g. "secretpassword"

app.use(passport.initialize()) // call AFTER session and BEFORE app.use(ROUTES)
app.use(passport.session())

app.use(routes) // make app use routes in routers

// --- AUTHENTICATION ROUTES --- //

const PORT = process.env.PORT || 4001 // process.env: An object in Node.js that contains the user environment variables. process.env.PORT: Retrieves the value of the PORT environment variable if it's set.
app.listen(PORT, () => { console.log(`Server listening on port ${PORT}`) })
// starts the app listening for HTTP requests on port 4001

