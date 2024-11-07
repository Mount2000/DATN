import express from "express"
import "dotenv/config"
import cookieParser from "cookie-parser"

import RouteAuth from "./routes/authRoute.js"
import RouteConcertManager from "./routes/concertManagerRoute.js"
import connectDataBase from "./config/configMongoose.js"
import Account from "./models/accountModel.js"
import Auth from "./models/authModel.js"


connectDataBase()
const app = express()
app.use(express.json())
app.use(cookieParser())
const port = process.env.PORT

app.get("/", (req, res) => {
    res.send("Do an tot nghiep")
})
app.use("/api/auth", RouteAuth)
app.use("/api/concertManager", RouteConcertManager)
// test
app.post("/test1", async(req, res)=>{
    const newUser = await Auth.create({userName:"Son"})
    res.status(200).send(newUser)
})
app.post("/test2", async(req, res)=>{
    const {id} = req.body
    console.log(id)
    const auth = await Auth.findById(id)
    console.log(auth)
    const newUser = await Account.create({
        _id: id,
        userName: "test",
        email:"test"
    })
    res.status(200).send(newUser)
})

app.listen(port, () => {
    console.log(`DATN app listening on port ${port}`)
})