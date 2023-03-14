const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User");
const brypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

const salt = brypt.genSaltSync(10);
const secret = "nckasnfor32esfse35w";

app.use(cors());
app.use(express.json());

mongoose.connect(
    "mongodb+srv://blog-admin:dlNAf8b6TfZ8DjB6@cluster0.q9fs7ze.mongodb.net/?retryWrites=true&w=majority",
);

app.post("/register", async (req, res) => {
    const { username, password } = req.body;
    try {
        const userDoc = await User.create({
            username,
            password: brypt.hashSync(password, salt),
        });
        res.json(userDoc);
    } catch (e) {
        res.status(400).json(e);
    }
});

app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const userDoc = await User.findOne({ username });
    const passwordCheck = brypt.compareSync(password, userDoc.password);
    if (passwordCheck) {
        // logged in
        jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
            if (err) throw err;
            res.cookie("token", token).json("ok");
        });
    } else {
        res.status(400).json("wrong credentials");
    }
});

app.listen(4000);
// dlNAf8b6TfZ8DjB6
// mongodb+srv://blog-admin:dlNAf8b6TfZ8DjB6@cluster0.q9fs7ze.mongodb.net/?retryWrites=true&w=majority
