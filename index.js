import express from "express"
import mongoose from "mongoose"
import userRouter from "./routes/userRouter.js"
import productRouter from "./routes/productRouter.js"
import jwt from "jsonwebtoken";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config()

const mongoURI = process.env.MONGO_URL
mongoose.connect(mongoURI).then(
    ()=>{
        console.log("Conneted to MongoDB cluster")
    }
)

const app = express()

app.use(cors())

app.use(express.json())

app.use((req,res,next)=>{
  const authorizationheader = req.header("Authorization")
  
  if(authorizationheader !=null){
    const token = authorizationheader.replace("Bearer ", "")
    

    jwt.verify(token, "secretkey97#2026",
      (error, content)=>{
        if(content == null){
          console.log("Invalid token")

          res.json({
            message : "Invalid tocken"
          })
          
        }else{
          
          req.user = content
          next()
        }

      }
    )

  }else{
    next()
  }


})

app.use("/api/users",userRouter)
app.use("/api/products",productRouter)






app.listen(5000, ()=>{
    console.log("Server is running")
})