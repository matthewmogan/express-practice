import mongoose from "mongoose";

const DiscordUserSchema = new mongoose.Schema ({
    username: {
        type: String,
        required: true,
        unique: true // must be unique in the MongoDB database for Username
    },
    email: {
        type: String,
        required: false,
        unique: true
    },
    discordId: { 
        type: String,
        required: true,
        unique: true,
    }
})

export const DiscordUser = mongoose.model("DiscordUser", DiscordUserSchema) // use this schema to interact with your database and search for data