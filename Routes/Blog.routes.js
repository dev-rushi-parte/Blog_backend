const BlogRoutes = require("express").Router();

const BlogModel = require("../Model/Blog.model")
const userModel = require("../Model/User.model");


// API for creating the Blog

BlogRoutes.post("/", async (req, res) => {

    const { title, content, img, userId } = req.body;

    const new_blog = new BlogModel({

        title,
        content,
        img,
        userId
    })
    await new_blog.save()
    res.status(201).send({ "message": "Blog created" })
})

// API for getting all Blog

BlogRoutes.get("/all", async (req, res) => {


    const Blogs = await BlogModel.find().populate("userId").sort({ createdAt: -1 });

    res.status(200).send(Blogs)
})


// API for getting user Blogs only

BlogRoutes.get("/", async (req, res) => {

    const { userId } = req.body


    const userBlog = await BlogModel.find({ userId }).populate("userId").sort({ createdAt: -1 });

    res.status(200).send({ userBlog })
})


// API for deleting the Blog  only user can delete there blog

BlogRoutes.delete("/:blogId", async (req, res) => {

    const { blogId } = req.params;
    const { userId } = req.body;
    const blog = await BlogModel.findOne({ _id: blogId });

    if (blog.userId.valueOf() === userId) {
        await BlogModel.findOneAndDelete({ _id: blogId })
        return res.status(200).send({ "message": "successfull deletes" })

    }
    else {
        return res.status(401).send("youare not authrised to delete the blog")
    }
})


// API for edit the blog only user can edit there blog

BlogRoutes.put("/:blogId", async (req, res) => {

    const { blogId } = req.params;
    const { userId } = req.body;
    const blog = await BlogModel.findOne({ _id: blogId })
    console.log(blog)
    // console.log(blog.userId.valueOf())
    if (blog !== null) {
        if (blog.userId.valueOf() === userId) {

            const new_blog = await BlogModel.findOneAndUpdate({ _id: blogId }, req.body, { new: true })
            return res.status(200).send({ "message": "successfully updated", new_blog })
        }
        else {
            return res.status(401).send("you are not authorised to do it")
        }
    }
    else {
        res.status(404).send("blog not found")
    }
})

//  API for getting signIn User

BlogRoutes.get("/user", async (req, res) => {

    try {
        const user = await userModel.findOne({ _id: req.body.userId }).select('-password')

        res.status(200).send(user)
    }
    catch (err) {
        res.status(500).send(err)
    }
})

//  API for Update user info

BlogRoutes.put("/user/:id", async (req, res) => {
    const { userId } = req.body;
    const { id } = req.params;

    if (userId === id) {
        try {

            const user = await userModel.findByIdAndUpdate(id, { $set: req.body });
            res.status(201).send({ "message": "Account has been updated", user });
        }
        catch (err) {
            res.status(500).send(err);
        }
    }
    else {
        res.status(401).send("You can update only your Account!")

    }
})


module.exports = BlogRoutes;