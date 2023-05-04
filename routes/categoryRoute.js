import express from 'express'
import { categoryController, createCategory, deleteCategoryCOntroller, singleCategory, updateCategory } from '../controllers/categoryController.js'
import { isAdmin, isAuth } from '../middlewares/auth.js'
const category_route  = express.Router()


category_route.post('/create',isAuth,isAdmin,createCategory)

category_route.put('/update/:id',isAuth,isAdmin,updateCategory)

category_route.get('/categories',categoryController)

category_route.get('/single-category/:slug',singleCategory)

category_route.delete('/delete/:id',isAuth,isAdmin,deleteCategoryCOntroller)



export default category_route