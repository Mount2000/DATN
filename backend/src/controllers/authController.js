import argon2 from "argon2"
import jwt from "jsonwebtoken"
import "dotenv/config"
import {ethers} from "ethers"

import Account from "../models/accountModel.js"
import Auth from "../models/authModel.js"
import { validatePassword, createOTP, createAccessToken, createRefreshToken,
     createAuthSecret, validate2FA, encryptData, decryptData } from "../utils/auth.js";
import { ErrorHandler } from "../utils/errorHandle.js";
import { sendMail } from "../utils/sendMail.js";

export async function register(req, res, next) {
    try{
        const { email, userName, password } = req.body;
        if(!email || !userName || !password){
            throw new ErrorHandler("Bad request", 400)
        }
        const exsitedEmail = await Account.findOne({ email })
        if( exsitedEmail ){
            throw new ErrorHandler('Email already exsits', 400);
        }
        const exsitedUserName = await Account.findOne({ userName })
        if( exsitedUserName ){
            throw new ErrorHandler('User name already exsits', 400);
        }
        if (!validatePassword(password)) {
            throw new ErrorHandler(
                "Password must be 6-50 characters long and include at least one number, one uppercase letter, one lowercase letter, and one special character",
                400);
        }
        
        const hashPassword = await argon2.hash(password, process.env.PASSWORD_SECRET)
        
        const newAccount = {
            userName,
            email,
            password: hashPassword,
        }
        const registerToken = jwt.sign({newAccount}, process.env.JWT_REGISTER_SECRET, {expiresIn: "30m"})

        const html = `<h2>Verify email:</h2><br /><a href= http/localhost:4000/api/auth/verifyEmailRegister/${registerToken}>Click here</a>`
        const subject = "Verify email"
        await sendMail({email, subject, html})

        return res.status(200).json({
            success: true,
            message: "Please check your email to verify",
        })
    }
    catch( err ){
        next(err)
    }
}

export async function verifyEmailRegister(req, res, next){
    try{
        const {token} = req.params
        if(!token){
            throw new ErrorHandler("Bad request", 400)
        }
        let newAccount
        jwt.verify(token, process.env.JWT_REGISTER_SECRET, (err, decoded) => {
            if(err) return res.status(400).send(err)
            newAccount = decoded.newAccount
        })
        const {userName, email, password} = newAccount
        console.log({...newAccount})
        // await Account.create({
        //     ... newAccount
        // })
    }
    catch(err){
        next(err)
    }
}

export async function resendOTP(req, res, next) {
    try{
    const {accountId} = req
    const auth =  await Auth.findById(accountId)
    if(!auth){
        throw new ErrorHandler("Invalid token", 400)
    }
    const {otp, otpExpire} = createOTP()
    const email = auth.email
    await auth.updateOne({
        otp,
        otpExpire,
    })
    const html = `<h2>Register code:</h2><br /><blockquote>${otp}</blockquote>`
    const subject = "Confirm email"
    await sendMail({email, subject, html})
    return res.status(200).json({message:"send mail otp success"})
    }
    catch(err){
        next(err)
    }
}


export async function verifyKYC(req, res, next){
    try{
        const {accountId} = req
        const account = await Account.findById(accountId)
        if(!account){
            throw new ErrorHandler("Invalid token", 400)
        }
        if(account.isKYC){
            throw new ErrorHandler("User already KYC", 400)
        }
        const wallet = ethers.Wallet.createRandom()
        await account.updateOne({
            isKYC: true,
            address: wallet.address,
            privateKey: wallet.privateKey,
        })
        return res.status(200).send({success: true})
    }
    catch(err){
        next(err)
    }
}

export async function verifyEmail(req, res, next){
    try{
        const {accountId} = req
        const { reqOTP } = req.body;
        if(!reqOTP){
            throw new ErrorHandler("Bad request", 400)
        }
        const auth =  await Auth.find({accountId})
        if(!auth){
            throw new ErrorHandler("Invalid token", 400)
        }
        console.log(auth.otp)
        if( reqOTP != auth.otp ){
            throw new ErrorHandler("Invalit OTP", 400)
        }
        if(Date.now() > auth.otpExpire){
            throw new ErrorHandler("OTP is expired", 400)
        }
        const exsitedEmail = await Account.findOne({ email })
        if( exsitedEmail ){
            throw new ErrorHandler('Email already exsits', 400);
        }
        
        await Account.findByIdAndUpdate(accountId, { email: auth.email })
        return res.status(200).json({message: "verify email success"})
    }
    catch(err){
        next(err)
    }
}

export async function changeEmail(req, res, next) {
    try{
        const {accountId} = req
        const {newEmail} = req.body
        if(!newEmail){
            throw new ErrorHandler("Bad request", 400)
        }
        const exsitedEmail = await Account.findOne({email: newEmail})
        if(exsitedEmail){
            throw new ErrorHandler("Email exsited", 400)
        }
        const {otp, otpExpire} = createOTP()
        const auth = await Auth.findById(accountId)
        auth.updateOne({
            email: newEmail,
            otp,
            otpExpire,
        })
        const html = `<h2>Register code:</h2><br /><blockquote>${otp}</blockquote>`
        const subject = "Confirm email"
        await sendMail({newEmail, subject, html})
        return res.status(200).json({message: "send mail otp success"})
        }
    catch(err){
        next(err)
    }
}

export async function login(req, res, next){
    try{
    const {email, password} = req.body
    if(!password || !email){
        throw new ErrorHandler("Bad request", 400)
    }
    const account = await Account.findOne( { email } );
    if(!account){
        throw new ErrorHandler('Email does not exsit', 400)
    }
    const result = await argon2.verify(account.password, password)
    
    if(!result){
        throw new ErrorHandler("Wrong password", 400)
    }

    const accessToken = createAccessToken(account._id)
    const refreshToken = createRefreshToken(account._id)

    await account.updateOne({token: refreshToken})

    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true })
    res.cookie("accessToken", accessToken, { httpOnly: true, secure: true })
    return res.status(200).json({
        success: true,
        message: "Login successfully"
    })
    }
    catch(err){
        next(err)
    }
}

export async function refreshToken(req, res, next){
    try{
        const refreshToken = req.cookies.refreshToken
        if(!refreshToken){
            throw new ErrorHandler("Refresh token does not exsit", 400)
        }
        const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        if(payload.exp < Date.now()){
            throw new ErrorHandler("Expired token", 400)
        }
        const account = await Account.findById(payload.userId)
        if(refreshToken != account.token){
            throw new ErrorHandler("Invalid token", 400)
        }
        const accessToken = jwt.sign({userId: payload.userId}, process.env.JWT_ACCESS_SECRET, {expiresIn: "1h"})
        res.cookie("accessToken", accessToken)
        return res.status(200).json({success: true})
    }
    catch(err){
        next(err)
    }
}

export async function logout(req, res, next){
    try{
        const accessToken = req.header.authorization.split(' ')[1]
        if(!accessToken){
            throw new ErrorHandler("Access token does not exsit", 400)
        }
        const accountId = jwt.verify(accessToken, JWT_ACCESS_SECRET).userId
        const success = await Account.updateOne({_id: accountId}, {token: null})
        console.log(success)
        if(!success){
            throw new ErrorHandler("Fail to delete token", 400)
        }
        res.clearCookie('refreshToken')
        res.clearCookie('accessToken')
        return res.status(200).json({message: "Logged out successfully"})

    }
    catch(err){
        next(err)
    }
}

export async function add2FA(req, res, next){
    try{
        const {accountId} = req
        const {secretBase32, secretAscii, qrcode} = createAuthSecret()
        
        await Auth.findByIdAndUpdate(accountId, { authtSecret: secretAscii })

        return res.status(200).json({secretBase32, qrcode})
    }
    catch(err){
        next(err)
    }
}

export async function verify2FA(req, res, next){
    try{
        const {accountId} = req
        const {token} = req.body
        if(!token){
            throw new ErrorHandler("Bad request", 400)
        }
        const auth = await Auth.findById(accountId)
        const secretAscii = auth.newAuthtSecret
        const tokenValidate = validate2FA({secretAscii, token})
        if(!tokenValidate){
            throw new ErrorHandler("Faile to validate token", 400)
        }
        await Account.findByIdAndUpdate(accountId, {authtSecret: secretAscii})
        return res.status(200).json({message: "Verify 2FA successfully"})
    }
    catch(err){
        next(err)
    }
}

export async function change2FA(req, res, next) {
    try{
        const {accountId} = req
        const {token} = req.body // token : 2FA code
        if(!token){
            throw new ErrorHandler("Bad request", 400)
        }
        const auth = await Auth.findById(accountId)
        if(!auth) throw new ErrorHandler("Invalid token", 400)
        const oldSecretAscii = auth.authtSecret
        const tokenValidate = validate2FA({oldSecretAscii, token})
        if(!tokenValidate){
            throw new ErrorHandler("Faile to validate token", 400)
        }
        const {secretBase32, secretAscii, qrcode} = createAuthSecret()
        
        await Account.findByIdAndUpdate(accountId, {newAuthtSecret: secretAscii})
        return res.status(200).json({secretBase32, qrcode})
    }
    catch(err){
        next(err)
    }
}

export async function changePassword(req, res, next){
    try{
        const {oldPassword, newPassword} = req.body
        const {accountId} = req
        if(!oldPassword || !newPassword){
            throw new ErrorHandler("Bad request", 400)
        }
        const account = await Account.findById(accountId)
        if(!account){
            throw new ErrorHandler("Invalid token", 400)
        }
        const result = await argon2.verify(account.password, oldPassword)
        if(!result){
            throw new ErrorHandler("Wrong password", 400)
        }
        await account.updateOne({password: newPassword})
        return res.status(200).send({success: true})
        
    }
    catch(err){
        next(err)
    }
}

export async function forgotPassword(req, res, next){
    try{
        const {email} = req.body
        const account = await Account.findOne({email})
        if(!email){
            throw new ErrorHandler("Bad request", 400)
        }
        if(!account){
            throw new ErrorHandler("Email does not exsit", 400)
        }
        const recoverPasswordToken = jwt.sign({userId: account._id}, process.env.JWT_RECOVER_PASSWORD_SECRET, {expiresIn: "15m"})
        const html = `<h2>Reset password:</h2><br /><a href= http/localhost:4000/api/auth/resetPassword/${recoverPasswordToken}>Click here</a>`
        const subject = "Reset password"
        await sendMail({email, subject, html})

        return res.status(200).json({
            success: true,
            accountId: account._id,
            message: "Please check your email to verify",
        })
    }
    catch(err){
        next(err)
    }
}

export async function resetPassword(req, res, next){
    try{
        const {newPassword} = req.body
        const {token} = req.params
        if(!newPassword){
            throw new ErrorHandler("Bad request", 400)
        }
        let accountId 
        jwt.verify(token, process.env.JWT_RECOVER_PASSWORD_SECRET, (err, decoded) => {
            if(err){
                return res.status(403).json({message: "Invalid token"})
            }
            accountId = decoded.userId
        })
        const hashPassword = await argon2.hash(newPassword, process.env.PASSWORD_SECRET)
        await Account.findByIdAndUpdate(accountId, {password: hashPassword})
        return res.status(200).send({
            success: true,
            message: "Change password successfully, please login again"
        })
    }
    catch(err){
        next(err)
    }
}