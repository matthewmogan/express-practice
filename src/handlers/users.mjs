import { User } from "../mongoose/schemas/user.mjs";

export const getUserByUsername = async (request,response) => {
        const {username} = request
        const user = await User.findOne({username: username})
        if (!user) return response.status(404).send("Could not find user with submitted username")
        response.status(200).send(user)
};