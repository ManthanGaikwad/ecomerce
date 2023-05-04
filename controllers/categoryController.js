

import categoryModel from "../models/categoryModel.js";
import slugify from "slugify";

export  const createCategory = async (req,res)=>{
    try {
        const { name } = req.body;
        if (!name) {
          return res.status(401).send({ error: "Name is required" });
        }
        const existingCategory = await categoryModel.findOne({ name });
        if (existingCategory) {
          return res.status(200).send({
            error: "Category Already Exits",
          });
        }
        const category = await new categoryModel({
          name,
          slug: slugify(name),
        }).save();
        res.status(201).send({
          success: "new category created",
          category,
        });
      } catch (error) {
        console.log(error);
        res.status(500).send({
          error: "error in Category",
        });
      }
}

//update category
export const updateCategory = async (req, res) => {
    try {
      const { name } = req.body;
      const { id } = req.params;
      const category = await categoryModel.findByIdAndUpdate(
        id,
        { name, slug: slugify(name) },
        { new: true }
      );
      res.status(200).send({
        success: "Category Updated Successfully",
        category,
      });
    } catch (error) {
      console.log(error.message);
      res.status(500).send({
        error: "Error while updating category",
      });
    }
  };
  

  // get all cat
export const categoryController = async (req, res) => {
    try {
      const category = await categoryModel.find({});
      res.status(200).send({
        success: "All Categories List",
        category,
      });
    } catch (error) {
      console.log(error.message);
      res.status(500).send({
        error: "Error while getting all categories",
      });
    }
  };

  // single category
export const singleCategory = async (req, res) => {
    try {
      const category = await categoryModel.findOne({ slug: req.params.slug });
      res.status(200).send({
        success: "Get SIngle Category Successfully",
        category,
      });
    } catch (error) {
      console.log(error.message);
      res.status(500).send({
        error: "Error While getting Single Category",
      });
    }
  };

//delete category
export const deleteCategoryCOntroller = async (req, res) => {
    try {
      const { id } = req.params;
      await categoryModel.findByIdAndDelete(id);
      res.status(200).send({
        success: "Category Deleted Successfully",
      });
    } catch (error) {
      console.log(error.message);
      res.status(500).send({
        error: "error while deleting category",
      });
    }
  };

  