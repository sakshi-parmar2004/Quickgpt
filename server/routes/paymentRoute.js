import express from 'express'
import { create_order, payment_verification } from '../controller/paymentController.js';
import { protectRoute } from '../middleware/protect.js';

export const paymentRouter  = express.Router();

paymentRouter.post('/checkout' , create_order);
paymentRouter.post('/verification' , payment_verification );

