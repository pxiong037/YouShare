import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { MdDownloadForOffline } from 'react-icons/md';
import { AiTwotoneDelete, AiFillHeart } from 'react-icons/ai';
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { fetchUser } from '../utils/fetchUser';
import { client, urlFor } from '../client';

const Pin = ({ pin }) => {
    const [postHovered, setPostHovered] = useState(false);

    const navigate = useNavigate();
    const user = fetchUser();
    const alreadySaved = !!pin?.save?.filter((item) => item?.postedBy?._id === user?.sub).length
    
    const togglePinSave = (id) => {
        if(!alreadySaved){
            client
                .patch(id)
                .setIfMissing({ save: []})
                .insert('after', 'save[-1]', [{
                    _key: uuidv4(),
                    userId: user?.sub,
                    postedBy: {
                        _type: 'postedBy',
                        _ref: user?.sub
                    }
                }])
                .commit()
                .then(() => {
                    window.location.reload();
                });
        } else {
            client
                .patch(id)
                .unset([`save[userId=="${user?.sub}"]`])
                .commit()
                .then(() => {
                    window.location.reload();
                });
        }
    }

    const deletePin = (id) => {
        client
            .delete(id)
            .then(() => {
                window.location.reload();
            });
    }

    const { postedBy, image, _id, destination } = pin;

    return (
        <div className='m-2'>
            <div
                onMouseEnter={() => setPostHovered(true)}
                onMouseLeave={() => setPostHovered(false)}
                onClick={() => navigate(`/pin-detail/${_id}`)}
                className='relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out'
            >
                <img className="rounded-lg w-full " src={`${(urlFor(image).width(250).url())}`} alt="user-post" />
                {postHovered && (
                    <div 
                        className='absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50'
                        style={{ height: '100%' }}
                    >
                        <div className='flex items-center justify-between'>
                            <div className='flex gap-2'>
                                <a 
                                    href={`${image?.asset?.url}?dl=`}
                                    download
                                    onClick={(e) => e.stopPropagation() }
                                    className="bg-white top-0 w-8 h-8 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                                >
                                    <Tooltip title="Download">
                                        <IconButton>
                                            <MdDownloadForOffline />
                                        </IconButton>
                                    </Tooltip>
                                </a>
                            </div>
                            {alreadySaved ? (
                                <Tooltip title="Liked">
                                    <IconButton onClick={(e) => { e.stopPropagation(); togglePinSave(_id); }}>
                                        <AiFillHeart size={28} className='text-red-600 opacity-70 hover:opacity-100 text-xl rounded-3xl hover:shadow-md' />
                                    </IconButton>
                                </Tooltip>
                            ) : (
                                <Tooltip title="Like">
                                    <IconButton onClick={(e) => { e.stopPropagation(); togglePinSave(_id); }}>
                                        <AiFillHeart size={28} className='text-white opacity-70 hover:opacity-100 text-xl rounded-3xl hover:shadow-md' />
                                    </IconButton>
                                </Tooltip>
                            )}
                        </div>
                        <div className='flex justify-between items-center gap-2 w-full'>
                            {destination && (
                                <a
                                    href={destination}
                                    onClick={(e) => { e.stopPropagation(); }}
                                    target='_blank'
                                    rel='noreferrer'
                                    className='bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:100 hover:shadow-md'
                                >
                                    <BsFillArrowUpRightCircleFill />
                                    {destination.length > 15 ? `${destination.slice(0, 15)}...` : destination}
                                </a>
                            )}
                            {postedBy?._id === user?.sub && (
                                <Tooltip title="Delete">
                                    <IconButton onClick={(e) => { e.stopPropagation(); deletePin(_id); }}>
                                        <AiTwotoneDelete size={28} className='text-white opacity-70 hover:opacity-100 text-xl rounded-3xl hover:shadow-md' />
                                    </IconButton>
                                </Tooltip>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <Link to={`/user-profile/${postedBy?._id}`} className='flex gap-2 mt-2 items-center'>
                <img 
                    className='w-8 h-8 rounded-full object-cover'
                    src={postedBy?.image}
                    alt='user-profile'
                />
                <p className='font-semibold capitalize'>
                    {postedBy?.userName}
                </p>
            </Link>
        </div>
    )
}

export default Pin