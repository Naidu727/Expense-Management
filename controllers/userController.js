// const userModel = require("../models/userModel");

// const loginController  = async(req,res)=>{
//     try{
//         const {email,password} = req.body;
//         const user = await userModel.findOne({email,password});
//         if(!user)
//         {
//             return res.status(404).send("User Not Found");
//         }
//         res.status(200).json({
//             success:true,
//             user,
//         });
//     }catch(error){
//         res.status(400).json({
//             success :false,
//             error,
//         })
//     }
// }

// const registerController = async(req,res)=>{
//     try{
//         const newUser = new userModel(req.body);
//         await newUser.save();
//         res.status(201).json({
//             success :true,
//             newUser,
//         });
//     }
//     catch(error){
//         res.status(400).json({
//             success:false,
//             error,
//         });
//     }
// }

// module.exports = {loginController,registerController};


const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
        },
        email: {
            type: String,
            required: [true, "Email is required and should be unique"],
            unique: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
    },
    { timestamps: true }
);

// Pre-save hook to hash the password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;
