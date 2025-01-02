import express from "express"

import { uploadCloudProduct } from "../middlewares/cloudinaryProduct.js"
import {authenticateToken, authenticateAdminRole} from "../middlewares/authMiddleware.js"
import {requestNewConcert, getPendingConcerts, setApproveConcert, getAllConcerts, searchConcert, getDetailConcerts, buyTicket } from "../controllers/concertManagerController.js"

const RouteConcertManager = express.Router()

RouteConcertManager.route('/new').post(uploadCloudProduct.single('file'),authenticateToken, requestNewConcert)
RouteConcertManager.route('/').get(getAllConcerts)
RouteConcertManager.route('/detail/:concertId').get(getDetailConcerts)
RouteConcertManager.route('/pending').get(authenticateToken, authenticateAdminRole, getPendingConcerts)
RouteConcertManager.route('/approve').post(authenticateToken, authenticateAdminRole, setApproveConcert)
RouteConcertManager.route('/search').get(searchConcert)
RouteConcertManager.route('/buy/:concertId').post(authenticateToken, buyTicket)

export default RouteConcertManager