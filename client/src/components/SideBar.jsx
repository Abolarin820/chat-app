import {IoChatbubbleEllipses} from 'react-icons/io5'
import {FaImage, FaUserPlus, FaVideo} from 'react-icons/fa'
import { NavLink,Link, useNavigate } from 'react-router-dom'
import {BiLogOut} from 'react-icons/bi'
import Avater from '../components/Avater'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import EditUserDetails from './EditUserDetails'
import {FiArrowUpLeft} from 'react-icons/fi'
import SearchUser from './SearchUser'
import { logout } from '../redux/userSlice'



const SideBar = () => {

    const user = useSelector(state=> state?.user)
    const [editUserOpen, setEditUserOpen] = useState(false);
    const [allUsers, setAllUsers] = useState([]);
    const [openSearchUser, setOpenSearchUser] = useState(false)
    const socketConnection = useSelector(state=> state?.user?.socketConnection)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(()=>{
        if(socketConnection){
            socketConnection.emit('sidebar',user?._id)

            socketConnection.on("conversation", (data)=>{
                const conversation = data.map(conversationUser =>{
                    
                    if(conversationUser?.sender?._id === conversationUser?.receiver?._id){

                        return {
                            ...conversationUser,
                            userDetails:conversationUser?.sender
                        }
                    }else if(conversationUser?.receiver?._id !== user._id){
                        return {
                            ...conversationUser,
                            userDetails:conversationUser?.receiver
                        }
                    }else{
                        return {
                            ...conversationUser,
                            userDetails:conversationUser?.sender
                        }
                    }
                })
                setAllUsers(conversation)
            })
        }
    },[socketConnection,user])

    const handleLogout = ()=> {
        dispatch(logout())
        navigate('/email')
        localStorage.clear()
    }

  return (
    <div className="w-full h-full grid grid-cols-[48px,1fr] bg-white">
        <div className="bg-slate-100 w-12 h-full rounded-tr-lg rounded-br-lg py-5  text-slate-700 flex flex-col justify-between">
            <div className='space-y-2'>
                <NavLink className={({isActive})=>`w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-white rounded ${isActive && 'bg-slate-300 text-primary'}`} title='Chat'>
                    <IoChatbubbleEllipses  size={25}/>
                </NavLink>
                <div onClick={()=>setOpenSearchUser(true)} className={`w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-white rounded`} title='Add Friends'>
                    <FaUserPlus  size={25}/>
                </div>
            </div>
            <div className='flex flex-col items-center '>
                <button className='mx-auto' title={user?.name} onClick={()=> setEditUserOpen(true)}>
                    <Avater 
                        width={30}
                        height={30}
                        name={user?.name}
                        imageUrl={user?.profile_pic}
                        userId={user?._id}
                    />
                </button>
                <button className='w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-white rounded' title='Logout' onClick={handleLogout}> 
                    <span className='-ml-2'>
                        <BiLogOut size={25} />
                    </span> 
                </button>
            </div>
        </div>

        <div className='w-full'>
            <div className='h-16 flex items-center'>
                <h2 className='text-lg font-bold p-4 text-slate-800'>Message</h2>
            </div>
            <div className='bg-slate-200 p-[0.5px]'></div>

            <div className=' h-[calc(100vh-65px)] overflow-x-hin overflow-y-auto scrollbar'>
                {
                    allUsers.length === 0 && (
                        <div className='mt-12'>
                            <div className='flex justify-center items-center my-4 text-slate-500'>
                                <FiArrowUpLeft size={50} />
                            </div>
                            <p className='text-lg text-slate-400 text-center'>Explore user to start conversation</p>
                        </div>
                    ) 
                }
                {
                    allUsers.map((conv)=>{
                        return(
                            <Link to={'/'+conv?.userDetails?._id} key={conv._id} className='flex items-center gap-2 py-3 px-2 border border-transparent hover:bg-gray-50 cursor-pointer'>
                                <div>
                                    <Avater 
                                        imageUrl={conv?.userDetails?.profile_pic}
                                        name={conv?.userDetails?.name}
                                        height={40}
                                        width={40}
                                    />
                                </div>
                                <div>
                                    <h3 className='text-ellipsis line-clamp-1 font-semibold text-base'>{conv?.userDetails?.name}</h3>
                                    <div className='text-slate-500 text-xs'>
                                        <div className='flex items-center gap-1'>
                                            {
                                               conv?.lastMsg.imageUrl && (
                                                <div className='flex items-center gap-1'>
                                                    <span> <FaImage /> </span>
                                                    {!conv?.lastMsg?.text && <span>Image</span>}
                                                </div>
                                               ) 
                                            }
                                            {
                                               conv?.lastMsg.videoUrl && (
                                                <div className='flex items-center gap-1'>
                                                    <span> <FaVideo /> </span>
                                                    {!conv?.lastMsg?.text && <span>Video</span>}
                                                </div>
                                               ) 
                                            }
                                        </div>
                                        <p className='text-ellipsis line-clamp-1'>{conv?.lastMsg?.text}</p>
                                    </div>
                                </div>
                                {
                                    Boolean(conv?.unseenMsg) && (

                                        <p className='text-xs w-6 h-6 flex justify-center items-center ml-auto p-1 bg-primary text-white rounded-full '>{conv?.unseenMsg}</p>
                                    )
                                }
                            </Link>
                        )
                    })
                }
            </div>
            
        </div>


        {/********Search User******** */}
        {
            openSearchUser && (
                <SearchUser onClose={()=>setOpenSearchUser(false)}/>
            )
        }

        {/********Edit Profile******** */}
        {
            editUserOpen && (
                <EditUserDetails onClose={()=> setEditUserOpen(false)} user={user} />
            )
        }

    </div>
  )
}

export default SideBar