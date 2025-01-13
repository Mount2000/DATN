import express from "express"

import {authenticateToken} from "../middlewares/authMiddleware.js"
import { getUser, getCreatedConcerts, getBoughtTickets, getBoughtConcertTickets, withdrawConcert, listTicket, unlistTicket, activeTicket, withdrawAcount } from "../controllers/userController.js"

const RouteUser = express.Router()


RouteUser.route('/getUser').get(authenticateToken, getUser)
RouteUser.route('/created').get(authenticateToken, getCreatedConcerts)
RouteUser.route('/bought').get(authenticateToken, getBoughtTickets)
RouteUser.route('/boughtConcert/:concertId').get(authenticateToken, getBoughtConcertTickets)
RouteUser.route('/withdrawConcert/:concertId').post(authenticateToken, withdrawConcert)
RouteUser.route('/list').post(authenticateToken, listTicket)
RouteUser.route('/unlist').post(authenticateToken, unlistTicket)
RouteUser.route('/active').post(authenticateToken, activeTicket)
RouteUser.route('/withdrawAccount').post(authenticateToken, withdrawAcount)

export default RouteUser;