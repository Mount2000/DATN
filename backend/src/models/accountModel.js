import mongoose from "mongoose"

const AccountSchema = new mongoose.Schema({
    userName: {type: String, require: true, unique: true},
    email: {type: String, require:true, unique: true, index: true},
    password: {type: String, require: true},
    authtSecret: {type: String},
    isKYC: {type: Boolean, default: false},
    role: {type: Number, default: 0}, // user: 0, admin: 1
    token: {type: String},
    address: {type: String},
    privateKey: {type: String},
    ballance: {type: String, default: "0"},
})

const Account = mongoose.model("Account", AccountSchema)

export default Account