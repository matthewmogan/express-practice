import passport from "passport" // the main Passport.js librarty
import { Strategy } from "passport-local" //  The local authentication strategy from passport-local. all the passport-x have strategy classes
import { User } from "../mongoose/schemas/user.mjs" // mongoose user model for database operations
import { comparePassword } from "../utils/encryption.mjs"

passport.serializeUser((user, done) => {
    // defines how info is stored in the session
    console.log("serializeUser called")
    done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
    // defines how to retrieve user information from the session
    console.log("deserializeUser called")
    try {
        const findUser = await User.findById(id);
        if (!findUser) throw new Error ("User Not Found");
        done(null, findUser)
    } catch (err) {
        done (err, null);
    } 
})

const localStrategy = new Strategy(async (username, password, done) =>{
    try {
        const findUser = await User.findOne({username}) // find the user in the connected database using the User model's findOne method 
        if(!findUser) throw new Error ("User not found") // error if no user found
        if(!comparePassword(password, findUser.password)) throw new Error("Bad Credentials") // if the passwords do not match throw an error
        done(null, findUser) // if they do match, call the done function with findUser as the parameter
    } catch (err){
        done(err, null)
    }
})

passport.use(localStrategy) // instruct the passport instance to use the local strategy

export default passport
