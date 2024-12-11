import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import axios from 'axios'
import { store } from './app/store.ts'
import { Provider } from 'react-redux'

axios.defaults.baseURL = 'https://fpmsbackend.kjsieit.com'

// Request Interceptor: Add token to request header
axios.interceptors.request.use(
  (config) => {
    // Get the token from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      // Attach token to the headers of the request
      config.headers['token'] = token;
    }
    return config;
  },
  (error) => {
    // Handle any errors that occur during the request setup
    return Promise.reject(error);
  }
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)
