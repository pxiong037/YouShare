import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { IoMdAdd, IoMdSearch } from 'react-icons/io'
import { AiOutlineLogout } from 'react-icons/ai';
import { GoogleOAuthProvider, googleLogout } from "@react-oauth/google"
import Tooltip from '@mui/material/Tooltip';

const Navbar = ({ searchTerm, setSearchTerm, user }) => {
  const navigate = useNavigate();

  if(!user) return null;

  const logout = () => {
    localStorage.clear();
    googleLogout();
    navigate('/login');
  }

  return (
    <div className='flex gap-2 md:gap-5 w-full mt-5 pb-7'>
      <div className='flex justify-start items-center w-full px-2 rounded-md bg-white border-none outline-none focus-within:shadow-sm'>
        <IoMdSearch fontSize={21} className='ml-1'/>
        <input 
          type='text'
          onChange={(e) => setSearchTerm(e.target.value) }
          placeholder='Search'
          value={searchTerm}
          onFocus={() => navigate('/search') }
          className='p-2 w-full bg-white outline-none'
        />
      </div>
      <div className='flex gap-3'>
        <Tooltip title="View Profile">
          <Link to={`/user-profile/${user?._id}`} className='hidden md:block' >
            <img src={user?.image} alt='user' className='w-14 h-12 rounded-lg' />
          </Link>
        </Tooltip>
        <Tooltip title="Create Pin">
          <Link to='/create-pin' className='bg-black text-white opacity-70 hover:opacity-100 rounded-lg w-12 h-12 md:w-12 md:h-12 flex justify-center items-center' >
            <IoMdAdd />
          </Link>
        </Tooltip>
        {user && (
          <GoogleOAuthProvider clientId={`${process.env.REACT_APP_GOOGLE_API_TOKEN}`}>
            <Tooltip title="Logout">
              <button
                  type="button"
                  className="bg-black text-white opacity-70 hover:opacity-100 rounded-lg w-12 h-12 md:w-12 md:h-12 flex justify-center items-center"
                  onClick={logout}
                >
                  <AiOutlineLogout className='text-white text-xl rounded-3xl hover:shadow-md' fontSize={21} />
              </button>
            </Tooltip>
          </GoogleOAuthProvider>
        )}
      </div>
    </div>
  )
}

export default Navbar