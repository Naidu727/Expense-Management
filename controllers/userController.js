const userModel = require("../models/userModel");
const bcrypt = require('bcryptjs');

const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).send("User Not Found");
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send("Invalid Credentials");
        }
        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error,
        });
    }
}

const registerController = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).send("User already exists");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new userModel({ name, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({
            success: true,
            newUser,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error,
        });
    }
}

module.exports = { loginController, registerController };
