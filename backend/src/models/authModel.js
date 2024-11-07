import mongoose from "mongoose"

const AuthSchema = new mongoose.Schema({
    userName: {type: String, require: true},
    email: {type: String, require: true, index: true},
    password: {type: String, require: true},
    authtSecret: {type: String},
    otp: {type: Number},
    otpExpire: {type: Date},
})

const Auth = mongoose.model("auth", AuthSchema)

export default Auth