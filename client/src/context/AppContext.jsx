import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate  } from "react-router-dom";
import { dummyChats, dummyUserData } from "../public/assets";
import axios from "axios";
import toast from "react-hot-toast";

//creates a context for the app
const AppContext = createContext();

//creates a provider component that will wrap the app and provide the global state to all components
export const AppContextProvider = ({ children }) => {


    const navigate = useNavigate();
    const[isLoggedIn,setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedChat, setSelectedChat] = useState(null);
    const[chats, setChats] = useState([]);
    const [messages, setMessages] = useState([]);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const BASE_URL = 'http://localhost:8000/api';
    const[token, setToken] = useState(localStorage.getItem('token') || null);
  
    const fetchUser = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/auth/get-user`, {headers: {Authorization: `${token}`}});
            //    console.log(response);
        setUser(response.data.user);
        } catch (error) {
            setError(error.response.data.message);
        }
        finally{
            setLoading(false);
        }
    }
    const createChat = async () => {
        try {
            if(!user)
            {
                toast('User not found. Please login again.');
                navigate('/login');
                return;
            }
            await axios.get(`${BASE_URL}/chats/create`, {headers: {Authorization: `${token}`}});
             await fetchUserChats();
        } catch (error) {
            toast.error(error.response.data.message || 'Failed to create chat. Please try again.');

        }
    }
    const fetchUserChats = async () => {
    
        try {
            const {data} = await axios.get(`${BASE_URL}/chats/get`, {headers: {Authorization: `${token}`}});
            if(data.success)
            {
                setChats(data.chats);
                if(data.chats.length == 0){
                    await createChat();
                    return fetchUserChats();
                }
                else{
                
                    setSelectedChat(data.chats[0]);
                }
            }
            else{
                toast.error(data.message || 'Failed to fetch chats. Please try again.');
            }
            
        } catch (error) {
            toast.error(error.response.data.message || 'Failed to fetch chats. Please try again.');
        }
        
    }

    const getChatMessages = async (chatId) => {
        try {
            const {data} = await axios.get(`${BASE_URL}/message/text_messages/${chatId}`, {headers: {Authorization: token}});
            if(data.success)            {
                setMessages(data.messages);
                // console.log("messages",data.messages);
            }
            else{
                toast.error(data.message || 'Failed to fetch messages. Please try again.');
            }
        } catch (error) {
            toast.error(error.response.data.message || 'Failed to fetch messages. Please try again.');
        }
    }

    useEffect(() => {
        if(selectedChat)
        {
            getChatMessages(selectedChat.id);
        }
    }, [selectedChat , messages.length]);
   

   useEffect(() => {
     if(!token)
     {
        setUser(null);
        setIsLoggedIn(false);
        setLoading(false);
        return;
     }
        fetchUser();
    }, [token]);

    useEffect(() => {
        if(user){
        fetchUserChats();
        }
        else
        {
            setChats([]);
        setSelectedChat(null);
        }
    }   , [user]);
    
    useEffect(() => {
        if(theme === 'light'){
            document.documentElement.classList.add('dark');
        }   
        else{
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }
    ,[theme]);
   


  const value = {
    // Define your global state here
    user,
    setUser,
    loading,
    setLoading,
    error,
    setError,
    selectedChat,   
    setSelectedChat,
    chats,
    setChats,
    messages,
    setMessages,
    theme,
    setTheme ,   
    navigate,
    isLoggedIn,
    setIsLoggedIn,
    BASE_URL,
    token,
    setToken,
    createChat,
    fetchUserChats
  };   
  
  // Provide the global state to the children components
    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}   
//easy way of using the context in any component
export const useAppContext = ()=> useContext(AppContext);