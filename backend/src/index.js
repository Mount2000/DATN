import express from "express"
import "dotenv/config"
import cookieParser from "cookie-parser"
import cors from "cors"

import RouteAuth from "./routes/authRoute.js"
import RouteUser from "./routes/userRoute.js"
import RouteConcertManager from "./routes/concertManagerRoute.js"
import connectDataBase from "./config/configMongoose.js"


connectDataBase()
const app = express()
app.use(express.json())
app.use(cookieParser())
const corsOptions = {
    origin: 'http://localhost:3000',  // Allow any origin
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  };
app.use(cors(corsOptions));
const port = process.env.PORT

app.get("/api", (req, res) => {
    res.send("Do an tot nghiep")
})
app.use("/api/auth", RouteAuth)
app.use("/api/user", RouteUser)
app.use("/api/concertManager", RouteConcertManager)


app.listen(port, () => {
    console.log(`DATN app listening on port ${port}`)
})