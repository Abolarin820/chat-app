
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import './App.css'
import App from './App.jsx'
import router from './routes/index.jsx'
import {Provider} from 'react-redux'
import { store } from './redux/store.js'

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
      <RouterProvider router={router}>
        <App />
      </RouterProvider>
    </Provider>,
)
