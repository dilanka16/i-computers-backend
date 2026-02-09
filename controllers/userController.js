import axios from "axios";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { text } from "express";

const transpoter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port:587,
    secure:false,
    auth: {
        user: "savindurajapaksha876@gmail.com",
        pass: process.env.GMAIL_APP_PASSWORD,
    }
})


export function createUser(req,res){

    const data = req.body

    const hashedPassword = bcrypt.hashSync(data.password, 10)

  
    const user = new User({
        email : data.email,
        firstName : data.firstName,
        lastName : data.lastName,
        password : hashedPassword,
        // role : data.role,
    })

    user.save().then(
        ()=>{
            res.json({
                message : "User Created Sucessfully"
            })
        }
    )
}

export function loginUser(req,res){
    const email = req.body.email
    const password = req.body.password

    User.find({email : email}).then(
        (users)=>{
           if(users[0]==null){
            res.status(404).json({
                message: "User not found"
            })
           }else{
            const user = users[0]
            

            const isPasswordCorrect = bcrypt.compareSync(password,user.password)
           if(isPasswordCorrect){
              const payload = {
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        role: user.role,
                        isEmailVerified: user.isEmailVerified,
                        image: user.image
                    
                };

                const token = jwt.sign(payload, process.env.JWT_SECRET ,{ expiresIn: "150h" })

            res.json({
                message: "Login Succesful",
                token : token,
                role: user.role
            })
           }else{
            res.json({
                message: "Invalid Password"
            })
           }
           }
        }
    )
}

export function isAdmin(req){
     if(req.user == null){
        return false
    }
    if(req.user.role != "admin"){
        return false
    }
    return true
}

//add try catch for async await

export function getUser(req,res){
    if(req.user == null){
        res.status(401).json({
            message : "Unauthorized"
        })
        return
    }
    res.json(req.user)
}

export async function googlelogin(req,res){
    console.log(req.body.token)

    try{
        const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers : {
                Authorization : `Bearer ${req.body.token}`
            }
        })

        console.log(response.data)
        const user = await User.findOne({
            email : response.data.email
        })
        if(user == null){
            const newUser = new User({
                email: response.data.email,
                firstName: response.data.given_name,
                lastName: response.data.family_name,
                password: "123",
                image: response.data.picture,
            })
            await newUser.save();
            const payload = {
                email : newUser.email,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                role: newUser.role,
                isEmailVerified: true,
                image:newUser.image,
            }

             const token = jwt.sign(payload, process.env.JWT_SECRET ,{ expiresIn: "150h" })

            res.json({
                message: "Login Succesful",
                token : token,
                role: user.role
            })

        }else{
                      const payload = {
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        role: user.role,
                      isEmailVerified: user.isEmailVerified,
                        image: user.image,
                    
                };

                const token = jwt.sign(payload, process.env.JWT_SECRET ,{ expiresIn: "150h" })

            res.json({
                message: "Login Succesful",
                token : token,
                role: user.role
            })

        }

    }catch(error){
        res.status(500).json({
            message: "Google Login Failed",
            error: error.message
        })
    }

}

export async function sendOTP(req,res){

    const email = req.params.email
    const user = await User.findOne({
        email: email
    })
    if(user == null){
        res.status(404).json({
            message: "User not found"
        })
        return
    }
    const message = {
        from :  "savindurajapaksha876@gmail.com",
        to : email,
        subject: "Your OTP Code",
        text : "Your OTP code is 123456"
    }

    transpoter.sendMail(message , (err,info)=>{
        if(err){
            res.status(500).json({
                message: "Failed to send OTP",
                error: err.message
            })
        }else{
            res.json({
                message: "OTP sent successfully"
            })
        }
    })

}