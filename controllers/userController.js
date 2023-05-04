import userModel from "../models/userModel.js";
import {comparePassword,hashPassword} from '../helpers/passwordHash.js';
import jwt from 'jsonwebtoken'
import orderModel from '../models/orderModel.js'

export const register = async (req, res) => {
    try {
      const { name, email, password, mobile, address,  } = req.body;
      //validations
      if (!name) {
        return res.send({ error: "Name is Required" });
      }
      if (!email) {
        return res.send({ error: "Email is Required" });
      }
      if (!password) {
        return res.send({ error: "Password is Required" });
      }
      if (!mobile) {
        return res.send({ error: "Phone no is Required" });
      }
      if (!address) {
        return res.send({ error: "Address is Required" });
      }
     
      //check user
      const existingUser = await userModel.findOne({ email });
      //existing user
      if (existingUser) {
        return res.status(200).send({
          error: "Already Register please login",
        });
      }
      //register user
      const hashedPassword = await hashPassword(password);
      //save
      const user = await new userModel({
        name,
        email,
        mobile,
        address,
        password: hashedPassword,
      }).save();
  
      res.status(201).send({
        success: "User Register Successfully",
        user,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        error: "Error in Registration",
        error,
      });
    }
  };


  //POST LOGIN
export const login = async (req, res) => {
    try {
      const { email, password } = req.body;
      //validation
      if (!email || !password) {
        return res.send({
          error: "Invalid email or password",
        });
      }
      //check user
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.send({
          error: "Email is not registered",
        });
      }
      const match = await comparePassword(password, user.password);
      if (!match) {
        return res.send({
          
          error: "Invalid Password",
        });
      }
      //token
      const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(200).send({
        success: "login successfully",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          address: user.address,
          role: user.role,
        },
        token,
      });
    } catch (error) {
      console.log(error);
      res.send({
        message: "Error in login",
        error,
      });
    }
  };


  //forgotPassword

export const forgotPassword = async (req, res) => {
  try {
    const { email,  newPassword } = req.body;
    if (!email) {
     return res.status(400).send({ message: "Email is required" });
    }
    if (!newPassword) {
      return res.status(400).send({ message: "New Password is required" });
    }
    //check
    const user = await userModel.findOne({ email });
    //validation
    if (!user) {
      return res.status(404).send({
        message: "Wrong Email ",
      });
    }
    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({
      message: "Something went wrong",
      error,
    });
  }
};

//test controller
export const testController = (req, res) => {
  try {
    res.send("Protected Routes");
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
};


//update profile
export const updateProfile = async (req, res) => {
  try {
    const { name, email, address, mobile } = req.body;
    const user = await userModel.findById(req.user._id);
   
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        email:email || user.email,
        mobile: mobile || user.mobile,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(200).send({
      success: "Profile Updated SUccessfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      error: "Error WHile Update profile",
      error,
    });
  }
};



//orders
export const getOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: "Error While Getting Orders",
      error,
    });
  }
};

//orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ })
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({createdAt:'-1'})
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: "Error While Getting Orders",
      error,
    });
  }
};

export const orderStatus = async(req,res)=>{
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
    
  } catch (error) {
    console.log(error.message)
    res.status(500).send({
      error: "Error While Updating Order",
      error,
    });
  }
}