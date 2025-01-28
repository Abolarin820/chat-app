import { Link } from "react-router-dom"
import Avater from "./Avater"


const UserSearchCard = ({user,onClose}) => {
  return (
    <Link to={'/'+user?._id} onClick={onClose} className="flex gap-3 items-center lg:p-4 p-2 border border-transparent border-b-slate-200 hover:bg-gray-100 rounded cursor-pointer">
      <div className="">
        <Avater 
          width={40}
          height={40}
          name={user?.name}
          userId ={user?._id}
          imageUrl={user?._profile_pic}
          
        />
      </div>

      <div>
        <div className="font-medium text-ellipsis line-clamp-1">
          {user?.name}
        </div>
        <p className="text-sm text-ellipsis line-clamp-1">{user?.email}</p>
      </div>
    </Link>
  )
}

export default UserSearchCard