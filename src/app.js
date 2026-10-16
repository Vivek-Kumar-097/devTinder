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

connectDB().then(() => {
    console.log("Connected to DB successfully");
    app.listen(7777, () => { //starting the server on port 7777
      console.log("Server is running on port 7777");
    });
}).catch((err) => {
    console.log("Error while connecting to DB", err);
});

