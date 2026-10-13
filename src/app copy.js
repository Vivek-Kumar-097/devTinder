//starting point of the application
// creating a server using express framework

const express = require("express"); //importing express module

const app = express(); //creating an instance of express

// app.get(["/ac", "/abc"], (req, res) => {
//   res.send({
//     firstName: "Vivek",
//     lastName: "Kumar"
//   });
// });

// app.get("/ab+c", (req, res) => {
//   res.send({
//     firstName: "Vivek",
//     lastName: "Kumar"
//   });
// });

// app.get(/^\/ab+c$/, (req, res) => {
//   res.send("Hello abbbbbc from regex");
// });

// app.get("/ab*cd", (req, res) => {
//   res.send("Hello");
// });

// this will only handle GET call to /user
app.get("/user/:id", (req,res) => {
  console.log("Incoming request: ", req.params);
  res.send({firstName : "Vivek", lastName: "Kumar"})
})

app.post("/user", (req,res) => {
  //saving data to DB
  res.send("Data saved successfully")
})

app.delete("/user", (req,res) => {
  //saving data to DB
  res.send("Data deleted successfully")
})

//this will match all the http methodapi calls to /hello
app.use("/hello", (req, res) => {
    console.log("Incoming request: ", req.method, req.url); //logging incoming requests
    res.send("Hello hello hellokl!"); //sending response to the client
 }); //middleware to handle incoming requests


// app.use("/",(req, res) => {
//     console.log("Incoming request: ", req.method, req.url); //logging incoming requests
//     res.send("Namaste from dashbord"); //sending response to the client
//  }); //middleware to handle incoming requests



app.use("/test", (req, res) => {
    console.log("Incoming request: ", req.method, req.url); //logging incoming requests
    res.send("Hello from the server!"); //sending response to the client
 }); //middleware to handle incoming requests

app.listen(7777, () => { //starting the server on port 7777
  console.log("Server is running on port 7777");
});