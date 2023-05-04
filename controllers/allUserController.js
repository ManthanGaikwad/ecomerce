
import userModel from "../models/userModel.js";

export const adminDashboard = async (req, res) => {
    try {

      

     const getUser = await userModel.find({role:0,}).select("-password -cPassword")
     
     
        return res.status(200).json({getUser})
    } catch (error) {
     console.log(error.message);
    }
  
}

 export const getUser = async (req, res) => {
    try {

        const { id } = req.params;
        const userData = await userModel.findById({ _id: id }).select("-password -cPassword")
        res.status(200).json({ userData })
    } catch (error) {
        res.status(400).json({ error: 'No user found' })
    }
}

export const updatedUser = async (req, res) => {
    try {
        const id = req.params.id;
        const { name, email, mobile,address } = req.body;
        const updatedData =  await userModel.findByIdAndUpdate(req.params.id,{...req.body},{new:true}).select("-password -cPassword")

        res.status(201).json({success:'Updated Successfully '})

        

    } catch (error) {
        console.log(error);
        res.status(400).json({ error: "something went wrong" })

    }
}

 export const deleteUser = async(req,res)=>{
    try {
        const id = req.params.id;
        const deleteUser = await userModel.findByIdAndDelete({_id:id})
        res.status(200).json({success:"user deleted  successfully"})
    } catch (error) {
        console.log(error);
        res.status(400).json({error:"something wrong deleting user"})
    }
}