import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from 'axios'
import toast from 'react-hot-toast'
import { backendUrl } from "../App"
import {PiUserCircle} from "react-icons/pi"

const CheckEmailPage = () => {

  const [data,setData] = useState({
    email:"",
  })

  const navigate = useNavigate()

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

      const response = await axios.post(backendUrl + '/api/email', data)
    

      if(response.data.success){
        toast.success(response.data.message)

        setData({
          email:""
        })

        navigate('/password',{
          state:response?.data?.data
        })

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
            <PiUserCircle size={80} />
          </div>

          <h3 className="text-center capitalize text-primary">Verify your email!</h3>

          <form action="" className="grid gap-3 mt-5" onSubmit={handleSubmit}>
            

            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="max-sm:text-sm text-gray-600">Email Address :</label>

              <input type="email" 
                id="email" name="email" 
                placeholder="Enter your email" 
                value={data.email} onChange={handleOnchange}
                className="bg-slate-100 px-2 py-2 text-sm text-gray-800 focus:outline-primary "
                required
              />
            </div>
 

            <button className="bg-primary text-sm text-white px-4 py-2 hover:bg-secondary transition rounded mt-3 font-medium leading-relaxed tracking-wide">
              Verify Email
            </button>

          </form>

          <p className="text-sm my-2 text-center">New User ? <Link to={'/register'} className="hover:text-primary hover:underline font-medium">Register</Link> </p>
        </div>
    </div>
  )
}

export default CheckEmailPage