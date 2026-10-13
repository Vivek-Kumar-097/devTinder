const express = require("express"); //importing express module

const app = express(); //creating an instance of express

const {adminAuth, userAuth} = require("./middlewares/auth"); //importing adminAuth middleware

//Handle Auth Middleware for all type of requests GET, POST, PUT, DELETE, PATCH
app.use("/admin", adminAuth);

app.get("/user",userAuth, (req, res) => {
  res.send("User Route");
})

app.get("/admin/getAllData", (req, res) => {
  res.send("All Data from Admin");
});

app.get("/admin/deleteUser", (req, res) => {
  res.send("User Deleted from Admin");
});

app.listen(7777, () => { //starting the server on port 7777
  console.log("Server is running on port 7777");
});