import { useState } from "react"
import {IoClose} from 'react-icons/io5'
import { Link, useNavigate } from "react-router-dom"
import uploadFile from "../helpers/UploadFile"
import axios from 'axios'
import toast from 'react-hot-toast'
import { backendUrl } from "../App"


const RegisterPage = () => {

  const [data,setData] = useState({
    name:"",
    email:"",
    password:"",
    profile_pic:""
  })

  const [uploadPhoto, setUploadPhoto] = useState("")
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

  const handleUpload = async (e)=>{
    const file = e.target.files[0]
    const uploadImage = await uploadFile(file)

    setUploadPhoto(file)

    setData((prev)=>{
      return{
        ...prev,
        profile_pic: uploadImage?.url
      }
    })

  }

  const handleClearPhoto =(e)=> {
    e.stopPropagation()
    e.preventDefault()
    setUploadPhoto(null)
  }

  const handleSubmit = async(e)=>{
    e.preventDefault()
    e.stopPropagation()


    try {

      const response = await axios.post(backendUrl + '/api/register', data)
      
      if(response.data.success){
        toast.success(response.data.message)

        setData({
          name:"",
          email:"",
          password:"",
          profile_pic:""
        })

        navigate('/email')

      }else{
        toast.error(response.data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  } 

  return (
    <div className="mt-5">
        <div className="bg-white w-full max-w-sm rounded overflow-hidden p-4 mx-auto max-md:mb-4">
          <h3 className="text-center uppercase text-primary">Welcome to chat app!</h3>

          <form action="" className="grid gap-3 mt-5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1">
              <label htmlFor="name" className="max-sm:text-sm">Name :</label>

              <input type="text" 
                id="name" name="name" 
                placeholder="Enter your name" 
                value={data.name} onChange={handleOnchange}
                className="bg-slate-100 px-2 py-2 text-sm text-gray-800 focus:outline-primary "
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="max-sm:text-sm">Email :</label>

              <input type="email" 
                id="email" name="email" 
                placeholder="Enter your email" 
                value={data.email} onChange={handleOnchange}
                className="bg-slate-100 px-2 py-2 text-sm text-gray-800 focus:outline-primary "
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="max-sm:text-sm">Password :</label>

              <input type="password" 
                id="password" name="password" 
                placeholder="Enter your password" 
                value={data.password} onChange={handleOnchange}
                className="bg-slate-100 px-2 py-2 text-sm text-gray-800 focus:outline-primary "
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="profile_pic" className="max-sm:text-sm">
                Photo :
                <div className="h-10 bg-slate-200 flex justify-center items-center border rounded hover:border-primary cursor-pointer">
                  <p className="text-sm max-w-[200px] text-ellipsis line-clamp-1">
                    {
                      uploadPhoto?.name? 
                      
                      uploadPhoto?.name : "Upload profile photo"
                    }
                  </p>
                  {
                    uploadPhoto?.name && (
                      
                      <button className="text-lg ml-2 hover:text-red-600" onClick={handleClearPhoto}><IoClose/></button>
                    )
                  }
                </div>
              </label>


              <input type="file" 
                id="profile_pic" 
                name="profile_pic" 
                className=" hidden"
                onChange={handleUpload}
              />
            </div>

            <button className="bg-primary text-sm text-white px-4 py-2 hover:bg-secondary transition rounded mt-3 font-medium leading-relaxed tracking-wide">
              Register
            </button>

          </form>

          <p className="text-sm my-2 text-center">Already have account ? <Link to={'/email'} className="hover:text-primary hover:underline">Login</Link> </p>
        </div>
    </div>
  )
}

export default RegisterPage