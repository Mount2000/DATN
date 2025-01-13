import express from "express"

import {authenticateToken} from "../middlewares/authMiddleware.js"
import { getListedConcerts, getListedTicket, buyListTicket } from "../controllers/marketplaceController.js"

const RouteMarketplace = express.Router()


RouteMarketplace.route('/getListedConcerts').get(getListedConcerts)
RouteMarketplace.route('/getListedTicket/:concertId').get(getListedTicket)
RouteMarketplace.route('/buyListTicket').post(authenticateToken, buyListTicket)

export default RouteMarketplace;