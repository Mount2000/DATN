import argon2 from "argon2"
import jwt from "jsonwebtoken"
import "dotenv/config"
import {ethers} from "ethers"
import clientRedis from "../config/configRedis.js"
import Account from "../models/accountModel.js"
import Auth from "../models/authModel.js"
import { validatePassword, createOTP, createAccessToken, createRefreshToken,
     createAuthSecret, validate2FA, encryptData, decryptData } from "../utils/auth.js";
import { ErrorHandler } from "../utils/errorHandle.js";
import { sendMail } from "../utils/sendMail.js";
import { addUser } from "../contracts/platform.js"
import speakeasy from "speakeasy"
import QRCode from "qrcode"

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
        const {iv, encryptedData} = encryptData(JSON.stringify(newAccount))
        const registerToken = jwt.sign({iv, encryptedData}, process.env.JWT_REGISTER_SECRET, {expiresIn: "30m"})

        const html = `<h2>Verify email:</h2><br /><a href= http://localhost:3000/verifyEmailRegister/${registerToken}>Click here</a>`
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
        let data = {}
        jwt.verify(token, process.env.JWT_REGISTER_SECRET, (err, decoded) => {
            if(err) return res.status(401).send(err)
            data = decoded
        })
        const newAccount = await decryptData(data.encryptedData, data.iv)
        const {email, userName, password} = newAccount
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
        const wallet = ethers.Wallet.createRandom()
        const {address, privateKey} = wallet
        await addUser(address)
        await Account.create({
            ... newAccount,
            address,
            privateKey,
        })
        return res.status(200).json({
            success: true,
            message: "Verify email successfully",
        })
    }
    catch(err){
        next(err)
    }
}

// export async function resendOTP(req, res, next) {
//     try{
//     const {accountId} = req
//     const auth =  await Auth.findById(accountId)
//     if(!auth){
//         throw new ErrorHandler("Invalid token", 400)
//     }
//     const {otp, otpExpire} = createOTP()
//     const email = auth.email
//     await auth.updateOne({
//         otp,
//         otpExpire,
//     })
//     const html = `<h2>Register code:</h2><br /><blockquote>${otp}</blockquote>`
//     const subject = "Confirm email"
//     await sendMail({email, subject, html})
//     return res.status(200).json({message:"send mail otp success"})
//     }
//     catch(err){
//         next(err)
//     }
// }


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

export async function changeEmail(req, res, next) {
    try{
        const {newEmail} = req.body
        if(!newEmail){
            throw new ErrorHandler("Bad request", 400)
        }
        console.log(newEmail)
        const exsitedEmail = await Account.findOne({email: newEmail})
        if(exsitedEmail){
            throw new ErrorHandler("Email exsited", 400)
        }
        const token = jwt.sign({newEmail}, process.env.JWT_REGISTER_SECRET, {expiresIn: "30m"}) 
        const html = `<h2>Verify email:</h2><br /><a href= http://localhost:4000/api/auth/verifyEmail/${token}>Click here</a>`
        const subject = "Confirm email"
        await sendMail({email: newEmail, subject, html})
        return res.status(200).json({message: "send mail otp success"})
        }
    catch(err){
        next(err)
    }
}

export async function verifyEmail(req, res, next){
    try{
        const {accountId} = req
        const { token } = req.params;
        if(!token){
            throw new ErrorHandler("Bad request", 400)
        }
        let email
        jwt.verify(token, process.env.JWT_REGISTER_SECRET, (err, decoded) => {
            if(err) return res.status(400).send(err)
            email = decoded.newEmail
        })
        const exsitedEmail = await Account.findOne({ email })
        if( exsitedEmail ){
            throw new ErrorHandler('Email already exsits', 400);
        }
        
        await Account.findByIdAndUpdate(accountId, { email })
        return res.status(200).json({message: "verify email success"})
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
    if(account.authtSecret){
        const token = jwt.sign({accountId: account._id}, process.env.JWT_REGISTER_SECRET, {expiresIn: "30m"}) 
        return res.status(201).json({
            success: true,
            status: 201,
            message: "Login successfully",
            metaData: {
                token,
            },
        })
    }
    else{
        const accessToken = createAccessToken(account._id)
        const refreshToken = createRefreshToken(account._id)
    
        await account.updateOne({token: refreshToken})
        res.cookie("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: 'None'})
        res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: 'None'})
        return res.status(200).json({
            success: true,
            status: 200,
            message: "Login successfully",
            metaData: {
                userName: account.userName,
                role: account.role,
            },
        })
    }
    }
    catch(err){
        next(err)
    }
}

export async function verify2FALogin(req, res, next) {
    try{
        const {token, code} = req.body
        if(!token || !code) throw new ErrorHandler("Bad request", 400)
        let accountId
        jwt.verify(token, process.env.JWT_REGISTER_SECRET, (err, decoded) => {
            if(err) return res.status(400).send(err)
            accountId = decoded.accountId
        })
        const account = await Account.findById(accountId)
        if(!account) throw new ErrorHandler("Bad request", 400)
        const verified = speakeasy.totp.verify({
            secret: account.authtSecret,
            encoding: 'base32',
            token: code,
        });
        if(!verified){
            throw new ErrorHandler("Faile to validate token", 400)
        }
        const accessToken = createAccessToken(account._id)
        const refreshToken = createRefreshToken(account._id)
    
        await account.updateOne({token: refreshToken})
        res.cookie("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: 'None'})
        res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: 'None'})
        return res.status(200).json({
            success: true,
            message: "Login successfully",
            metaData: {
                userName: account.userName,
                role: account.role,
            },
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
        if(err){
            throw new ErrorHandler(err.message, 400)
        }
        const account = await Account.findById(payload.userId)
        if(refreshToken != account.token){
            throw new ErrorHandler("Invalid token", 400)
        }
        const accessToken = createAccessToken(payload.userId)
        res.cookie("accessToken", accessToken)
        return res.status(200).json({
            success: true,
            metaData:{
                accessToken
            }
        })
    }
    catch(err){
        next(err)
    }
}

export async function add2FA(req, res, next){
    try{
        const secret = speakeasy.generateSecret({ length: 20, name: 'Tickbit', });
        const qrcode = await QRCode.toDataURL(secret.otpauth_url)
        return res.status(200).json({
            success: true,
            metadata: {
                secret,
                qrcode,
            }
        })
    }
    catch(err){
        next(err)
    }
}

export async function verify2FA(req, res, next){
    try{
        const {accountId} = req
        const {token, secret} = req.body
        console.log(req.body)
        if(!token){
            throw new ErrorHandler("Bad request", 400)
        }
        const verified = speakeasy.totp.verify({
            secret: secret,
            encoding: 'base32',
            token: token,
        });
        if(!verified){
            throw new ErrorHandler("Faile to validate token", 400)
        }
        await Account.findByIdAndUpdate(accountId, {authtSecret: secret})
        return res.status(200).json({
            success:true,
            message: "Verify 2FA successfully"})
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
        const hashPassword = await argon2.hash(newPassword, process.env.PASSWORD_SECRET)
        await account.updateOne({password: hashPassword})
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
        const recoverPasswordToken = jwt.sign({userId: account._id}, process.env.JWT_REGISTER_SECRET, {expiresIn: "15m"})
        const html = `<h2>Reset password:</h2><br /><a href= http://localhost:3000/resetPassword/${recoverPasswordToken}>Click here</a>`
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
        const {password} = req.body
        const {token} = req.params
        console.log(token)
        if(!password){
            throw new ErrorHandler("Bad request", 400)
        }
        let accountId 
        jwt.verify(token, process.env.JWT_REGISTER_SECRET, (err, decoded) => {
            if(err){
                return res.status(403).json({message: "Invalid token"})
            }
            accountId = decoded.userId
        })
        const hashPassword = await argon2.hash(password, process.env.PASSWORD_SECRET)
        await Account.findByIdAndUpdate(accountId, {password: hashPassword})
        return res.status(200).json({
            success: true,
            message: "Change password successfully, please login again"
        })
    }
    catch(err){
        next(err)
    }
}

export async function getUser(req, res, next) {
    try{
        const {accountId} = req
        const account = await Account.findById(accountId)
        if(!account){
            throw new ErrorHandler("User not found", 400)
        }
        return res.status(200).json({
            success: true,
            metaData: {
                userName: account.userName,
                email: account.email,
                address: account.address,
                ballance: account.ballance,
                role: account.role,
            }
        })
    }
    catch(err){
        next(err)
    }
}

export async function logout(req, res, next) {
    res.clearCookie("accessToken")
    res.clearCookie("refreshToken")
    return res.status(200).json({
        success: true,
    })
}