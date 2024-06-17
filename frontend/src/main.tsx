import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import axios from 'axios'
import { store } from './app/store.ts'
import { Provider } from 'react-redux'

axios.defaults.baseURL = 'http://localhost:5000'
axios.defaults.headers.common['token'] = localStorage.getItem('token') ;


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)
