import mongoose from "mongoose"

const TicketSchema = new mongoose.Schema({
    owner: {type: mongoose.Schema.Types.ObjectId, ref: "Account"},
    concertId: {type: mongoose.Schema.Types.ObjectId, ref: "Concert"},
    typeTicketId: {type: String, require: true},
    ticketId: {type: Number, require: true},
    price: {type: String, default: '0'},
    status: {type: Number, default: 0}, // not active: 0, listed:1 , actived: 2
})

const Ticket = mongoose.model("tickets", TicketSchema)

export default Ticket