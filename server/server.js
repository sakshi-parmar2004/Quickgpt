import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';
import router from './routes/authRoutes.js';
import cors from 'cors';
import Razorpay from 'razorpay'
import { paymentRouter } from './routes/paymentRoute.js';
import { chatRouter } from './routes/chatRoute.js';
import { messageRouter } from './routes/messageRoute.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.get('/', (req, res) => {
  res.send('Hello World!');
});

export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
app.get('/api-key', (req, res) => {
    res.send({ success: true, key: process.env.RAZORPAY_KEY });
});
app.use('/api/auth',router);
app.use('/api/payment',paymentRouter);
app.use('/api/chats' , chatRouter);
app.use('/api/message',messageRouter)
connectDB();

export default app;