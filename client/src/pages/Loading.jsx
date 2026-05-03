import React, { useEffect } from 'react'
import { useAppContext } from '../context/AppContext';

const Loading = () => {
   const{navigate} =useAppContext();
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/')
    }
    , 5000);
    return () => clearTimeout(timer);
  }, []);
 
  return (
    <div className='w-full h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#241224]/30 to-[#000000]/30'>
      <h2 className=' '>Loading...</h2>
      <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500'></div>
    </div>
  )
}

export default Loading
