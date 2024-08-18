const jwt = require("jsonwebtoken");

function isAuthenticated(req, res, next) {
 const token = req.headers.authorization?.split(" ")[1];

 if(!token){
  return res.status(401).json({message: "権限がありません"});
 }

 try {
const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.userId = decoded.id;
      // console.log("Decoded USER ID: ",decoded.id);
      
      next();
    } catch(error){
      console.error("Token verification failed:", error.message);

      return res.status(401).json({message: "無効なトークンです"})
    }
};


module.exports = isAuthenticated;