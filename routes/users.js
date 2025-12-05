const express = require('express');
const router = express.Router();
const usersDetails = require("../usersDetails.json");
const fs = require("fs");
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const authenticateJWT = require("./middlewares/authenticateJWT");

router.post('/userSignup', async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password,10);
    const newUser = {
        id: uuidv4(),
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    };
    usersDetails.push(newUser);
    fs.writeFile('./usersDetails.json', JSON.stringify(usersDetails), (err) => {
        return res.status(201).send({
            message: "User Signup Successfully",
            data: { id: newUser.id, name: newUser.name, email: newUser.email } 
        });
    });
});

router.post('/userLogin', async (req, res) => {
    const { email, password } = req.body;
    const user = usersDetails.find(u => u.email === email);
    if (!user) {
        return res.status(401).send({ message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).send({ message: "Invalid password" });
    }
    const token = jwt.sign(
        {id: user.id, email: user.email},
        process.env.JWT_SECRET,
        { expiresIn: '1h' } 
    );
    return res.status(200).send({ 
        message: "Login successful", token
    });
});

router.get('/profile', authenticateJWT, (req, res) => {
    res.send({ message: `Hello ${req.user.email}, you can access this protected route!` });
});

module.exports = router;
