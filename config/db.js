import mongoose from "mongoose";


const connectDb = async ()=>{
    mongoose.set("strictQuery", false);

mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology:true,
}).then((res)=>{
    console.log('connect database');
}).catch((err)=>{
    console.log("database not connected");
})
    // try {
    //     const db = await mongoose.connect(process.env.MONGO_URL)
    //     console.log(`connected to database `)
    // } catch (error) {
    //     console.log(error.message);
    // }
}

export default connectDb