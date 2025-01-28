import axios from "axios"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { backendUrl } from "../App"
import toast from "react-hot-toast"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { logout, setOnlineUser, setSocketConnection, setUser } from "../redux/userSlice"
import SideBar from "../components/SideBar"
import logo from '../assets/logo.png'
import io from 'socket.io-client'


const Home = () => {
const user = useSelector(state => state.user)
const dispatch = useDispatch()
const navigate = useNavigate()

const location = useLocation()


  const fetchUserDetails = async ()=>{
    try {
      const URL = `${backendUrl+'/api/user-details'}`
      
      const response = await axios({
        url: URL,
        withCredentials:true
      })

      dispatch(setUser(response.data.data))
       
      if(response.data.data.logout){
        dispatch(logout())
        navigate('/email')
      }


    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }

  useEffect(()=>{
    fetchUserDetails()
  },[])

  /******Sockect Connection**** */
  useEffect(()=>{
      const socketConnection = io(import.meta.env.VITE_BACKEND_URL,{
        auth:{
          token: localStorage.getItem('token')
        }
      })
      
      socketConnection.on('onlineUser', (data)=>{
        dispatch(setOnlineUser(data))
      })

      dispatch(setSocketConnection(socketConnection))

      return ()=>{
        socketConnection.disconnect()
      }
  },[])


  const basePath = location.pathname === '/'

  return (
    <div className="grid lg:grid-cols-[300px,1fr] h-screen max-h-screen">
        <section className={`bg-white ${!basePath && 'hidden'} lg:block`}>
          <SideBar />
        </section>

        {/* Message component */}
        <section className={`${basePath && 'hidden'}`}>
            <Outlet/>
        </section>

        <div className={` justify-center items-center flex-col gap-2 hidden ${!basePath ? "hidden" : "lg:flex"}`}>
          <div>
            <img src={logo} alt="logo" width={150} />
          </div>
          <p className="text-gray-700 text-md">Select chat to start conversation</p>
        </div>
    </div>
  )
}

export default Home