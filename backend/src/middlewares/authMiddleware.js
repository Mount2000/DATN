import "dotenv/config"
import jwt from "jsonwebtoken"
import Account from "../models/accountModel.js";

export async function authenticateToken(req, res, next){
  const token = req.cookies.accessToken;
  if (token == null) return res.status(403).json({message: "No token provided"})

  jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({message: "Invalid token"})
      req.accountId = decoded.userId
  });
  next();
}

export async function authenticateAdminRole(req, res, next){
  const {accountId} = req
  const user = await Account.findById(accountId)
  const role = user.role
  if(role !== 1)
  {
    return res.status(403).json({message: "Invalid role"})
  }
}
