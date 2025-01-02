import Ticket from "../models/ticketModel";
import Concert from "../models/concertModel";

export async function getListedTicket(req, res, next) {
    try{
        
        
    }
    catch(err){
        next(err)
    }
}

export async function getListedConcert(req, res, next) {
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