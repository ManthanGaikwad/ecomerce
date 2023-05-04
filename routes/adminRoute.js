import express from 'express';
import { adminDashboard, deleteUser, getUser, updatedUser } from '../controllers/allUserController.js';
import { isAdmin, isAuth } from '../middlewares/auth.js';
const admin_route = express.Router()

//middleware
admin_route.use(express.json());
admin_route.use(express.urlencoded({extended:true}))

admin_route.get('/allUsers',adminDashboard)

admin_route.get('/getUser/:id',getUser)

admin_route.put('/editUser/:id',updatedUser)

admin_route.delete('/deleteUser/:id',deleteUser)



export default admin_route;