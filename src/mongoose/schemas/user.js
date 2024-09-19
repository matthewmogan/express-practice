import mongoose from "mongoose";

const UserSchema = new mongoose.Schema ({
    username: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true
    },
    displayName: {
        type: mongoose.Schema.Types.String,
        requried: true,
        unique: false
    },
    password: { 
        type: mongoose.Schema.Types.String,
        required: true,
        unique: false
    }
})

export const User = mongoose.model("User", UserSchema) // use this schema to interact with your database and search for data