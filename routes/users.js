const express = require('express');
const router = express.Router();
const usersDetails = require("../usersDetails.json");
const fs = require("fs");
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

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
    return res.status(200).send({ 
        message: "Login successful"
     });
});

router.put("/update/:id", async (req, res) => {
    const id = req.params.id;
    const { password } = req.body;
    const userIndex = usersDetails.findIndex(user => user.id === id);

    if (userIndex === -1) {
        return res.status(404).send({ message: "User not found" });
    }

    if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        usersDetails[userIndex].password = hashedPassword;
    }

    fs.writeFile('./usersDetails.json', JSON.stringify(usersDetails), (err) => {
        return res.status(200).send({
            message: "User updated successfully",
        });
    });
});

router.route("/userSignup/:id")
.delete((req, res) => {
    const id = req.params.id;
    const userIndex = usersDetails.findIndex((user) => user.id === id);
    if (userIndex === -1) {
        return res.status(404).send("id not found")
    }
    const deletedUser = usersDetails.splice(userIndex, 1);
    fs.writeFile('./usersDetails.json', JSON.stringify(usersDetails), (err) => {
        return res.status(200).send(`delete successfully data`);
    })
})

module.exports = router;
