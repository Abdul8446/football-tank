const User = require('../Models/UserModel')

const jwt = require("jsonwebtoken")


module.exports.checkUser = async (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
      jwt.verify(token, "basithsupersecretkey", async (err, decodedToken) => {
        if (err) {
          res.json({ status: false });
        } else {
          const user = await User.findById(decodedToken.id);
          if (user) {
            req.user = user; // assign user to req.user
          }
        }
        next();
      });
    } else {
      next();
    }
  };

module.exports.checkAdmin=(req,res,next)=>{

  // const token = req.headers.Authorization;
  const token = req.headers.authorization.split(' ')[1];
  try {
    if (token) {
      jwt.verify(token, "basithadminsupersecretkey", async (err, decodedToken) => {
        if (err) {
          next()
        } else {
          req.user=req.headers['x-user-data']
        }        
        next();
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error)
  }
}  
  
  

