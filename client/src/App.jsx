import React, { use, useState } from 'react'
import Sidebar from './components/Sidebar'
import Login from './pages/Login'
import Credits from './pages/Credits'
import Loading from './pages/Loading'
import Community from './pages/Community'
import { Routes, Route, useLocation } from 'react-router-dom'
import Chatbox from './components/Chatbox'
import { assets } from './public/assets'
import './public/prism.css';
import { useAppContext } from './context/AppContext'
import { Toaster } from 'react-hot-toast'
const App = () => {
    const[isMenuOpen,setIsMenuOpen] = useState(true);
    const {isLoggedIn,user,loading} = useAppContext();
    const {pathname} = useLocation();
    if(pathname== '/loading' || loading)
    {
      return <Loading/>
    }
  return (
    <>
    <Toaster/>
    {!isMenuOpen && <img src={assets.menu_icon} className=" absolute top-3 left-3  w-6 m-4 not-dark:invert md:hidden 
    cursor-pointer " onClick={()=>setIsMenuOpen(true)} alt="" />}

    {user?(<div className='dark:bg-gradient-to-b from-[#242124] to-[#000000] dark:text-white'>
    <div className='flex h-screen w-screen'>
     {  <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen}  /> }
      <Routes>
        <Route path='/' element={ <Chatbox/> }/>
        <Route path='/credits' element={ <Credits/> }/>
        <Route path='/loading' element={<Loading/>}/>
        <Route path='/community' element={<Community/> }/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Login/>}/>
      </Routes> 
    </div>
    </div>):
    <div className='dark:bg-gradient-to-b from-[#242124] to-[#000000] dark:text-white'>
    <Login/>
    </div>}
    </>
  )
}

export default App
