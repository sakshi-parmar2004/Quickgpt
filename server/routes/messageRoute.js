import express from 'express'
import { getmessagesController, imageController, textController } from '../controller/messageController.js';
import { protectRoute } from '../middleware/protect.js';

export const messageRouter = express.Router();

messageRouter.post('/text',protectRoute, textController);
messageRouter.post('/image',protectRoute ,imageController);
messageRouter.get('/text_messages/:chatID',protectRoute, getmessagesController);