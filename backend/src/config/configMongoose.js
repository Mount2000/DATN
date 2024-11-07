import mongoose from "mongoose"

function connectDataBase() {
    mongoose.connect("mongodb://localhost:27017/DATN")
}

export default connectDataBase