import express from "express"
import bcrypt from "bcrypt"

import "dotenv/config"

import jsonwebtoken from "jsonwebtoken"
import nodemailer from "nodemailer"

import { mydb } from "./database.js"

import {randomInt} from "crypto"

const OTP_store = []


const LoginRouter = express.Router()
const saltRounds = 12





const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

try {
  await transporter.verify();
  console.log("Server is ready to take our messages");
} catch (err) {
  console.error("Verification failed:", err);
}

LoginRouter.post("/ResetPassword",async(req,res)=> {
  const {Email,newPassword} = req.body

  const result = await mydb.query("SELECT * FROM users WHERE email = $1",[Email])

  if (result.rowCount == 0) {
    res.json({status : "Error",message : "something went wrong."})
  }

  const hashedPassword = bcrypt.hashSync(newPassword,saltRounds)

  const changePassword = await mydb.query("UPDATE users SET password = $1 WHERE email = $2",[hashedPassword,Email])

  res.json({status : "success",message : "password successfully changed"})



})


LoginRouter.post("/SendOTP",async(req,res)=> {
  const {Email} = req.body


  if (Email == "") {
    return res.json({status : "email blank."})
  }

  const otp = randomInt(1000,9999)

  OTP_store.push({Email : Email,otp : otp})

                   try {
  const info = await transporter.sendMail({
    from: `Team summer ${process.env.SMTP_USER}`, // sender address
    to: Email, // list of recipients
    subject: "Account Verification for password reset", // subject line
    text: `Your OTP code is ${otp}`, // plain text body
    html :         `<h1>Account Verification</h1>
        <p>Your OTP code is: <strong>${otp}</strong></p>
        <p>If you did not ask for this, please report to us.</p>`
  });

  console.log("Message sent: %s", info.messageId);
  // Preview URL is only available when using an Ethereal test account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
} catch (err) {
  console.error("Error while sending mail:", err);
}

})


LoginRouter.post("/ValidateOTP",(req,res)=> {
  const {code,Email} = req.body


  const findUser = OTP_store.find(user => user["Email"] == Email)

  if (findUser) {

    if (code == findUser["otp"]) {
      res.json({status : "success"})
    }else {
      res.json({status : "invalid. wrong code"})
    }
  }else {
    res.json({status : "no requested email found sending the code."})
  }



})



LoginRouter.post("/LoginAccount",async(req,res)=> {
       const {password,email} = req.body

       if (password == "" || email == "") {
            return res.json({status : "empty fields."})
        }


    const result = await mydb.query("SELECT * FROM users WHERE username = $1 or email = $1",[email])

    if (result.rowCount == 0) {
       return res.json({status : "user doesn't exist."})
    }

    const user = result.rows[0]

    const valid = bcrypt.compareSync(password,user["password"])

    if (valid) {
        const payload = {
            username : user.username,
            email : user.email,
            id : user.id
        }

        const Token = jsonwebtoken.sign(payload,process.env.JWT_SECRET || "SECRET",{expiresIn : "1hr"})




            return res.json({status : "success",Token : Token})
    }else {
         return res.json({status : "Incorrect password"})
    }



    
})


LoginRouter.post("/CreateAccount",async(req,res)=> {
    const {username,password,email} = req.body

       if (password == "" || email == "" || username == "") {
            return res.json({status : "empty fields."})
        }


    const result = await mydb.query("SELECT * FROM users WHERE username = $1",[username])

    if (result.rowCount > 0) {
       return res.json({status : "username has been taken"})
    }

    const hashedpassword = bcrypt.hashSync(password,saltRounds)


    const result1 = await mydb.query("INSERT INTO USERS (username,email,password) VALUES($1,$2,$3)",[username,email,hashedpassword])


                    try {
  const info = await transporter.sendMail({
    from: `Team summer ${process.env.SMTP_USER}`, // sender address
    to: email, // list of recipients
    subject: "Welcome to Zoomify!", // subject line
    text: "Welcome!", // plain text body
    html : "<h1>Welcome!</h1> <h2>Great to see you joining!</h2>"
  });

  console.log("Message sent: %s", info.messageId);
  // Preview URL is only available when using an Ethereal test account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
} catch (err) {
  console.error("Error while sending mail:", err);
}

    
    res.json({status : "success"})
})


export default LoginRouter