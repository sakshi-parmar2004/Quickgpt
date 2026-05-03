import express from 'express'
import { createChat, deleteChat, getChats } from '../controller/chatController.js';
import { protectRoute } from '../middleware/protect.js';

export const chatRouter = express.Router();

chatRouter.get('/get',protectRoute ,getChats);
chatRouter.get('/create',protectRoute,createChat);
chatRouter.delete('/delete/:chatId',protectRoute,deleteChat);

