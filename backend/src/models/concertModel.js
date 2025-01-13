import mongoose from "mongoose"

const ConcertSchema = new mongoose.Schema({
    title: {type: String, require:true},
    logo: {type: String, require: true},
    address: {type: String, require:true},
    owner: {type: mongoose.Schema.Types.ObjectId, ref: "Account"},
    isOffline: {type: Boolean, default: true},
    type: {type: Number, require: true},  // 1:"Music", 2:"Sport", 3:"Art", 4:"Theater & Comedy", 5:"Workshop", 6:"Other"
    location: {type: String},
    description: {type: String},
    timeStartSale: {type: Date, require: true},
    timeEndSale: {type: Date, require: true},
    timeStartConcert: {type: Date, require: true},
    tickets: [{
        ticketName: {type: String, require: true},
        contractId: {type: Number, require: true},
        price: {type: String, default: 0},
        supply: {type: Number, require: true},
        sold: {type: Number, default: 0}
    }],
    totalTicketSupply: {type: Number, require: true},
    maxTicketPurchase: {type: Number, default: 50},
    seatmap: {type: String},
    status: {type: Number, default: 2}, // pending: 2, accept: 1, reject: 0
    balance: {type: String},
    isWithdraw: {type: Boolean, default: false},
})

const Concert = mongoose.model("concerts", ConcertSchema)

export default Concert