import { deployConcert, buyTicketContract, getEmit, getTimestamp } from "../contracts/concert.js";
import Concert from "../models/concertModel.js"
import Ticket from "../models/ticketModel.js";
import Account from "../models/accountModel.js";
import { ErrorHandler } from "../utils/errorHandle.js";
import { sendMail } from "../utils/sendMail.js";
import { uploadImages, removeImage } from "../utils/uploadFile.js";


export async function requestNewConcert(req, res, next){
    try{
        const {title, isOffline, type, location, description, timeStartSale, timeEndSale, timeStartConcert, maxTicketPurchase} = req.body
        const tickets = JSON.parse(req.body.tickets)
        const {accountId} = req
        const images = req.file
        const results = await uploadImages(images.path);
        if(!title || !type || !description || !timeStartSale || !timeEndSale || !timeStartConcert || !tickets){
            throw new ErrorHandler("Missing concert infor", 400)
        }
        if(isOffline && !location){
            throw new ErrorHandler("Missing location for offline concert", 400)
        }
        let concertTickets = []
        let totalTicketSupply = 0
        for (let i = 0; i < Object.keys(tickets).length; i++){
            const {name, price, supply} = tickets[i]
            if(!name || !price || !supply){
                throw new ErrorHandler("Missing ticket infor", 400)
            }
            const newTicket = {
                ticketName: name,
                contractId: i,
                price,
                supply,
            }
            totalTicketSupply += parseFloat(supply)
            concertTickets.push(newTicket)
        }

        await Concert.create({
            title,
            owner: accountId,
            logo: results[0],
            isOffline,
            type,
            location,
            description,
            tickets: concertTickets,
            timeStartSale,
            timeEndSale,
            timeStartConcert,
            totalTicketSupply,
            maxTicketPurchase,
        })
        return res.status(200).json({
            success: true,
            message: "Create concert successfully",
        })
    }
    catch(err){
        next(err)
    }
}

export async function getPendingConcerts(req, res, next){
    const pendingConcerts = await Concert.find({status: 2})
    return res.status(200).json({
        success: true,
        metadata: pendingConcerts})
}

export async function setApproveConcert(req, res, next){
    let {concertId, approveStatus} = req.body
    const concert = await Concert.findById(concertId)
    const owner = await Account.findById(concert.owner)
    let concertAddress
    if(!concert ){
        throw new ErrorHandler("Concert is not exist", 400)
    }
    if(concert.status !== 2) throw new ErrorHandler("Concert status is not pending", 400)
    if(approveStatus === 0){
        const public_id = concert.logo.split('/')[7].split('.')[0]
        console.log(public_id)
        await removeImage(public_id)
    }
    else if(approveStatus === 1){
        const {privateKey} = owner
        const {timeStartSale, timeEndSale, tickets} = concert
        const timestamp = await getTimestamp()
        console.log(timestamp, timeStartSale.getTime()/1000, timeEndSale.getTime()/1000)
        const result = await deployConcert(privateKey, timeStartSale.getTime()/1000, timeEndSale.getTime()/1000, process.env.CONCERT_FEE, tickets)
        if(!result.error){
            concertAddress = result.result
        }
        else if(result.error.shortMessage === "insufficient funds for intrinsic transaction cost")
        {
            const html =  `<h2>Insufficient ballance</h2>`
            const subject =  "insufficient funds for create concert"
            await sendMail({email: owner.email, subject, html})
            throw new ErrorHandler("insufficient ballance for create concert", 400)
        }
        else {throw new ErrorHandler(result.error, 400)}
    }
    else throw new ErrorHandler("Approve wrong status", 400)
    const html = approveStatus === 1 ? `<h2>The ${concert.title} is approved</h2>` : `<h2>The ${concert.title} is rejected</h2>`
    const subject = approveStatus === 1 ? "Approve event" : "reject event"
    await sendMail({email: owner.email, subject, html})
    await concert.updateOne({status: approveStatus, address: concertAddress})
    return res.status(200).json({
        success: true,
        message: "Set approve concert successfully"
    })
}

export async function getAllConcerts(req, res, next){
    const concerts = await Concert.find({status: 1, timeEndSale: {$gt: Date.now()}})
    return res.status(200).json({
        success: true,
        metadata: concerts
    })
}

export async function searchConcert(req, res, next){
    const {searchKey} = req.body
    const concerts = await Concert.find({title: searchKey, status: 1})
    return res.status(200).json({
        success: true,
        metadata: concerts
    })
}

export async function getDetailConcerts(req, res, next){
    const {concertId} = req.params
    const concert = await Concert.findById(concertId)
    if(!concert) throw new ErrorHandler("concert do not exsit", 400)
    return res.status(200).json({
        success: true,
        metadata: concert
    })
}

export async function buyTicket(req, res, next) {
    try{
        const {cart} = req.body
        const {concertId} = req.params
        const concert = await Concert.findById(concertId)
        const account = req.account
        const boughtTickets = await Ticket.find({owner: account._id, concertId: concertId})
        const {address, tickets} = concert
        const {privateKey} = account
        let totalPayment = 0
        let handledCart = []
        Object.keys(cart).forEach((element) => {
            if(cart[element]!=0){
                for(let i = 0; i < cart[element]; i++){
                    handledCart.push(element)
                }
                concert.tickets[element].sold += cart[element]
                totalPayment += tickets[element].price * cart[element]
            }
        });
        if(handledCart.length + boughtTickets.length > concert.maxTicketPurchase) throw new ErrorHandler("Bad request", 400)
        const tx = await buyTicketContract(privateKey, address, handledCart, totalPayment)
        const receipt = await tx.wait()
        const ticketIds = await getEmit(receipt)
        let newTickets = []
        ticketIds.forEach( ticketId => {
            const newTicket = {
                owner: account._id,
                concertId,
                typeTicketId: ticketId%10,
                ticketId,
            }
            newTickets.push(newTicket)
        })
        await concert.save()
        await Ticket.insertMany(newTickets)
        return res.status(200).json({
            success: true
        })
    }
catch(error){
    next(error)
}
}