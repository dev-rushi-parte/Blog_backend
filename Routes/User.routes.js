const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const AuthRouter = require("express").Router();
require('dotenv').config()


const userModel = require("../Model/User.model");


AuthRouter.post("/signup", async (req, res) => {
    const { email, password, name } = req.body;
    console.log(email)
    const checkUserEmail = await userModel.findOne({ email });

    if (checkUserEmail) {

        res.status(403).send({ "message": "User already exists" })
    }

    else {
        bcrypt.hash(password, 6, async (err, hash) => {
            if (err) {
                res.status(503).send({ "message": "please try again" })
            }
            const user = new userModel({
                name,
                email,
                password: hash
            })

            await user.save();
            res.status(201).send("Singup is successfull")
        })
    }
})

AuthRouter.post("/signin", async (req, res) => {

    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    console.log(user)
    if (user == null) {
        return res.status(401).send({ "message": "Invalid user Credentials " })

    }

    const hash = user.password;
    const userId = user._id;
    // console.log(userId)
    bcrypt.compare(password, hash, (err, result) => {
        if (result) {
            var token = jwt.sign({ email, userId }, process.env.SECRETKEY);
            return res.status(201).send({ "message": "login successfull", "token": token, user })
        }
        else {
            return res.status(401).send({ "message": "Invalid user Credentials " })
        }
    })

})



module.exports = AuthRouter;
