const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userAuth = async (req, res, next) => {
  try {
    // Read the token from the req cookies
    const {token} =  req.cookies;
    if(!token) {
      throw new Error("Invalid Token !!!!");
    }

    // Validate the token

    const decodedObj = await jwt.verify(token, "DEV@TINDER$799");

     //find the user
    const { _id} = decodedObj;   

    const user = await User.findById(_id);

    if(!user) {
    throw new Error("User not found");
    }

    req.user = user; // Attach the user object to the request for further use in the route handler

    next(); // Call next() to pass control to the next route handler

    } catch (error) {
      res.status(400).send("Error: " + error.message);
    }
}

module.exports = { userAuth};