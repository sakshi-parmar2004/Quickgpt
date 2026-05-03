import React from 'react'
import { useLocation } from 'react-router-dom';
const PaymentSuccess = () => {
 const location = useLocation();
  const query = new URLSearchParams(location.search);
  const paymentId = query.get("reference");
  return (
    <div className='w-full h-screen flex flex-col items-center justify-center gap-4'>
      <h1 className='text-2xl font-bold'>Order Successful</h1>
        <p className='text-lg'>Thank you for your purchase! Your order has been successfully processed.</p>
        <p className='text-md'> Your payment reference number is: {paymentId}</p>
    </div>
  )
}

export default PaymentSuccess;
