
import productModel from '../models/productModel.js'
import Category from '../models/categoryModel.js'
import fs from 'fs'
import slugify from 'slugify';
import braintree from 'braintree'
import orderModel from '../models/orderModel.js'

import dotenv from "dotenv";

dotenv.config();



//payment gateway
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.MERCHANT_ID,
  publicKey: process.env.PUBLIC_KEY,
  privateKey: process.env.PRIVATE_KEY,
});


export const createProduct =async(req,res)=>{
    try {
        const { name, description, price, category, quantity, shipping } =
          req.fields;
        const { photo } = req.files;
        //validation
        switch (true) {
          case !name:
            return res.status(500).send({ error: "Name is Required" });
          case !description:
            return res.status(500).send({ error: "Description is Required" });
          case !price:
            return res.status(500).send({ error: "Price is Required" });
          case !category:
            return res.status(500).send({ error: "Category is Required" });
          case !quantity:
            return res.status(500).send({ error: "Quantity is Required" });
          case !photo:
            return res
              .status(500)
              .send({ error: "photo is Required " });
        }
    
        const products = new productModel({ ...req.fields, slug: slugify(name) });
        if (photo) {
          products.photo.data = fs.readFileSync(photo.path);
          products.photo.contentType = photo.type;
        }
        await products.save();
        res.status(201).send({
          success: "Product Created Successfully",
          products,
        });
      } catch (error) {
       console.log(error.message) 
       res.send({error:"creating product error"})
    }

}


export const allProduct = async(req,res)=>{
    try {
        const products = await productModel
        .find({})
        .populate("category")
        .select("-photo")
        .limit(12)
        .sort({ createdAt: -1 });
      res.status(200).send({
        TotalProducts: products.length,
        success: "ALlProducts ",
        products,
      });
        
    } catch (error) {
        console.log(error.message)
        res.status(500).send({error:'getting error all products'})
    }
}

export const singleProduct = async(req,res)=>{
    try {
        const product = await productModel.findOne({ slug: req.params.slug })
        .select("-photo")
        .populate("category");

        
      res.status(200).send({
        success: "Single Product Fetched",
        product,
      });
        
    } catch (error) {
        console.log(error.message)
        res.status(500).send({error:'getting error single product'})
    }
}


export const productPhoto = async (req, res) => {
    try {
      const product = await productModel.findById(req.params.img).select("photo");
      if (product.photo.data) {
        res.set("Content-type", product.photo.contentType);
        return res.status(200).send(product.photo.data);
      }
    } catch (error) {
      console.log(error.message);
      res.status(500).send({
        error: "Error while getting photo",
      });
    }
  };

  //delete controller
export const deleteProduct = async (req, res) => {
    try {
      await productModel.findByIdAndDelete(req.params.id).select("-photo");
      res.status(200).send({
        success: "Product Deleted successfully",
      });
    } catch (error) {
      console.log(error.message);
      res.status(500).send({
        error: "Error while deleting product",
        
      });
    }
  };


  //update product
  export const updateProduct =async(req,res)=>{
    try {
      const { name, description, price, category, quantity, shipping } =
        req.fields;
      const { photo } = req.files;
      //validation
      switch (true) {
        case !name:
          return res.status(500).send({ error: "Name is Required" });
        case !description:
          return res.status(500).send({ error: "Description is Required" });
        case !price:
          return res.status(500).send({ error: "Price is Required" });
        case !category:
          return res.status(500).send({ error: "Category is Required" });
        case !quantity:
          return res.status(500).send({ error: "Quantity is Required" });
        case photo && photo.size > 1000000:
          return res
            .status(500)
            .send({ error: "photo is Required and should be less then 1mb" });
      }
  
     
      const products = await productModel.findByIdAndUpdate(
        req.params.id,
        { ...req.fields, slug: slugify(name) },
        { new: true }
      );
      if (photo) {
        products.photo.data = fs.readFileSync(photo.path);
        products.photo.contentType = photo.type;
      }

       await products.save();

      
       
      res.status(201).send({
        success: "Product Updated Successfully",
        products,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        error: "Error in Update product",
      });
    }

}

//filter product

export const productFilter = async(req,res)=>{
  try {

    const {checked,radio} = req.body;
    let args = {}
    if(checked.length > 0) args.category=checked

    if(radio.length) args.price = {$gte:radio[0],$lte:radio[1]}
    
    const product = await productModel.find(args)

    res.status(200).send({
      success:'filtered',
      product
    })
    
  } catch (error) {
    console.log(error.message)
  }
}


//count product

export const productCount = async(req,res)=>{
  try {

    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success:'total count products',
      total
    })
    
  } catch (error) {
    console.log(error.message)
  }
}


//product list base on page

export const productList = async(req,res)=>{
  try {

    const perPage = 8
    const page = req.params.page ? req.params.page:1

    const products = await productModel.find({}).select('-photo').skip((page - 1) * perPage).limit(perPage).sort({createdAt:-1})

res.status(200).send({
  success:'product list',
  products
})

    
  } catch (error) {
    console.log(error.message)
  }
}


//search for products

export const searchProduct = async(req,res)=>{
  try {
    const {keyword} = req.params;

    const result = await productModel.find({
      $or:[
        {name:{$regex: keyword, $options:'i'}},
        {description:{$regex: keyword, $options:'i'}}
      ]
    }).select("-photo")

    res.json(result);
    
  } catch (error) {
    console.log(error.message)
  }
}


export const relatedProduct = async(req,res)=>{
  try {

    const {pid,cid} = req.params

    const products = await productModel.find({
      category:cid,
      _id:{$ne: pid}
    }).select('-photo').limit(4).populate("category")
    
    res.status(200).send({
      success:'product related get',
  products})

  } catch (error) {
    console.log(error.message)
    res.send({error:'related product getting error'})
  }
}

export const productCategory = async(req,res)=>{
  try {


    const category = await Category.findOne({slug:req.params.slug})


    const products = await productModel.find({category}).populate('category')

res.status(200).send({
  success:'product category related get',
  category,
  products
})


    
  } catch (error) {
    console.log(error.message)
  }
}



export const  brainTree  = async(req,res)=>{
  try {

    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
    
  } catch (error) {
    console.log(error.message)
  }
}

//payment
export const brainTreePayment = async (req, res) => {
  try {
    const { nonce, cart } = req.body;
    let total = 0;
    cart.map((i) => {
      total += i.price;
    });
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new orderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};







