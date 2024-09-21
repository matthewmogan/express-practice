import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema ({
    globalbrand: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: false // must be unique in the MongoDB database for Username
    },    
    storename: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: false // must be unique in the MongoDB database for Username
    },    
    productname: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: false // must be unique in the MongoDB database for Username
    },
    price: {
        type: mongoose.Schema.Types.Number,
        requried: true,
        unique: false
    },
    ageRestricted: { 
        type: mongoose.Schema.Types.Boolean,
        required: true,
        unique: false,
    }
})

export const Product = mongoose.model("Products", ProductSchema) // use this schema to interact with your database and search for data
