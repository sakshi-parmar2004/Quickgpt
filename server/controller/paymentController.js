import { client } from "../config/db.js";
import { instance } from "../server.js";
import crypto from 'crypto'
import axios from "axios";


export const create_order = async(req,res)=>
{
  
const options = {
        amount:(Number(req.body.amount))*100, // amount in the smallest currency unit
        currency: "INR",
        // receipt: "receipt#1",
    };  
    // console.log(options);
    const order = await instance.orders.create(options);
    // console.log("Created Order:", order);
    res.json({ success: true, order });

}


export const payment_verification = async (req,res)=>
{
    // console.log(" request body" ,req.body);
    const {  razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const secret = process.env.RAZORPAY_SECRET;
    const generated_signature = crypto
    .createHmac("sha256", secret)
    .update(body.toString())
    .digest("hex");
    
     const user = axios.get('api/auth/user', {
      headers: {
        Authorization: token
      }
    });
    // console.log("generated_signature", generated_signature);
    // console.log("razorpay_signature", razorpay_signature);
    const query ='INSERT INTO payments (razorpay_order_id,razorpay_payment_id,razorpay_signature) VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    ];
  if (generated_signature === razorpay_signature) {
    await client.query(query, values);
    return res.redirect(`http://localhost:5173/paymentSuccess?reference=${razorpay_payment_id}`);
  } else {
    return res.status(400).json({
      success: false,
      message: "Invalid signature"
    });  
}      
}