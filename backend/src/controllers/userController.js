import Ticket from "../models/ticketModel.js"
import Concert from "../models/concertModel.js"

export async function getUser(req, res, next) {
    try{
        const {account} = req
        return res.status(200).json({
            success: true,
            metadata: {
                userName: account.userName,
                email: account.email,
                address: account.address,
                ballance: account.ballance,
                role: account.role,
            }
        })
    }
    catch(err){
        next(err)
    }
}

export async function getBoughtTickets(req, res, next) {
    try{
        const {account} = req
        const boughtTickets = await Ticket.find({owner: account._id})
        let concertInfor = {}
        let data = []
        for (const ticket of boughtTickets) {
            const concertId = ticket.concertId
            if(concertInfor[concertId] == undefined){
                const concert = await Concert.findById(ticket.concertId);
                concertInfor[concertId] = {
                    concertLogo: concert.logo,
                    concertTitle: concert.title,
                    ticketName: concert.tickets[ticket.typeTicketId].ticketName,
                }
            }
            const ticketInfor = {
                id: ticket._id,
                concertLogo: concertInfor[concertId].concertLogo,
                concertTitle: concertInfor[concertId].concertTitle,
                ticketId: ticket.ticketId,
                ticketName: concertInfor[concertId].ticketName,
                status: ticket.status,
                price: ticket.price,
            };
            data.push(ticketInfor);
        }
        return res.status(200).json({
            success: boughtTickets ? true : false,
            metadata: data,
        })
    }
    catch(err){
        next(err)
    }
}
export async function getBoughtConcertTickets(req, res, next) {
    try{
        const {account} = req
        const {concertId} = req.params
        const boughtTickets = await Ticket.find({owner: account._id, concertId})
        return res.status(200).json({
            success: boughtTickets ? true : false,
            metadata: boughtTickets,
        })
    }
    catch(err){
        next(err)
    }
}

export async function getCreatedConcerts(req, res, next){
    const {account} = req
    const concerts = await Concert.find({owner: account._id})
    return res.status(200).json({
        success: concerts ? true : false,
        metadata: concerts
    })
}