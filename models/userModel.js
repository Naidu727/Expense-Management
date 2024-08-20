// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: [true, "Name is required"],
//     },
//     email: {
//         type: String,
//         required: [true, "Email is required and should be unique"],
//         unique: true,
//     },
//     password: {
//         type: String,
//         required: [true, "Password is required"],
//     },
// }, { timestamps: true });

// const userModel = mongoose.model("User", userSchema);
// module.exports = userModel;


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
