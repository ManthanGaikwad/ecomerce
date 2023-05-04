import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js';

//Protected Routes token base
export const isAuth = async (req, res, next) => {
    try {
      const decode = jwt.verify(
        req.headers.authorization,
        process.env.JWT_SECRET
      );
      req.user = decode;
      next();
    } catch (error) {
        res.status(401).json({ authorization: "Token expired" })
    }
  };
  

  //admin access
export const isAdmin = async (req, res, next) => {
    try {
        console.log(req.user._id)
      const user = await userModel.findById(req.user._id);
      if (user.role !== 1) {
        return res.status(401).send({
            authorization: "UnAuthorized Access",
        });
      } else {
        next();
      }
    } catch (error) {
     // console.log(error);
      res.status(401).send({
        message: "You are not admin",
      });
    }
  };
