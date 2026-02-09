import express from "express"
import { createUser, getUser, googlelogin, loginUser, sendOTP } from "../controllers/userController.js"


const userRouter = express.Router()

userRouter.post("/",createUser)
userRouter.post("/login",loginUser)
userRouter.get("/",getUser)
userRouter.post("/google-login", googlelogin)
userRouter.get("/send-otp/:email", sendOTP)

export default userRouter

