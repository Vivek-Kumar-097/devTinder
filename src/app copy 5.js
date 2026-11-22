const express = require("express"); //importing express module

const app = express(); //creating an instance of express

const connectDB = require("./config/database"); //importing database connection file

const User = require("./models/user"); //importing user model

const { validateSignupData } = require("./utils/validation")

const bcrypt = require("bcrypt");

const cookieParser = require("cookie-parser");

 const jwt = require("jsonwebtoken")

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

    const isPasswordValid = await bcrypt.compare(password, user.password)
    
    if(isPasswordValid) {

      // Create a JWT Token
      const token = await jwt.sign({ _id : user._id}, "DEV@TINDER$799")
      console.log(token)

      // Add the  token to cookie and send the response back to the user
      res.cookie("token", token);

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

// GET user by email - get a user by emailId from the database
app.get("/user", async (req, res) => {
  const emailId = req.body.emailId; //getting emailId from request body
  try {
    const user = await User.findOne({ emailId: emailId }); //fetching user from the database by emailId
     if(!user) {
      return res.status(404).send("User not found");
    } else {
      res.send(user);
    }
    // const user = await User.find({ emailId: emailId }); //fetching user from the database by emailId
    // if(user.length === 0) {
    //   return res.status(404).send("User not found");
    // } else {
    //   res.send(user);
    // }
  } catch (error) {
    res.status(400).send("Error while fetching user: " + error.message);
  }
});

//feed api - GET /feed - get all the users from the database
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find(); //fetching all users from the database
    res.send(users);
  } catch (error) {
    res.status(400).send("Error while fetching users: " + error.message);
  }
});

// DELETE user by id - delete a user by id from the database
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send("User deleted successfully");
  } catch (error) {
    res.status(400).send("Error while deleting user: " + error.message);
  }
});

// update data of the user
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const updateData = req.body;

  try {

    const ALLOWED_UPDATES = ["age", "gender", "photoUrl", "about", "skills"];

  const isUpdateAllowed = Object.keys(updateData).every((key) =>
    ALLOWED_UPDATES.includes(key)
  );

  if (!isUpdateAllowed) {
    throw new Error("Invalid updates! Only age, gender, photoUrl, about and skills can be updated.");
  }

  if(updateData?.skills > 10) {
    throw new Error("Skills cannot be more than 10");
  }

    const user = await User.findByIdAndUpdate({ _id: userId }, updateData, {
      returnDocument: "before", //return the document before update 
      runValidators: true, //run validators on the update data
    });
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send("User updated successfully");
  } catch (error) {
    res.status(400).send("Error while updating user: " + error.message);
  }
});

connectDB().then(() => {
    console.log("Connected to DB successfully");
    app.listen(7777, () => { //starting the server on port 7777
      console.log("Server is running on port 7777");
    });
}).catch((err) => {
    console.log("Error while connecting to DB", err);
});
