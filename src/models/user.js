const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 50,
    },
    lastName: {
        type: String,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        min: 18,
        max: 120
    },
    gender: {
        type: String,
        validate(value) { // only run when new document is created 
            if(!["male", "female", "other"].includes(value)) {
                throw new Error("Invalid gender");
            }
        }
    },
    photoUrl: {
        type: String,
        default: "https://www.shutterstock.com/image-vector/isolated-object-avatar-dummy-symbol-260nw-1290296656.jpg",
    },
    about: {
        type: String,
        default: "No information provided",
    },
    skills: {
        type: [String],
    },
}, {
    timestamps: true, // add createdAt and updatedAt fields
});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;