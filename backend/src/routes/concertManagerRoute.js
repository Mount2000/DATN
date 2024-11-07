import express from "express"

import {authenticateToken, authenticateAdminRole} from "../middlewares/authMiddleware.js"
import {requestNewConcert, getCreatedConcerts, getPendingConcerts, setApproveConcert, getAllConcerts } from "../controllers/concertManagerController.js"

const RouteConcertManager = express.Router()

RouteConcertManager.route('/new').post(authenticateToken, requestNewConcert)
RouteConcertManager.route('/').get(getAllConcerts)
RouteConcertManager.route('/created').get(authenticateToken, getCreatedConcerts)
RouteConcertManager.route('/pending').get(authenticateToken, authenticateAdminRole, getPendingConcerts)
RouteConcertManager.route('/approve').post(authenticateToken, authenticateAdminRole, setApproveConcert)

export default RouteConcertManager