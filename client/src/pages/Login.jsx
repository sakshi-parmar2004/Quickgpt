import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext';
import axios from 'axios';
import BackgroundEffect from '../components/Background';
import { useLocation } from 'react-router-dom';


const Login = () => {
  //  const[isloginPage,setIsLoginPage] = useState(true);
  const {isLoggedIn,setIsLoggedIn,user,setUser,BASE_URL,navigate , token, setToken} = useAppContext();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const location = useLocation();
    const {pathname} = location;
   const handleLogin=async ()=>
   {
    // Perform login logic here (e.g., API call to authenticate user)
    // console.log(email,password,BASE_URL);
     const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: email,
      password: password,
    });
    // console.log(response);
     if(response.data.success){
      setUser(response.data.user);
      setIsLoggedIn(true);
      setToken(response.data.token);
      // console.log('Login successful');
      localStorage.setItem('token', response.data.token);
      navigate('/');
     }
     else{
      alert('Login failed. Please check your credentials and try again.');
      // console.log(response.data.message);
     }
    
   }
   const handleRegister= async()=>
   {
    // Perform registration logic here (e.g., API call to create a new user)
    // console.log(username,email,password,BASE_URL);
     const response = await axios.post( `${BASE_URL}/auth/signup`, {
      email: email,
      name: username,
      password: password
    });
    // console.log("check 1", response);
    if(response.data.success){
      // alert('Registration successful. Please login.');
      setUser(response.data.user);
      setIsLoggedIn(true);
      setToken(response.data.token);
      localStorage.setItem('token', response.data.token);
      navigate('/');
      // console.log('Signup successful');   
    }
    else{
      alert('Registration failed. Please try again.');
      console.log(response.data.message);
    }
   }
      
  return (
    <>
      { !isLoggedIn && pathname === '/login' && (
        <div className='w-full h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#241224]/30 to-[#000000]/30'>
          <h1 className='text-2xl font-bold text-white mb-4'>Login</h1>
          <form className='bg-white/10 p-6 rounded-md'
           onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <input type="email" 
            value={email}
            placeholder='Email'
            onChange={(e) => setEmail(e.target.value)}
            className='border p-2 rounded-md mb-4 w-full' />
            <input type="password" 
              value={password}
              placeholder='Password'
              onChange={(e) => setPassword(e.target.value)}
              className='border p-2 rounded-md mb-4 w-full' />
            <button type='submit' className='w-full py-2 px-4 rounded-md bg-blue-500 hover:bg-blue-600 text-white font-semibold text-center cursor-pointer'
           >
            Login
            </button>
            <p className='text-white text-sm mt-4'>
              Don't have an account?{' '}
              <button
                type='button'
                className='text-blue-500 hover:text-blue-600 font-semibold cursor-pointer'
                onClick={() => navigate('/register')}
              >
              Register
              </button>
            </p>
          </form>
        </div>
      )}
      {pathname === '/register' && (
        <div className='w-full h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#241224]/30 to-[#000000]/30'>
          <h1 className='text-2xl font-bold text-white mb-4'>Register</h1>
          <form className='bg-white/10 p-6 rounded-md' 
            onSubmit={(e)=>{
              e.preventDefault();
              handleRegister();
            }}>
            <input type="text" 
              placeholder='Username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
          className='border p-2 rounded-md mb-4 w-full' />
        <input type="email" 
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='border p-2 rounded-md mb-4 w-full' />
        <input type="password" 
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='border p-2 rounded-md mb-4 w-full' />
        <button type='submit'
        className='w-full py-2 px-4 rounded-md bg-blue-500 hover:bg-blue-600 text-white font-semibold text-center cursor-pointer'>Register</button>
         <p className='text-white text-sm mt-4'>
           Already have an account?{' '}
           <button
             type='button'
             className='text-blue-500 hover:text-blue-600 font-semibold cursor-pointer'
             onClick={() => navigate('/login')}
           >
             Login
           </button>
         </p>
        </form>
      
      </div>)}
    </>
  )
}

export default Login
