import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan';
import connectDb from './config/db.js';
import userRoute from './routes/userRoute.js'
import category_route from './routes/categoryRoute.js';
import product_route from './routes/productRoute.js';
import admin_route from './routes/adminRoute.js';
import cors from 'cors'
import path from 'path';

//configure env
dotenv.config()

//database 
connectDb();

const app = express();

//middleware
//app.use(morgan('dev'))
app.use(express.json())
app.use(cors());

app.use(express.static(path.join(__dirname,'./client/dist')))
//routes

app.use('/api',userRoute)
app.use('/admin',admin_route)
app.use('/category',category_route)
app.use('/product',product_route)


app.use('*',function(req,res){
    res.sendFile(path.join(__dirname,'./client/dist/index.html'))
})

const PORT = process.env.PORT || 5000
app.listen(PORT, ()=>console.log(`server listening on ${PORT}`));