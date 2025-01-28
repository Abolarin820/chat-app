import { useEffect, useState } from "react"
import { IoCloseOutline, IoSearchOutline } from "react-icons/io5"
import Loader from "./Loader"
import UserSearchCard from "./UserSearchCard"
import axios from 'axios'
import toast from 'react-hot-toast'
import { backendUrl } from "../App"


const SearchUser = ({onClose}) => {
    const [searchUser,setSearchUser] = useState([])
    const [loading,setLoading] = useState(false)
    const [search, setSearch] = useState("")

    const handleSearchUser = async()=> {

        const URL = `${backendUrl+'/api/search-user'}`

        try {
            setLoading(true)
            const response = await axios.post(URL,{search:search})

            setLoading(false)
            setSearchUser(response.data.data)

        } catch (error) {
          toast.error(error.response.data.message)  
        }
    }

    useEffect(()=>{
        handleSearchUser()
    },[search])

    console.log('search-user',searchUser)

  return (

    <div className="fixed top-0 bottom-0 left-0 right-0 bg-gray-950 bg-opacity-40 p-2 z-10">
        <div className=" w-full max-sm:w-2/3 mx-auto max-w-lg mt-10 rounded">
            
            {/****input search user */}
            <div>
                <div className=" text-slate-900 cursor-pointer" onClick={onClose}>
                    <IoCloseOutline size={30} className=" ml-auto bg-white rounded"/>
                </div>
                <div className="bg-white rounded h-14 max-sm:h-12 overflow-hidden border border-primary flex my-2">
                    <input 
                        type="text" 
                        placeholder="Search user by name, eamil..."
                        className="w-full outline-none py-1 h-full px-4 text-gray-700"
                        value={search}
                        onChange={(e)=> setSearch(e.target.value)}
                        
                    />
                    <div className="h-14 w-14 flex justify-center items-center">
                        <IoSearchOutline size={20}/>
                    </div>
                </div>
            </div>

            {/**display search users */}
            <div className="bg-white mt-2 w-full p-4 rounded">
                {/* No user found */}
                {
                    searchUser.length === 0 && !loading && (
                        <p className="text-center text-slate-500">No user found!</p>
                    )
                }
                {
                    loading && (
                        <p><Loader /></p>
                    )
                }
                {
                    searchUser !== 0 && !loading && (
                        searchUser.map((user)=>{
                            return(
                                <UserSearchCard key={user._id} user={user} onClose={onClose} />
                            )
                        })
                    )
                }
            </div>

        </div>
    </div>
  )
}

export default SearchUser