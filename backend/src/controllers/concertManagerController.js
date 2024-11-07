import {ethers} from "ethers"

import platformContract from "../contracts/platform.js"
import Concert from "../models/concertModel.js"
import { ErrorHandler } from "../utils/errorHandle.js";
import { sendMail } from "../utils/sendMail.js";


export async function requestNewConcert(req, res, next){
    try{
        const {title, isOffline, type, location, description, timeStartSale, timeEndSale, maxTicketPurchase} = req.body.concertInfor
        const {tickets} = req.body
        const {accountId} = req
        if(!title || !isOffline || !type || !description || !timeStartSale || !timeEndSale || !tickets){
            throw new ErrorHandler("Missing concert infor", 400)
        }
        if(isOffline && !location){
            throw new ErrorHandler("Missing location for offline concert", 400)
        }
        if(date.now >= timeStartSale || timeStartSale >= timeEndSale || timeEndSale - timeStartSale > 30*24*60*60*1000){
            throw new ErrorHandler("Invalid sale time", 400)
        }
        let concertTickets = []
        let totalTicketSupply
        for (let i = 0; i < tickets.lenght; i++){
            const {name, price, totalSupply} = tickets[i]
            if(!name || ! price || !totalSupply){
                throw new ErrorHandler("Missing ticket infor", 400)
            }
            const newTicket = {
                ticketName: name,
                contractId: i,
                price,
                totalSupply,
            }
            totalTicketSupply += totalSupply
            concertTickets.push(newTicket)
        }

        await Concert.create({
            title,
            owner: accountId,
            isOffline,
            type,
            location,
            owner,
            description,
            tickets: concertTickets,
            timeStartSale,
            timeEndSale,
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

export async function getCreatedConcerts(req, res, next){
    const {accountId} = req
    const concerts = await Concert.find({owner: accountId})
    return res.status(200).json({
        success: concerts ? true : false,
        concerts
    })
}

export async function getPendingConcerts(req, res, next){
    const pendingConcerts = await Concert.find({status: 2})
    return res.status(200).json({pendingConcerts})
}

export async function setApproveConcert(req, res, next){
    const {concertId, approveStatus} = req.body
    const concert = await Concert.findById(concertId)
    if(!concert ){
        throw new ErrorHandler("Concert is not exist", 400)
    }
    if(concert.status !== 2) throw new ErrorHandler("Concert status is not pending", 400)
    if(approveStatus !== 1 || approveStatus !== 0) throw new ErrorHandler("Approve wrong status", 400)
    await concert.updateOne({status: approveStatus})
    const owner = concert.owner
    const html = approveStatus === 1 ? `<h2>The ${concert.title} is approved</h2>` : `<h2>The ${concert.title} is rejected</h2>`
    const subject = "Approve event"
    await sendMail({email: owner.email, subject, html})
    return res.status(200).json({
        success: true,
        message: "Set approve concert successfully"
    })
}

export async function getAllConcerts(req, res, next){
    const concerts = await Concert.find()
    return res.status(200).json({
        success: true,
        concerts
    })
}

