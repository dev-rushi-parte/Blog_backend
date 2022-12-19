// Import external
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");


// file import
const userAuthentication = require("./Middleware/Auth.middleware")
const AuthRouter = require("./Routes/User.routes")
const BlogRoutes = require("./Routes/Blog.routes")


require('dotenv').config()
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (res, res) => {
    res.setEncoding("welcome to home page")
})

app.use("/user", AuthRouter)

// login user authentication middleware
app.use(userAuthentication)


app.use("/blog", BlogRoutes)




const connectionParams = {
    useUnifiedTopology: true,
    useNewUrlParser: true

}

const url = process.env.MNOGOURL

mongoose.connect(url, connectionParams)
    .then(() => {
        console.log('connected to db')
    })
    .catch((err) => {
        console.log('err connection to db ', err)
    })



app.listen(process.env.PORT || 5000, () => {
    console.log("db connect")
})