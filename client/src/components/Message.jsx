import React, { use } from 'react'
import { assets } from '../public/assets'
import moment from 'moment'
import Moment from 'react-markdown'
import Markdown from 'react-markdown'
import { useEffect } from 'react'
import Prism from 'prismjs'

const Message = ({message , key}) => {
  useEffect(() => { 
    Prism.highlightAll();
    //this is used to highlight the code blocks in the messages using prismjs
  }, [message.content]);

  return (
    <div className=''>
      { message.role === 'user' ? (
          <div className='flex justify-end mb-2'>
            <div className='max-w-xs px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600  text-gray-800 dark:bg-gray-700 dark:text-gray-200'>
                <span>{message.content}</span>
                <p className='text-gray-600'>{moment(message.timestamp).fromNow()}</p>
              
            </div>
            <img src={assets.user_icon} alt="" />
          </div> ) : (
          <div className='flex justify-start mb-2'>
            <div className='max-w-2xl px-4 py-2 rounded-lg text-gray-800 dark:bg-gray-700 dark:text-gray-200'>
              {
                message.isImage?(
                  <div className='flex flex-col gap-2 '>
                    <img src={message.content} alt="message image" className='w-full rounded-lg' />
                  </div>
                ):(<span className='text-gray-800 dark:text-primary reset-tw'><Markdown>{message.content}</Markdown></span>)
              }
                        <p className='text-gray-500'>{moment(message.timestamp).fromNow()}</p>
            </div>
          </div>
        ) 
      }
    </div>
  )
}

export default Message
