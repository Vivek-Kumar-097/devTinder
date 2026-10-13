const adminAuth = (req, res, next) => {
// Logic of checking if the request is authorised
console.log("Admin Auth Middleware Invoked");
  const token = "xyz";
  const isAdminAuthorized = token === "xyz"; // Replace with your actual authorization logic

  if(!isAdminAuthorized) {
    return res.status(401).send("Unauthorized Access");
  } else{
    next(); // Call next() to pass control to the next route handler  
  }
}

const userAuth = (req, res, next) => {
// Logic of checking if the request is authorised
console.log("User Auth Middleware Invoked");
  const token = "xyz";
  const isUserAuthorized = token === "xyz"; // Replace with your actual authorization logic

  if(!isUserAuthorized) {
    return res.status(401).send("Unauthorized Access");
  } else{
    next(); // Call next() to pass control to the next route handler  
  }
}

module.exports = {adminAuth, userAuth};