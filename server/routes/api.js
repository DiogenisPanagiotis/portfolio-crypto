import express from "express";
import User from "../models/UserModel"
const controller = require('../controllers/controller.js')

const router = express.Router()

router.route('/users')
	.get(controller.getUsers)
	.post(controller.addUser)

export default router
