import { PiUserCircle } from "react-icons/pi"
import { useSelector } from "react-redux"


const Avater = ({userId, name, imageUrl, width, height}) => {

    const onlineUser = useSelector(state=> state?.user?.onlineUser)

    let avaterName =""

    if(name){
        const splitName = name?.split(" ")

        if(splitName.length > 1){
            avaterName = splitName[0][0]+splitName[1][0]
        }else{
            avaterName =  splitName[0][0]
        }
    }

    const bgColor=[
        'bg-slate-200',
        'bg-teal-200',
        'bg-red-200',
        'bg-green-200',
        'bg-yellow-200'
    ]

    const randomNumber = Math.floor(Math.random()*5)

    const isOnline = onlineUser.includes(userId) 


  return (
    <div className={`text-slate-800 overflow-hidden rounded-full font-bold relative`} style={{width: width+"px", height:height+"px"}}>
        {
            imageUrl ? ( 
                <img 
                    src={imageUrl}
                    width={width}
                    height={height}
                    alt={name}
                    className="rounded-full object-contain overflow-hidden"
                />          
            )
            :
            (
                name ? (
                    <div style={{width: width+"px", height:height+"px"}} className={`overflow-hidden rounded-full text-lg flex justify-center items-center ${bgColor[randomNumber]}`}>
                        {avaterName }
                    </div>
                ):(
                    <PiUserCircle size={width} />
                )
            )
        }

        {
            isOnline && (
                <div className="bg-green-600 p-1 absolute bottom-2 -right-1 rounded-full z-10"></div>
            )
        }
    </div>
  )
}

export default Avater