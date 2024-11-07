import mongoose from "mongoose"

const ConcertSchema = new mongoose.Schema({
    title: {type: String, require:true},
    logo: {type: String, require: true},
    address: {type: String, require:true},
    owner: {type: mongoose.Schema.Types.ObjectId, ref: "Account"},
    isOffline: {type: Boolean, default: true},
    type: {type: String},
    location: {type: String},
    description: {type: String},
    timeStartSale: {type: Date, require: true},
    timeEndSale: {type: Date, require: true},
    timeStartConcert: {type: Date, require: true},
    tickets: [{
        ticketName: {type: String, require: true},
        logo: {type: String},
        contractId: {type: Number, require: true},
        price: {type: Number, default: 0},
        totalSupply: {type: Number, require: true},
        sold: {type: Number, default: 0}
    }],
    totalTicketSupply: {type: Number, require: true},
    maxTicketPurchase: {type: Number, default: 50},
    seatmap: {type: String},
    status: {type: Number, default: 0}, // pending: 2, accect: 1, reject: 0
})

const Concert = mongoose.model("concerts", ConcertSchema)

export default Concert