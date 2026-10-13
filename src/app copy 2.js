const express = require("express"); //importing express module

const app = express(); //creating an instance of express

app.use("/user", (req, res, next) => {
  // Route handler for /user path
  // res.send("Route Handler 1");
  console.log("Handling request for /user path 1");
  // res.send("Route Handler 1");
  next(); // Call next() to pass control to the next route handler
}, (req, res, next) => {
   console.log("Handling request for /user path 2");
   res.send("Route Handler 2");
}); 

app.listen(7777, (req, res) => { //starting the server on port 7777
  console.log("Server is running on port 7777");
});