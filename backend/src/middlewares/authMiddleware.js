import "dotenv/config"
import jwt from "jsonwebtoken"
import Account from "../models/accountModel.js";
import { ErrorHandler } from "../utils/errorHandle.js";
import { getBallance } from "../utils/auth.js";

export async function authenticateToken(req, res, next){
  try{
    const token = req.cookies.accessToken;
    if (token == null) return res.status(403).json({message: "No token provided"})

    jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, decoded) => {
      if (err) throw new ErrorHandler(err.message, 403)
      req.accountId = decoded.userId
    });
    const account = await Account.findById(req.accountId)
    if(!account){
      throw new ErrorHandler("account not found", 403)
    }
    const {address, ballance} = account
    const newBallance = await getBallance(address)
    if(newBallance != ballance){
      await account.updateOne({
        ballance: newBallance
      })
    }
    req.account = account
    next();
  }
  catch(err){
    next(err)
  }
}

export async function authenticateAdminRole(req, res, next){
  try{
    const {accountId} = req
    const user = await Account.findById(accountId)
    const role = user.role
    if(role !== 1)
    {
      return res.status(403).json({message: "Invalid role"})
    }
    next()
  }
  catch(err){
    next(err)
  }
}
