import { Outlet } from "react-router-dom"
import  {Toaster} from 'react-hot-toast'


export  const backendUrl =`${import.meta.env.VITE_BACKEND_URL}`

const App = () => { 
  return (
    <>
      <Toaster />
      <main>
          <Outlet />
      </main>
    </>
  )
}

export default App