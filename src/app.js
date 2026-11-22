const express = require("express"); //importing express module

const app = express(); //creating an instance of express

const connectDB = require("./config/database"); //importing database connection file

const User = require("./models/user"); //importing user model

const { validateSignupData } = require("./utils/validation")

const bcrypt = require("bcrypt");

const cookieParser = require("cookie-parser");

 const { userAuth } = require("./middlewares/auth"); //importing userAuth middleware

app.use(express.json()); //middleware to parse incoming JSON requests
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  console.log(req.body);
 try {

   //validation of data
  validateSignupData(req);

  const {firstName, lastName, emailId,password} = req.body;
  // Encrypt the password
  const passwordHash = await bcrypt.hash(password, 10)
  console.log(passwordHash)
   
  // Creating a new user instance of the User model and saving it to the database
  const user = new User({
    firstName, lastName, emailId, password: passwordHash
  });

   await user.save();
   res.send("User signed up successfully");
 } catch (error) {
   res.status(400).send("Error while signing up user: " + error.message);
 }
})

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({emailId:emailId});
    if(!user) {
      throw new Error("Invalid crendentials");
    }

    // const isPasswordValid = await bcrypt.compare(password, user.password)
    const isPasswordValid = await user.validatePassword(password);
    
    if(isPasswordValid) {

      // Create a JWT Token
      // const token = await jwt.sign({ _id : user._id}, "DEV@TINDER$799", {expiresIn: "1d"});
      // console.log(token)

      const token = await user.getJWT(); // Call the getJWT method on the user instance to generate the token

      // Add the  token to cookie and send the response back to the user
      res.cookie("token", token, { expires: new Date(Date.now() + 86400000)}); // Set cookie to expire in 1 day

      res.send("Login Successfully");
    } else {
      throw new Error("Invalid crendentials");
    }
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
})

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user; // Access the user object attached by the userAuth middleware
    res.send(user); 
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
})

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user; // Access the user object attached by the userAuth middleware
  //Sending connection request to another user
  console.log("Sending connection request to another user");

  res.send(user.firstName + "Connection request sent successfully");
})

connectDB().then(() => {
    console.log("Connected to DB successfully");
    app.listen(7777, () => { //starting the server on port 7777
      console.log("Server is running on port 7777");
    });
}).catch((err) => {
    console.log("Error while connecting to DB", err);
});
