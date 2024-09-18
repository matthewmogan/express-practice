import passport from "passport"
import { Strategy } from "passport-local" // all the passport-x have strategy classes
import { mockUsers } from "../utils/constants/constants.mjs"

passport.serializeUser((user, done) => {
    console.log("Inside Serialize User (USER):")
    console.log(user)
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    console.log("Inside Deserialize User (ID):")
    console.log(id)
    try {
        const findUser = mockUsers.find((user)=> user.id === id)
        if (!findUser) throw new Error ("User Not Found");
        done(null, findUser)
    } catch (err) {
        done (err, null);
    }
})

export default passport.use(
    new Strategy((username, password, done) =>{
        console.log(`Username: ${username}`)
        console.log(`Password: ${password}`)
    try {
        const findUser = mockUsers.find((user)=> user.username === username)
        if(!findUser) throw new Error("User not found")
        if(findUser.password !== password) throw new Error ("Inalid password")
        done(null, findUser)
    } catch (err){
        done(err, null)
    }
    })
)
