import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import axios from 'axios'
import toast from 'react-hot-toast'
import { backendUrl } from "../App"
import Avater from "../components/Avater"
import {useDispatch} from 'react-redux'
import { setToken} from "../redux/userSlice"

const CheckPasswordPage = () => {

  const [data,setData] = useState({
    password:"",
  })

  const navigate = useNavigate()
  const location = useLocation();

  const dispatch = useDispatch()

 

  useEffect(()=>{
    if(!location?.state?.name){
      navigate('/email')
    }
  },[])

  const handleOnchange = (e)=>{
    const {name, value} = e.target

    setData((prev)=>{
      return{
        ...prev,
        [name]:value
      }
    })
  }

  

  const handleSubmit = async(e)=>{
    e.preventDefault()
    e.stopPropagation()


    try {

      const response = await axios({
        method:'post',
        url:backendUrl + '/api/password',
        data:{
          userId:location?.state?._id, 
          password:data.password
        },
        withCredentials:true
      })

      
      
      if(response.data.success){
        
        //redux
        dispatch(setToken(response?.data?.token));
        localStorage.setItem('token',response?.data?.token)

        toast.success(response.data.message)

        setData({
          password:""
        })

        navigate('/')

      }else{
        toast.error(response?.data?.message)
      }

    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  } 

  return (
    <div className="mt-5 ">
        <div className="bg-white w-full max-w-sm rounded overflow-hidden p-4 mx-auto ">
          
          <div className="w-fit mx-auto mb-2">
          
            <Avater 
              width={70}
              height={70} 
              name={location?.state?.name}
              imageUrl={location?.state?.profile_pic}
            />
          </div>

          <h2 className="text-center capitalize font-semibold text-lg text-primary">{location?.state?.name}</h2>

          <form action="" className="grid gap-3 mt-5" onSubmit={handleSubmit}>
            

            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="max-sm:text-sm text-gray-600">Password :</label>

              <input type="password" 
                id="password" name="password" 
                placeholder="Enter your password" 
                value={data.password} onChange={handleOnchange}
                className="bg-slate-100 px-2 py-2 text-sm text-gray-800 focus:outline-primary "
                required
              />
            </div>
 

            <button className="bg-primary text-sm text-white px-4 py-2 hover:bg-secondary transition rounded mt-3 font-medium leading-relaxed tracking-wide">
              Login
            </button>

          </form>

          <p className="text-sm my-2 text-center"><Link to={'/forgot-password'} className="hover:text-primary hover:underline font-medium">Forgot Password ?</Link> </p>
        </div>
    </div>
  )
}

export default CheckPasswordPage