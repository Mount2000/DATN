import express from "express"

import {authenticateToken} from "../middlewares/authMiddleware.js"
import { getUser, getCreatedConcerts, getBoughtTickets, getBoughtConcertTickets } from "../controllers/userController.js"

const RouteUser = express.Router()


RouteUser.route('/getUser').get(authenticateToken, getUser)
RouteUser.route('/created').get(authenticateToken, getCreatedConcerts)
RouteUser.route('/bought').get(authenticateToken, getBoughtTickets)
RouteUser.route('/boughtConcert/:concertId').get(authenticateToken, getBoughtConcertTickets)

export default RouteUser;