import passport from "passport"
import {Strategy as DiscordStategy} from "passport-discord"
import {DiscordUser} from "../mongoose/schemas/discord-user.mjs"
import dotenv from "dotenv";
dotenv.config()

passport.serializeUser((user, done) => {
    // defines how info is stored in the session
    console.log("serializeUser called")
    console.log("user object:")
    console.log(user)
    console.log("user.id:")
    console.log(user.id)
    done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
    // defines how to retrieve user information from the session
    console.log("deserializeUser called")
    try {
        const findUser = await DiscordUser.findById(id);
        if (!findUser) throw new Error ("User Not Found");
        done(null, findUser)
    } catch (err) {
        done (err, null);
    } 
})

const discordStrategy = new DiscordStategy (
    { 
        // strategy takes an options object, which contains the client ID and client secret from the Discord Developer Portal - Applications - oAuth2
        clientID: process.env.DISCORD_CLIENT_ID,
        clientSecret: process.env.DISCORD_CLIENT_SECRET,
        callbackURL: process.env.DISCORD_CALLBACK_URL, // aka the redirect URL, which is specified on the Discord Dev Portal
        scope: ["identify", "email"] // Identify allows us to access /users/@me without email, email allows us to log in with the email
    }, 
    async (accessToken, refreshToken, profile, done) => {
        // calls this "Verify function" after passport.authenticate is called
        // Passport takes care of accessToken and refreshToken for us. refreshToken gets new access tokens. 
        console.log("Discord profile received:", profile);
        let findUser;
        try { 
            findUser = await DiscordUser.findOne({discordId: profile.id})
            console.log("User found:", findUser);
        } catch (err) {
            console.error("Error finding user:", err);
            return done(err,null); // error, no user
        }
        try {
            if (!findUser) {
                console.log("Creating new user...");
                    const newUser = new DiscordUser({
                        username: profile.username, 
                        discordId: profile.id,
                        email: profile.email || "No Email Provided"
                    })
                const newSavedUser = await newUser.save()
                console.log("New user created:", newSavedUser);
                return done(null, newSavedUser) // Serializes user into the session data, via callback function passport.serializeUser. Passes newSavedUser to the callback function
            } 
            console.log("User exists:", findUser);
            return done(null, findUser) // no error, user found
        } catch (err) {
            console.error("Error creating user:", err)
            return done(err, null) // error, no user
        }    
    }
)

passport.use("discord", discordStrategy) // instruct the passport instance to use the local strategy

export default passport