import express from "express";
import * as userInfoController from './../controllers/userInfo-controller.js';
import * as SendMeetingController from '../controllers/sendMeetingLink-controller.js';

const router = express.Router();

// Code to get all the users and add a new user by a post request
router.route('/userInfo')
    .post(userInfoController.post)
    .get(userInfoController.find);

// Code to get, put and delete user by id
router.route('/userInfo/:id')
    .get(userInfoController.get)
    .put(userInfoController.update)
    .delete(userInfoController.remove)
    
router.route('/userInfo/sendMeetingLink/:id')
    .get(SendMeetingController.get)

export default router;
