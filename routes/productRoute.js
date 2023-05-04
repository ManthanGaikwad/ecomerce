import express from 'express'
import { allProduct, brainTree, brainTreePayment, createProduct, deleteProduct, productCategory, productCount, productFilter, productList, productPhoto, relatedProduct, searchProduct, singleProduct, updateProduct } from '../controllers/productController.js'
import { isAdmin, isAuth } from '../middlewares/auth.js'
import ExpressFormidable from 'express-formidable'

const product_route = express.Router()


product_route.post('/create-product',isAuth,isAdmin, ExpressFormidable(), createProduct)

product_route.put('/update-product/:id',isAuth,isAdmin, ExpressFormidable(),updateProduct)

product_route.get('/get-products',allProduct)

product_route.get('/get-products/:slug',singleProduct)

product_route.get('/getProduct-image/:img',productPhoto)

product_route.delete('/delete-product/:id',deleteProduct)

product_route.post('/product-filter',productFilter)

product_route.get('/products-count',productCount)

product_route.get('/products-list/:page',productList)


product_route.get('/search/:keyword',searchProduct)

product_route.get('/related-product/:pid/:cid',relatedProduct)

product_route.get('/product-category/:slug',productCategory)

product_route.get('/brainTree/token',brainTree)

product_route.post('/brainTree/payment',isAuth,brainTreePayment)



export default product_route