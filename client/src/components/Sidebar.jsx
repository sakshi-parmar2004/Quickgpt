import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../public/assets";
import moment from "moment";
import toast from "react-hot-toast";
import axios from "axios";
const Sidebar = ({ isMenuOpen, setIsMenuOpen }) => {

  const {
    user,
    chats,
    selectedChat,
    setSelectedChat,
    theme,
    navigate,
    setTheme,
    setUser,
    setIsLoggedIn,
    setToken,
    createChat,
   fetchUserChats,
    BASE_URL,
    token,
   
  } = useAppContext();
  const [search, setSearch] = useState("");
const logoutHandler=()=>{
  localStorage.removeItem('token');
  setUser(null);
  setIsLoggedIn(false);
  setToken(null);
  toast.success('Logout successful');
  navigate('/login');

}

const deleteChatHandler = async(chatID) => {
  // console.log("delete chat with id", chatID);
  // here we will make an api call to delete the chat from the database and then update the chats state in the frontend
    try {
      const response = await axios.delete(`${BASE_URL}/chats/delete/${chatID}`, {headers: {Authorization: `${token}`}});
      if(response.data.success){
        toast.success('Chat deleted successfully');
        // after deleting the chat we will fetch the updated list of chats from the database and update the chats state in the frontend
        await fetchUserChats();
      }
      else{
        toast.error('Failed to delete chat. Please try again.');
      }
      
    } catch (error) {
       toast.error(error.response.data.message || 'Failed to delete chat. Please try again.');
       console.error(error);  
    }
}

  return (
    <div
     className={`flex flex-col gap-4 h-screen min-w-72 p-5 dark:bg-gradient-to-b
     from-[#241224]/30 to-[#000000]/30 border-r border-[#80609F]/30 backdrop-blur-3xl transition-all duration-500 max-md:absolute 
     left-0 z-1  ${!isMenuOpen && "max-md:-translate-x-full"} `}
    >
    
      <img
        src={theme == "light" ? assets.logo_full : assets.logo_full_dark}
        alt=""
        className="w-full max-w-48"
      />
      {/* {new chat search button } */}
      <button
        className="w-full py-2 px-4 rounded-md bg-blue-500 hover:bg-blue-600 text-white font-semibold text-center cursor-pointer"
        onClick={() => createChat()}
      >
        <span  >+ New Chat</span>
      </button>

      {/* this is the search bar for the chats */}

      <div className="w-full p-2 rounded-md border flex justify-center gap-2 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-blue-500 dark:bg-gray-800 dark:text-white">
        <img src={assets.search_icon} className=" w-4 not-dark:invert" alt="" />
        <input
          type="text"
          placeholder="Search chats"
          className="outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {chats.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 mt-4">
          No chats available. Start a new chat!
        </p>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400 mt-4">
          Recent Chats
        </p>
      )}

      <div className="flex flex-col gap-2 overflow-y-auto">
        {chats
          .filter((chat) =>
            chat.name
              ?( chat.name
                  .toLowerCase()
                  .includes(search.toLowerCase()))
              : true,
          )
          .map((chat) => (
            <div
              key={chat.id}
className={`p-2 rounded-md cursor-pointer flex justify-between group ${
  selectedChat?.id === chat.id
    ? "bg-blue-500 text-white"
    : "bg-gray-100 dark:bg-[#57317C]/10 dark:text-white"
}`}              onClick={() => {setSelectedChat(chat);
              navigate('/'); }}
            >
            <div>
              {chat.name ? chat.name : "New Chat"}
              <p>{moment(chat.updated_at).fromNow()}</p>
              </div>
              <img src={assets.bin_icon} 
              onClick={()=>deleteChatHandler(selectedChat.id)}
              alt="" className="hidden group-hover:block w-5 not-dark:invert" />
            </div>

          ))}
      </div>
     
     <div className="flex flex-col gap-2 mt-auto">
      <div
        className=" flex items-center gap-2 mt-auto dark:bg-gray-800 p-2 rounded-md cursor-pointer"
        onClick={() => navigate("/community")}
      >
        <img src={assets.gallery_icon} className="w-4 not-dark:invert" alt="" />
        <p>Community page</p>
      </div>
      <div
        className=" flex items-center gap-2 dark:bg-gray-800 p-2 rounded-md cursor-pointer"
        onClick={() => navigate("/credits")}
      >
        <img src={assets.diamond_icon} className="w-4 dark:invert" alt="" />
        <p>Credits page</p>
      </div>
      <div className=" flex items-center justify-between gap-2 dark:bg-gray-800 p-2 rounded-md cursor-pointer">
        <div className="flex justify-center gap-2">
          <img src={assets.theme_icon} className="w-4 not-dark:invert" alt="" />
          <p>{theme === "light" ? "Dark Mode" : "Light Mode"}</p>
        </div>
        <label
          className="switch"
          className=" relative inline-flex items-center cursor-pointer"
        >
          <input
            type="checkbox"
            onChange={() => setTheme(theme === "light" ? "dark" : "light")}
            className="sr-only peer"
            checked={theme === "dark"}
          />
          <div className="w-9 h-5 bg-gray-300 rounded-full peer-checked:bg-purple-600 transition-all"></div>
          <span className=" w-3 h-3 rounded-full bg-gray-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 peer-checked:bg-white"></span>
        </label>
      </div>
      {/* user accouunt settings and logout will be here in the future */}
       <div
        className=" flex items-center justify-between gap-2 mt-auto dark:bg-gray-800 p-2 rounded-md cursor-pointer" >
       
        <p className="flex items-center gap-2">
        {user &&  <img src={assets.user_icon} className="w-7 not-dark:invert" alt="" />}
        {user?.name || "Login to your account"}</p>
        {user &&  <img src={assets.logout_icon} className="w-7 not-dark:invert"
        onClick={logoutHandler} alt="" />}
      </div>
      </div>

      <img src={assets.close_icon}
      className="absolute top-2 right-2 w-4 not-dark:invert md:hidden cursor-pointer"
      onClick={()=>setIsMenuOpen(false)} alt="" />
    </div>
  );
};

export default Sidebar;
