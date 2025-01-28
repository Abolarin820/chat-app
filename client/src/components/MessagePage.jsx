import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import Avater from './Avater'
import {HiDotsVertical} from 'react-icons/hi'
import {FaAngleLeft} from 'react-icons/fa6'
import { FaPlus, FaImage, FaVideo } from 'react-icons/fa6'
import uploadFile from '../helpers/UploadFile'
import { IoClose } from 'react-icons/io5'
import Loader from './Loader'
import image1 from '../assets/wall1.jpeg'
import {IoMdSend} from 'react-icons/io'
import moment from 'moment'
import { HiOutlineCloudUpload } from "react-icons/hi";
import downloadImage from '../helpers/Download'


const MessagePage = () => {
  const params = useParams()
  const socketConnection = useSelector(state=> state?.user?.socketConnection)
  const user = useSelector(state=> state?.user)
  const [openImageVideoUpload,setOpenImageVideoUpload] = useState(false)
  const [message, setMessage] = useState({
    text:"",
    imageUrl:"",
    videoUrl:""
  })
  const [loading,setLoading] = useState(false)
  const [allMessages,setAllMessages] = useState([])
  const currentMessage = useRef(null)

  useEffect(()=>{
    if(currentMessage.current){
      currentMessage.current.scrollIntoView({behavior:'smooth', block: 'end'})
    }
  },[allMessages])
  
  const [dataUser,setDataUser] = useState({
    name:"",
    email:"",
    profile_pic:"",
    online: false,
    _id:""
  })

  const handleImageVideoUpload =()=>{
    setOpenImageVideoUpload(prev => !prev)
  }

  const handleUploadImage =async(e)=>{
    const file = e.target.files[0]

    setLoading(true)
    const uploadImage = await uploadFile(file)
    setLoading(false)

    setMessage((prev)=>{
      return {
        ...prev,
        imageUrl: uploadImage.url
      }
    })
    setOpenImageVideoUpload(false)
  }

  const handleUploadVideo =async(e)=>{
    const file = e.target.files[0]

    setLoading(true)
    const uploadImage = await uploadFile(file)
    setLoading(false)

    setMessage((prev)=>{
      return {
        ...prev,
        videoUrl: uploadImage.url
      }
    })
    setOpenImageVideoUpload(false)
  }
  const handleClearUploadImage =()=>{
    setMessage((prev)=>{
      return {
        ...prev,
        imageUrl: ""
      }
    })
  }

  const handleClearUploadVideo =()=>{
    setMessage((prev)=>{
      return {
        ...prev,
        videoUrl: ""
      }
    })
  }
 

  useEffect(()=>{
    
    if(socketConnection){

      socketConnection.emit('message-page',params.userId)

      socketConnection.emit('seen',params.userId)
      
      socketConnection.on('message-user', (data)=>{
        setDataUser(data)
      })

      socketConnection.on('message',(data)=>{
        setAllMessages(data)
      })
    }


  },[socketConnection,params?.userId,user])




const handleOnchange =(e)=>{
  const {name, value} = e.target
  
  setMessage(prev =>{
    return {
      ...prev,
      text: value
    }
  })
}

const handleSendMessage =(e)=>{
  e.preventDefault()

  if(message.text || message.imageUrl || message.videoUrl){
    if(socketConnection){
      socketConnection.emit('new message',{
        sender: user?._id,
        receiver: params.userId,
        text:message.text,
        imageUrl: message.imageUrl,
        videoUrl: message.videoUrl,
        msgByUserId: user._id
      })

      setMessage({
        text:"",
        imageUrl:"",
        videoUrl:""
      })
    }
  }
}


  

  return (
    <div style={{backgroundImage : `url(${image1})`}} className='bg-no-repeat bg-cover object-fill'>
      <header className="sticky top-0 h-16 bg-white flex justify-between items-center px-4">
        <div className='flex items-center gap-4'>
            <Link to={'/'} className='lg:hidden'>
              <FaAngleLeft size={18}/>
            </Link>
            <div>
                <Avater 
                  width={50}
                  height={50}
                  imageUrl={dataUser?.profile_pic}
                  name={dataUser?.name}
                  userId={dataUser?._id}
                />
            </div>
            <div>
              <h3 className='font-semibold text-lg my-0 text-ellipsis line-clamp-1'>{dataUser?.name}</h3>
              <p className='-mt-1 text-sm'>
                {
                  dataUser?.online ? <span className='text-primary '>online</span>:<span className='text-slate-400'>offline</span>
                }
              </p>
            </div>
        </div>

        <div className='cursor-pointer hover:text-primary'>
          <HiDotsVertical />
        </div>
      </header>

      {/****Show all message */}
      <section className="h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative bg-slate-800 bg-opacity-30">
       
        
        {/*******All messages show here */}
        <div className='flex flex-col gap-1 py-2'>
          {
            allMessages.map((msg,index)=>{
              return (
                <div ref={currentMessage} key={index} className={`p-1 rounded w-fit max-w-[280px] md:max-w-sm lg:max-w-md py-1 mx-2 mb-1 ${user._id === msg.msgByUserId ? "ml-auto bg-teal-100":"bg-white"}`}>
                  <div className="w-full">
                    {
                      msg?.imageUrl && (
                        <div className='flex items-center gap-2 bg-gray-50'>
                          <div className='cursor-pointer text-primary' onClick={async()=> await downloadImage(msg?.imageUrl)}>
                            <HiOutlineCloudUpload  size={30}/>
                          </div>
                          <img src={msg?.imageUrl} alt="" 
                          className="w-full h-full object-scale-down"
                          />
                        </div>
                        
                      )
                    }
                
                    {
                      msg?.videoUrl && (
                        <div className='flex items-center gap-2 bg-gray-50'>
                            <div className='cursor-pointer text-primary' onClick={async()=> await downloadImage(msg.videoUrl)}>
                              <HiOutlineCloudUpload  size={30}/>
                            </div>
                            <video src={msg.videoUrl} 
                              className="w-full h-full object-scale-down"
                              controls muted
                            />
                        </div>
                        
                      )
                    }
                  </div>
                  <p className={`px-2 text-primary`}>{msg.text}</p>
                  <p className="text-xs ml-auto w-fit">{moment(msg.createdAt).format('hh:mm a')}</p>
                </div>
              )
            })
          }
        </div>

         {/***Upload image display */}
        {
          message.imageUrl && (
            <div className='h-full w-full sticky bottom-0 bg-gray-300 bg-opacity-25 flex justify-center items-center rounded overflow-hidden '>
                <div className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600' onClick={handleClearUploadImage}>
                  <IoClose size={20} />
                </div>
                <div className='bg-white p-3'>
                    <img src={message.imageUrl}  className='aspect-square w-full h-full max-w-sm m-2 object-scale-down' alt="upload" />
                </div>
            </div>
          )
        }

         {/***Upload video display */}
         {
          message.videoUrl && (
            <div className='h-full w-full sticky bottom-0 bg-gray-300 bg-opacity-25 flex justify-center items-center rounded overflow-hidden '>
                <div className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600' onClick={handleClearUploadVideo}>
                  <IoClose size={20} />
                </div>
                <div className='bg-white p-3'>
                    <video src={message.videoUrl} className='aspect-square w-full h-full max-w-sm m-2 object-scale-down' controls muted autoPlay />
                </div>
            </div>
          )
        }
        {/***Loader */}
        {
          loading && (
            <div className='w-full h-full sticky bottom-0 flex justify-center items-center'>
              <Loader />
            </div>
          )
        }

      </section>
      
      {/****Send message */}
      <section className="h-16 bg-white flex items-center px-4">
        <div className='relative'>
          <button onClick={handleImageVideoUpload} className='flex w-10 h-10 justify-center items-center rounded-full hover:bg-primary hover:text-white'> 
            <FaPlus /> 
          </button>
        </div>
        
        {/*****Video and image pop up */}
        {
          openImageVideoUpload && (

          <div className='bg-white shadow rounded absolute bottom-16 w-36 p-2'>
              <form>
                
                <label htmlFor='uploadImage' className='flex items-center gap-3 px-3 p-2 cursor-pointer hover:bg-slate-200'>
                  <div className='text-primary'>
                      <FaImage size={18}/>
                  </div>
                  <p>Image</p>
                </label>

                <label htmlFor='uploadVideo' className='flex items-center gap-3 px-3 p-2 cursor-pointer hover:bg-slate-200'>
                  <div className='text-purple-500'>
                      <FaVideo size={18}/>
                  </div>
                  <p>Video</p>
                </label>

                <input type="file" id="uploadImage" className='hidden' onChange={handleUploadImage} />
                <input type="file" id="uploadVideo" className='hidden' onChange={handleUploadVideo} />

              </form>
          </div>
          )
        }

        {/****input send message */}
        <form className='h-full w-full flex items-center gap-2 bg-gray-50' onSubmit={handleSendMessage}>
          
            <input type="text"
                placeholder='Type message here...'
                className='py-1 px-4 outline-none w-full h-full text-gray-600' 
                value={message.text}
                onChange={handleOnchange}
            />

            <button className='text-primary hover:text-secondary'>
              <IoMdSend size={25}/> 
            </button>
           <div>

           </div>
        </form>
        
      </section>

    </div>
  )
}

export default MessagePage