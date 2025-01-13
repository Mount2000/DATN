import express from "express"

import {authenticateToken} from "../middlewares/authMiddleware.js"
import { register, verifyEmailRegister, verifyEmail, changeEmail,
      login, add2FA, verify2FA, change2FA, refreshToken, getUser,
      logout, verifyKYC, changePassword, forgotPassword, resetPassword, verify2FALogin } from "../controllers/authController.js"

const RouteAuth = express.Router()

RouteAuth.route('/register').post(register)
RouteAuth.route('/verifyEmailRegister/:token').post(verifyEmailRegister)
RouteAuth.route('/login').post(login)
RouteAuth.route('/verify2FALogin').post(verify2FALogin)
RouteAuth.route('/logout').get(authenticateToken,logout)
RouteAuth.route('/refreshToken').post(refreshToken)
RouteAuth.route('/verifyEmail/:token').post(authenticateToken, verifyEmail)
RouteAuth.route('/changeEmail').post(authenticateToken, changeEmail)
RouteAuth.route('/verifyKYC').post(authenticateToken, verifyKYC)
RouteAuth.route('/add2FA').post(authenticateToken, add2FA)
RouteAuth.route('/verify2FA').post(authenticateToken, verify2FA)
RouteAuth.route('/change2FA').post(authenticateToken, change2FA)
RouteAuth.route('/changePassword').post(authenticateToken, changePassword)
RouteAuth.route('/forgotPassword').post(forgotPassword)
RouteAuth.route('/resetPassword/:token').post(resetPassword)
RouteAuth.route('/getUser').get(authenticateToken,getUser)

export default RouteAuth;