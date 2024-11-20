import jwt, { decode } from "jsonwebtoken"
import mongoose from "mongoose"
import argon2 from "argon2"
import crypto from "crypto"
import "dotenv/config"
import Account from "./models/accountModel.js"
import { createClient } from 'redis';

// const client = createClient();

// client.on('error', err => console.log('Redis Client Error', err));

// await client.connect();

// mongoose.connect("mongodb://localhost:27017/DATN")
function createToken(){
    const newAccount = {
        userName:"test",
        email:"test",
        password: "hashPassword",
    } 
    const registerToken = jwt.sign({newAccount}, process.env.JWT_REGISTER_SECRET, {expiresIn: "30m", encoding: 'utf8'})
    console.log(registerToken)
}

function verifyToken(token){
    const data = jwt.verify(token, process.env.JWT_REGISTER_SECRET, (err, decoded) => {
        console.log(err)
        console.log(decoded.newAccount)
    });
    // console.log(data)
}
async function test(payload){

    const data = Buffer.from(payload, 'base64').toString('utf8')
    console.log(data)
}
async function testRedis(){
    await client.hSet('user-session:123', {
        name: 'John',
        surname: 'Smith',
        company: 'Redis',
        age: 29
    })

    await client.hSet('user-session:123', {
        name: 'Son',
        surname: 'Smith',
        company: 'Redis',
        age: 29
    })
    
    let userSession = await client.hGetAll('6723493059a693c694aad340');
    console.log(userSession);
}
function encryptData(data) {
    const secretKey = crypto.createHash('sha256').update(process.env.JWT_REGISTER_SECRET).digest();
    const algorithm = 'aes-256-cbc'; // AES encryption algorithm with CBC mode
    const iv = crypto.randomBytes(16); // Generate a random 16-byte IV
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey, 'hex'), iv);
  
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Return the IV and encrypted data, both necessary for decryption
    return {
      iv: iv.toString('hex'),
      encryptedData: encrypted
    }
  }
  
  // Function to decrypt data
  function decryptData(encryptedData, iv) {
    const secretKey = crypto.createHash('sha256').update(process.env.JWT_REGISTER_SECRET).digest()
    const algorithm = 'aes-256-cbc';
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey, 'hex'), Buffer.from(iv, 'hex'));
  
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return JSON.parse(decrypted)
  }
  
// testRedis()
// test("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuZXdBY2NvdW50Ijp7InVzZXJOYW1lIjoidGVzdCIsImVtYWlsIjoidGVzdCIsInBhc3N3b3JkIjoiaGFzaFBhc3N3b3JkIn0sImlhdCI6MTczMTQ2NTc5MCwiZXhwIjoxNzMxNDY3NTkwfQ")
createToken()
// verifyToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuZXdBY2NvdW50Ijp7InVzZXJOYW1lIjoidGVzdCIsImVtYWlsIjoidGVzdCIsInBhc3N3b3JkIjoiaGFzaFBhc3N3b3JkIn0sImlhdCI6MTczMDg4MzU2NCwiZXhwIjoxNzMwODg1MzY0fQ.zZ2GNnvOXj2daQiOGPTSwxHlAuTdP_wkDXLVsRje5kE")
// encryptData(JSON.stringify({userName: "test"}))
// decryptData("bde5a32e97e657fd8a7cdfaa47779dee6aa40a7f3793740dec47da942e3585cf","c65f5c7c1daedc2798a9d85cf68281b7")