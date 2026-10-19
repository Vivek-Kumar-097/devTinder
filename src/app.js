const express = require("express"); //importing express module

const app = express(); //creating an instance of express

const connectDB = require("./config/database"); //importing database connection file

const User = require("./models/user"); //importing user model

app.use(express.json()); //middleware to parse incoming JSON requests

app.post("/signup", async (req, res) => {
  console.log(req.body);
  // Creating a new user instance of the User model and saving it to the database
  const user = new User(req.body);
 try {
   await user.save();
   res.send("User signed up successfully");
 } catch (error) {
   res.status(400).send("Error while signing up user: " + error.message);
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

