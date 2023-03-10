import React, { useState, useRef, useEffect } from 'react'
import { HiMenu } from 'react-icons/hi'
import { AiFillCloseCircle } from 'react-icons/ai'
import { Link, Route, Routes } from 'react-router-dom'
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';

import { Sidebar, UserProfile } from '../components/index'
import Pins from './Pins'
import { userQuery } from '../utils/data'
import { client } from '../client'
import logo from '../assets/YouShareTitle.png'
import { fetchUser } from '../utils/fetchUser'

const Home = () => {
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [user, setUser] = useState();
  const scrollRef = useRef(null);
  const userInfo = fetchUser();

  useEffect(() => {
    const query = userQuery(userInfo?.sub);

    client.fetch(query).then((data) => {
      setUser(data[0]);
    });
  }, []);

  useEffect(() => {
    scrollRef.current.scrollTo(0, 0);
  });

  return (
    <div className='flex bg-gray-50 md:flex-row flex-col h-screen transaction-height duration-75 ease-out'>
      <div className='hidden md:flex h-screen flex-initial'>
        <Sidebar user={user && user}/>
      </div>
      <div className='flex md:hidden flex-row'>
        <div className="p-2 w-full flex flex-row justify-between items-center shadow-md">
          <Tooltip title="Options">
            <IconButton className='cursor-pointer' onClick={() => setToggleSidebar(true)}>
              <HiMenu fontSize={40}/>
            </IconButton>
          </Tooltip>
          <Tooltip title="Home">
            <Link to='/'>
              <img src={logo} alt='logo' className='w-28'/>
            </Link>
          </Tooltip>
          <Tooltip title="View Profile">
            <Link to={`/user-profile/${user?._id}`}>
              <img src={`${user?.image}`} alt='logo' className='w-14 rounded-lg'/>
            </Link>
          </Tooltip>
        </div>
      </div>
      {toggleSidebar && (
        <div className='fixed bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in'>
          <div className='absolute w-full flex justify-end items-center p-2'>
            <AiFillCloseCircle fontSize={30} className='cursor-pointer' onClick={() => setToggleSidebar(false)}/>
          </div>
          <Sidebar user={user && user} closeToggle={setToggleSidebar}/>
        </div>
      )}
      <div className="pb-2 flex-1 h-screen overflow-y-scroll" ref={scrollRef}>
        <Routes>
          <Route path="/user-profile/:userId" element={<UserProfile />} />
          <Route path="/*" element={<Pins user={user && user} />} />
        </Routes>
      </div>
    </div>
  )
}

export default Home