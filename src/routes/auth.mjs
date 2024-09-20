import { Router } from "express"
import passport from "../strategies/local-strategy.mjs"

const authRouter = new Router

authRouter.post("/api/auth", passport.authenticate("local"),(request, response) => {
    // passport.authenticate("local") checks the request body for a username and password, typically req.body.username and req.body.password. verification is set up in local-strategy.mjs
    // ON SUCCESS - passport attaches authenticated user object to request.user, then we send back status 200. Since we have express-session configured, 
    // ON FAILURE - passport sends back 401, and does not call next()m, such that response.sendStatus(200) is not executed
    response.sendStatus(200)
})

authRouter.get("/api/auth/status", (request, response) => {
    return request.user ? response.send(request.user) : response.sendStatus(401)
})

authRouter.post ("/api/auth/logout", (request, response) => {
    if (!request.user) return response.sendStatus(400)
    request.logout((err) => {
        if (err) return response.sendStatus(400);
        response.sendStatus(200)
    });
});

export default authRouter