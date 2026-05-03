import React, { useRef } from 'react'
import { useState } from 'react'
import { useAppContext } from '../context/AppContext';
import { useEffect } from 'react';
import Loading from '../pages/Loading';
import { assets } from '../public/assets';
import Message from './Message';
import toast from 'react-hot-toast';
import axios from 'axios';
const Chatbox = () => {

  const{ theme , selectedChat,user,navigate,token,BASE_URL,messages,setMessages} = useAppContext(); 
  // const [messages, setMessages] = useState([]);
  const[loading , setLoading] = useState(false);

  const[prompt, setPrompt] = useState('');
  const[mode,setMode] = useState('text');
  const[isPublishing, setIsPublishing] = useState(false);
  const containerRef = useRef(null);

   
 
  const handleSubmit = async (e) => { 
   
    // this is the part from where we will send the prompt to the backend and get the response and update the messages state  
      try {
        e.preventDefault();
        if(!user)
        {
          toast('User not found. Please login again.');
          navigate('/login');
          return;
        }
        const promptToSend = prompt;
        setPrompt('');
        setMessages([...messages, {role:'user', content: promptToSend, timestamp: Date.now(),isImage:false, isPublished:false}]);
         setLoading(true);
        //  console.log("selected chat id ^ prompt", selectedChat.id,promptToSend);
        // console.log("token", token);
        // console.log("selectedChat", selectedChat.id);
const { data } = await axios.post(
  `${BASE_URL}/message/${mode}`,
  {
    chatID: selectedChat.id,
    prompt: promptToSend,
    isPublished: isPublishing
  },
  {
    headers: {
      Authorization: token
    }
  }
);
        // console.log("response from backend", data);
        if(data.success)        {
          setMessages(prevMessages => [...prevMessages, {role:'assistant', content: data.reply.content, timestamp: Date.now(), isImage: mode === 'image', isPublished: isPublishing}]);
          // console.log("updated messages", messages);
        }
          setLoading(false);

      } catch (error) {
        toast.error(error.message || 'An error occurred while sending the message. Please try again.');
        setLoading(false);
      }
  }

  
   useEffect(() => {
    if(containerRef.current){
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth'
      });   }
    }, [messages]);

    
  return (
    <div className='flex-1 flex flex-col justify-between items-center p-4 rounded-lg  '>
      <div ref={containerRef} className='flex-1 overflow-y-scroll mb-4'>
        {messages.length == 0 ? (
          <div className='flex flex-col items-center justify-center h-full gap-4'>
            <img src={theme === 'dark' ? assets.logo_full_dark : assets.logo_full} alt="No messages" className='w-48' />
            <p className='text-gray-500 dark:text-gray-400'>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <Message message={message} key={index} />
          ))
        )}
        {
          loading && (
            <div className='loader flex justify-center items-center gap-2'>
              <div className=' animate-bounce rounded-lg h-1.5 w-1.5 border-b-2 bg-gray-500 dark:bg-gray-600 '></div>
              <div className=' animate-bounce rounded-lg h-1.5 w-1.5 border-b-2 bg-gray-500 dark:bg-gray-600'></div>
              <div className=' animate-bounce rounded-lg h-1.5 w-1.5 border-b-2 bg-gray-500 dark:bg-gray-600'></div>

            </div>
          )
        }
      </div>
      {mode === 'image' && (
        <div className='flex items-center justify-center gap-4 p-2'>
          <p>Publish the image to the Community page</p>
          <input type="checkbox"
          value={isPublishing}
          onChange={(e)=>setIsPublishing(e.target.value)} className='cursor-pointer' />
        </div>
      )}
      {/* Prompt Box */}
      <form
       className=' bg-primary/30 w-full max-w-2xl  rounded-full flex items-center justify-center gap-4 p-2'
       onSubmit={handleSubmit}
       >
        <select 
          value={mode}
          onChange={(e) => setMode(e.target.value)}
        className=' bg-transparent outline-none text-sm text-gray-500 dark:text-gray-400 cursor-pointer'>
          <option value="text">Text</option>
          <option value="image">Image</option>
          {/* <option value="file">File</option> */}
        </select>
        <input type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
         placeholder='Type your message here...' className='outline-none w-full' />
        <button
         disabled={loading}
         className=' text-white px-4 py-2 rounded-lg'>
        <img src={loading?assets.stop_icon:assets.send_icon} alt="Send" className='cursor-pointer' /></button> 
      </form>
    </div>
  )
}


export default Chatbox;
