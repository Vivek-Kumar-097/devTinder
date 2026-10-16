const express = require("express"); //importing express module

const app = express(); //creating an instance of express

app.get("/getUserData", (req, res) => {
 //Logic of DB call and get user data

 try{
   throw new Error("Database Connection Failed");
   res.send("User Data Sent");

 } catch(err){
   res.status(500).send("Something Error contact support team!");
 }
})

app.use("/", (err, req, res, next) => {
  if(err) {
    // log your error here
    res.status(500).send("Something went wrong!");
  }
});

app.listen(7777, () => { //starting the server on port 7777
  console.log("Server is running on port 7777");
});