import express from "express";
// express is a top level finction, we need to call express to create the app

const app = express()
// This application object, commonly assigned to a variable like app, serves as the central component of your web application and provides a range of methods to handle HTTP requests, set up middleware, and configure settings.

const PORT = process.env.PORT || 4001;
// process.env: An object in Node.js that contains the user environment variables.
// process.env.PORT: Retrieves the value of the PORT environment variable if it's set.

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})