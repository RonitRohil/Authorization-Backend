require('dotenv').config();
const express = require("express");
const path = require("path");
const bcrypt = require("bcryptjs");
// const hbs = require("hbs");
const app = express();
const conn = require("./config/database");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const port = process.env.PORT || 8080;

const static_path = path.join(__dirname, "../ṭemplates");
const views_path = path.join(__dirname, "../templates/views")
// const partials_path = path.join(__dirname, "../templates/partials")

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}))

// console.log(static_path);

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", views_path);
// hbs.registerPartials(partials_path);
const Register = require("./models/register_user")


app.get("/", (req, res) => {
    res.render("index")
})

app.get("/login", (req, res) => {
    res.render("login")
})

app.get("/register", (req, res) => {
    res.render("register")
})

app.post("/register", async (req, res) =>{
    try {
        // console.log(req.body.firstname);
        // res.send(req.body.firstname);

        const registerUser = new Register({
            first_name: req.body.firstname,
            last_name: req.body.lastname,
            email: req.body.email,
            password: req.body.password,
            phonenumber: req.body.phonenumber
        });

        console.log("the success part" + registerUser);

        const token = await registerUser.generateAuthToken();
        console.log("The token part: " + token);

        res.cookie("jwt", token, {
            expires:new Date(Date.now() + 30000),
            httpOnly: true,
        });

        console.log(`This is the Cookie: ${req.cookies.jwt}`)

        // console.log(cookie);

        const registered_user = await registerUser.save();
        res.status(201).render("index");

    } catch (error) {
        res.status(400).send(error)
    }
})

app.post("/login", async (req, res) =>{
    try {
        // console.log(req.body.firstname);
        // res.send(req.body.firstname);

        const email = req.body.email;
        const password = req.body.password;

        const useremail = await Register.findOne({email:email});
        console.log(password);

        const isMatch = await bcrypt.compare(password, useremail.password);
        console.log(isMatch);

        const token = await useremail.generateAuthToken();
        console.log("The token part: " + token);

        res.cookie("jwt", token, {
            expires:new Date(Date.now() + 50000),
            httpOnly: true,
        });

        if(isMatch)
        {
            res.status(201).render("index");
        }

        else
        {
            res.send("Invalid Details");
        }

        // res.status(201).render("index");

    } catch (error) {
        res.status(400).send("Invalid Email or Password")
    }
})

app.listen(port, async(req,res)=>{
    await conn;
    console.log(`server is running at port no ${port}`)
})