import { Router } from "express"
// --- Disabling local strategy to allow discord oAuth2 login strategy
// import passport from "../strategies/local-strategy.mjs"
// ---
import passport from "../strategies/discord-strategy.mjs"

const authRouter = new Router

// Get the user authentication status

authRouter.get("/api/auth/status", (request, response) => {
    console.log("request.user:")
    console.log(request.user) 
    return request.user ? response.send(request.user) : response.sendStatus(401)
})

// Logout the user authentication status

authRouter.post ("/api/auth/logout", (request, response) => {
    if (!request.user) return response.sendStatus(400)
        request.logout((err) => {
    if (err) return response.sendStatus(400);
    response.sendStatus(200)
});
});

// Local strategy authentication - currently disabeld

authRouter.post("/api/auth/local", passport.authenticate("local"),(request, response) => {
    // passport.authenticate("local") checks the request body for a username and password, typically req.body.username and req.body.password. verification is set up in local-strategy.mjs
    // ON SUCCESS - passport attaches authenticated user object to request.user, then we send back status 200. Since we have express-session configured, 
    // ON FAILURE - passport sends back 401, and does not call next()m, such that response.sendStatus(200) is not executed
    response.sendStatus(200)
})

// Discord strategy authentication - currently enabled

// Authenticate the user via oAuth2 - Discord
// http://localhost:4001/api/auth/discord - 

authRouter.get("/api/auth/discord", passport.authenticate("discord"))

authRouter.get("/api/auth/discord/redirect", passport.authenticate("discord"),(request, response) => {
    console.log("Redirecting to app")
    console.log("request.user:")
    console.log(request.user)
    console.log("request.session:")
    console.log(request.session)
    response.sendStatus(200)
})

export default authRouter