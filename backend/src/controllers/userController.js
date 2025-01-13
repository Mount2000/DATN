import Ticket from "../models/ticketModel.js"
import Concert from "../models/concertModel.js"
import { getBallance, to16ByteBuffer, encryptData } from "../utils/auth.js"
import { ErrorHandler } from "../utils/errorHandle.js"
import { withdraw, withdrawAcountBallance } from "../contracts/platform.js"
import Account from "../models/accountModel.js"
import { list, unlist } from "../contracts/platform.js"
import { active } from "../contracts/concert.js"
import { sendMail } from "../utils/sendMail.js"
import { uploadImages } from "../utils/uploadFile.js"
import QRCode from "qrcode"

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
                is2FA: account.authtSecret ? true : false
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
        let concerts = {}
        let data = []
        for (const ticket of boughtTickets) {
            const concertId = ticket.concertId.toString()
            let ticketConcert = concerts[concertId]
            if(ticketConcert == undefined){
                const concert = await Concert.findById(ticket.concertId);
                concerts[concertId] = concert
                ticketConcert = concerts[concertId]
            }
            const ticketInfor = {
                id: ticket._id,
                concertLogo: ticketConcert.logo,
                concertTitle: ticketConcert.title,
                ticketId: ticket.ticketId,
                ticketName: (ticketConcert.tickets)[ticket.typeTicketId].ticketName,
                status: ticket.status,
                price: ticket.price,
                qrcode: ticket.qrcode,
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
    for (let concert of concerts){
        if((concert.timeStartConcert).getTime() < Date.now() ){
            const balance = await getBallance(concert.address)
            await Concert.findByIdAndUpdate(concert._id, {balance})
            concert = {... concert, balance}
        }
    }
    return res.status(200).json({
        success: concerts ? true : false,
        metadata: concerts
    })
}

export async function withdrawConcert(req, res, next) {
    try{
        const {account} = req
        const {concertId} = req.params
        const concert = await Concert.findById(concertId)
        if(account._id != concert.owner || Date(timeStartConcert).getTime() > Date.now() || concert.isWithdraw) throw new ErrorHandler("Authorize", 400)
        await withdraw()
        const newBalance = await getBallance(account.address)
        await Account.findByIdAndUpdate(account._id, {ballance: newBalance})
        await concert.updateOne({isWithdraw: true, balance: 0})
        return res.status(200).json({
            success: true,
        })
    }
    catch(err){
        next(err)
    }
}

export async function listTicket(req, res, next) {
    try{
        const {account} = req
        const {ticketId, price} = req.body
        const ticket = await Ticket.findById(ticketId)
        if(!ticket) throw new ErrorHandler("Bad request", 400)
        if(ticket.owner.toString() != account._id.toString() || ticket.status != 0) throw new ErrorHandler("Authorize", 400)
        const concert = await Concert.findById(ticket.concertId)
        await list(account.privateKey, concert.address, ticket.ticketId, price)
        await ticket.updateOne({status: 1, price})
        return res.status(200).json({
            success: true,
        })
    }
    catch(err){
        next(err)
    }
}

export async function unlistTicket(req, res, next) {
    try{
        const {account} = req
        const {ticketId} = req.body
        const ticket = await Ticket.findById(ticketId)
        console.log(ticket.ticketId)
        if(!ticket) throw new ErrorHandler("Bad request", 400)
        if(ticket.owner.toString() != account._id.toString() || ticket.status != 1) throw new ErrorHandler("Authorize", 400)
        const concert = await Concert.findById(ticket.concertId)
        console.log(concert.address)
        await unlist(concert.address, ticket.ticketId)
        await ticket.updateOne({status: 0, price: 0})
        return res.status(200).json({
            success: true,
        })
    }
    catch(err){
        next(err)
    }
}

export async function activeTicket(req, res, next) {
    try{
        const {account} = req
        const {ticketId} = req.body
        const ticket = await Ticket.findById(ticketId)
        if(!ticket || ticket.owner.toString() != account._id || ticket.status != 0) throw new ErrorHandler("Bad request", 400)
        const concert = await Concert.findById(ticket.concertId)
        await active(account.privateKey, concert.address, ticket.ticketId)
        const iv = to16ByteBuffer(ticket.concertId)
        const activeCode = encryptData(ticket.ticketId.toString(), iv)
        const qrcode = await QRCode.toDataURL(activeCode.encryptedData.toString())
        await ticket.updateOne({status: 2, qrcode})
        return res.status(200).json({
            success: true,
            metadata: qrcode
        })
    }
    catch(err){
        next(err)
    }
}

export async function withdrawAcount(req, res, next) {
    try{
        const {account} = req
        const {withdrawAddress, withdrawAmount} = req.body
        await withdrawAcountBallance(account.privateKey, withdrawAddress, withdrawAmount.toString())
        const {address, ballance} = account
        const newBallance = await getBallance(address)
        if(newBallance != ballance){
        await account.updateOne({
            ballance: newBallance
        })
        }
        return res.status(200).json({
            success: true,
            metadata: newBallance,
        })
    }
    catch(err){
        next(err)
    }
}