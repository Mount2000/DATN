import Ticket from "../models/ticketModel.js";
import Concert from "../models/concertModel.js";
import { buyList } from "../contracts/platform.js";
import { ErrorHandler } from "../utils/errorHandle.js";

export async function getListedTicket(req, res, next) {
    try{
        const {concertId} = req.params
        const tickets = await Ticket.find({concertId, status: 1})
        const concert = await Concert.findById(concertId);
        let data = []
        
        for (const ticket of tickets) {

            const ticketInfor = {
                id: ticket._id,
                concertLogo: concert.logo,
                concertTitle: concert.title,
                typeTicketId: ticket.typeTicketId,
                ticketId: ticket.ticketId,
                ticketName: (concert.tickets)[ticket.typeTicketId].ticketName,
                status: ticket.status,
                price: ticket.price,
            };
            data.push(ticketInfor);
        }
        return res.status(200).json({
            success: true,
            metadata: {
                data,
                ticketType: concert.tickets,
            },
        })
    }
    catch(err){
        next(err)
    }
}

export async function getListedConcerts(req, res, next) {
    try{
        const concerts = await Concert.find({status: 1, timeStartConcert: {$gt: Date.now()}})
        return res.status(200).json({
            success: true,
            metadata: concerts
        })
    }
    catch(err){
        next(err)
    }
}

export async function buyListTicket (req, res, next) {
    try{
        const {account} = req
        const {ticketId} = req.body
        const ticket = await Ticket.findById(ticketId)
        if(!ticket) throw new ErrorHandler("Bad request", 400)
        const concert = await Concert.findById(ticket.concertId)
        await buyList(account.privateKey, concert.address, ticket.typeTicketId, ticket.price)
        await ticket.updateOne({owner: account, price: 0, status: 0})
        return res.status(200).json({
            success: true,
        })
    }
    catch(err){
        next(err)
    }
}