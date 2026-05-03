import React, { useEffect, useState } from 'react'
import { dummyPlans } from '../public/assets';
import Loading from './Loading';
import axios from 'axios'

const Credits = () => {
  const [plans, setPlans] =useState([]);
  const [loading, setLoading] = useState(true);
  const fetchPlans=()=>
  {
    // this is the function from where we will fetch the plans from the backend and update the state accordingly
    setPlans(dummyPlans);
    setLoading(false);
  }
  useEffect(() => {
    fetchPlans();
  }, []);
  if(loading){
    return <Loading/>
  }
 const checkoutHandler = async(amount) => {
        // Simulate a checkout process
        const key = await axios.get('http://localhost:8000/api-key');
        // console.log(key);
        const {data: {order}} = await axios.post('http://localhost:8000/api/payment/checkout', { amount})
        const options = {
        key: key.data.key, // Replace with your Razorpay key_id
        amount: order.amount, // Amount is in currency subunits.
        currency: 'INR',
        name: 'Acme Corp',
        description: 'Test Transaction',
        order_id: order.id, // This is the order_id created in the backend
        callback_url: 'http://localhost:8000/api/payment/verification', // Your success URL
        prefill: {
          name: 'Gaurav Kumar',
          email: 'gaurav.kumar@example.com',
          contact: '9999999999'
        },
        theme: {
          color: '#F37254'
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    }

  return (
    <div className=' mx-auto px-4  overflow-y-scroll h-screen max-w-7xl sm:px-6 lg:px-8 py-12 '>
      <h1 className='text-3xl font-bold  text-center mb-10 xl:mt-30'>Credits Page</h1>
      <div className=' flex flex-wrap justify-center gap-8'>
   {
     plans.length > 0 ? (
       plans.map((plan, index) => (
         <div key={index} className='dark:bg-purple-900 min-w-[300px] dark:border-purple-700 dark:text-primary border
          rounded-lg p-6 mb-4 flex flex-col 
         gap-2 cursor-pointer shadow hover:shadow-lg transition-shadow duration-300'>
         <div className='flex-1'>
            <h2 className='font-semibold text-xl'>{plan.name}</h2>
            <p className='text-purple-600 dark:text-purple-300 text-2xl font-bold'>${plan.price}</p>
            <span>{plan.Credits} Credits</span>
            </div>
            <ul className='list-disc list-inside text-gray-700 dark:text-gray-300'>
      {  plan.features.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
       </ul>
       <button className='bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded cursor-pointer'
       onClick={()=>checkoutHandler(plan.price)}>
         Buy Now
       </button>
         </div>
       ) 
       )
        ):
       (
         <p>No plans available</p>
        )  

   }
 </div>
    </div>
  )
}

export default Credits
