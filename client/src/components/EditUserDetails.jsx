import React, { useEffect, useRef, useState } from "react"
import Avater from "./Avater"
import uploadFile from "../helpers/UploadFile"
import Divider from "./Divider"
import axios from "axios"
import { backendUrl } from "../App"
import toast from "react-hot-toast"
import { useDispatch } from "react-redux"
import { setUser } from "../redux/userSlice"

const EditUserDetails = ({onClose, user}) => {

    const uploadPhotoRef = useRef();
    const dispatch = useDispatch();
    
    const [data, setData] = useState({
        name:user?.user,
        profile_pic: user?.profile_pic
    })
    
    

    useEffect(()=>{
        setData((prev)=>{
            return{
                ...prev,
                ...user
            }
        })
    },[user])

    const handleChange =(e)=>{
        const {name, value} = e.target
        
        setData((prev)=>{
            return{
                ...prev,
                [name]:value
            }
        }) 
    }

    const handleUploadOpenPhoto = (e)=>{
        e.preventDefault();
        e.stopPropagation();
        uploadPhotoRef.current.click()
    }

    const handleUpload = async (e)=>{
        const file = e.target.files[0]
        const uploadImage = await uploadFile(file)
    
        setData((prev)=>{
          return{
            ...prev,
            profile_pic: uploadImage?.url
          }
        })
    
      }

      

      const handleSubmit = async(e)=>{
        e.preventDefault();
        e.stopPropagation();

        try {
            const response = await axios({
                method:'post',
                url: backendUrl+ '/api/update-user',
                data:data,
                withCredentials:true
            })
            
            toast.success(response.data.message)

            if(response.data.success){
                dispatch(setUser(response.data.data))
                onClose();
            }

        } catch (error) {

          toast.error(error?.response?.data?.message) 

        }
      }

  return (
    <div className="fixed top-0 bottom-0 right-0 left-0 bg-gray-700 bg-opacity-40 flex justify-center items-center z-10">
        <div className="bg-white p-4 m-1 w-full max-w-sm rounded">
            <h2 className="font-semibold text-lg">Profile Details</h2>
            <p className="text-sm">Edit your name and cover photo</p>
            <Divider />

            <form action="" className="grid gap-3 mt-4" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-1">
                    <label htmlFor="name">Name :</label>
                        <input 
                            type="text" 
                            name="name"
                            id="name"
                            value={data.name}
                            onChange={handleChange}
                            className="w-full py-1 px-2 border border-gray-100 text-sm focus:outline-primary rounded"
                        />
                </div>

                <div className="flex flex-col gap-1">
                    <div>Photo :</div>
                    <div className="my-1 flex items-center gap-4">
                        <Avater 
                            width={40}
                            height={40}
                            imageUrl={data?.profile_pic}
                            name={data?.name}
                        />

                        <label htmlFor="profile_pic" className="max-sm:text-sm">
                            <button className="font-semibold" onClick={handleUploadOpenPhoto}>Change Photo</button>
                            <input 
                                type="file" 
                                id="profile_pic" 
                                className="hidden"
                                onChange={handleUpload}
                                ref={uploadPhotoRef}
                            />
                        </label>
                    </div>

                    <Divider />

                    <div className="flex gap-2 w-fit ml-auto">
                        <button onClick={onClose} className="border border-red-500 px-3 py-1  text-sm rounded text-red-500 hover:bg-red-500 hover:text-white">Cancel</button>
                        <button onClick={handleSubmit} className="border border-primary px-3 py-1 bg-primary text-sm rounded text-white hover:bg-secondary">Update Profile</button>
                    </div>

                </div>
            </form>
        </div>
    </div>
  )
}

export default React.memo(EditUserDetails)