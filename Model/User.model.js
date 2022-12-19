
const mongoose = require("mongoose");


const authSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    img: { type: String, default: "" }
})

const AuthModel = mongoose.model("users", authSchema)

module.exports = AuthModel;