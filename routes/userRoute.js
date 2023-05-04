import express from 'express'
import path from 'path'
import{register,login,forgotPassword,testController, updateProfile, getOrders, getAllOrders, orderStatus} from '../controllers/userController.js'
import { isAuth,isAdmin } from '../middlewares/auth.js';


const user_route = express.Router();



//middleware
user_route.use(express.json());
user_route.use(express.urlencoded({extended:true}))

user_route.use(express.static('../userImages'))




//routing

//register
 user_route.post('/register',register)

 //login
 user_route.post('/login',login)

 //forgot
 user_route.post('/forgot',forgotPassword)

 //test
 user_route.get('/test',isAuth,isAdmin,testController)

//  //protected routes
//  user_route.get('/user-auth',isAuth,(req,res)=>{
//     res.status(200).send({ok:true})
//  })

user_route.put("/profile",isAuth,updateProfile)

user_route.get('/orders',isAuth,getOrders)

user_route.get('/all-orders',isAuth,getAllOrders)

user_route.put('/order-status/:orderId',isAuth,isAdmin,orderStatus)



export default user_route;