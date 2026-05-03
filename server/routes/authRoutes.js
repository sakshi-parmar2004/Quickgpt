import express from 'express';
import { getPublishedImages, getUser, login, logout, signup } from '../controller/authController.js';
import { protectRoute } from '../middleware/protect.js';

const router = express.Router();

router.post('/signup', signup );
router.post('/login', login);
router.post('/logout', logout); 
router.get('/get-user', protectRoute,getUser);
router.get('/published-images', protectRoute , getPublishedImages )
export default router;
