/**
 * MAIN IMPORTS
 */
import { BrowserRouter, Routes, Route } from 'react-router-dom'

/**
 * CUSTOM IMPORTS
 */

import Home from './container/home/Home';
import Login from './container/auth/Login';
import Register from './container/auth/Register';
import About from './container/about/About';
import PageNotFound from './utils/pages/PageNotFound';

/**
 * ADMIN IMPORTS
 */
import Dashboard from './container/views/admin/container/dashboard/Dashboard';
import AddUser from './container/views/admin/container/addUser/AddUser';
import Profile from './container/views/admin/container/profile/Profile';
import DisplayUsers from './container/views/admin/container/displayUsers/DisplayUsers';

/**
 * HEAD OF DEPARTMENT IMPORTS
 */
import HeadDashboard from './container/views/head/container/dashboard/Dashboard';
import HeadProfile from '@/container/views/head/container/profile/Profile'
import Faculty from './container/views/head/container/faculties/Faculty';
import Notify from './container/views/head/container/notify/Notify';

/**
 * PROTECTED ROUTES
 */
import AdminProtectedRoute from './components/protected/AdminProtectedRoute';
import HeadProtectedRoute from './components/protected/HeadProtectedRoute';
import Notifications from './container/views/head/container/notifications/Notifications';


function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path='/auth/login' element={<Login />} />
        <Route path='/auth/register' element={<Register />} />
        <Route path='/about' element={<About />} />
        <Route path='/admin' element={<AdminProtectedRoute> <Dashboard /> </AdminProtectedRoute>} />
        <Route path='/admin/add-users' element={<AdminProtectedRoute> <AddUser /> </AdminProtectedRoute>} />
        <Route path='/admin/profile' element={<AdminProtectedRoute> <Profile /> </AdminProtectedRoute>} />
        <Route path='/admin/users/:type' element={<AdminProtectedRoute> <DisplayUsers /> </AdminProtectedRoute>} />
        <Route path='/hod' element={<HeadProtectedRoute><HeadDashboard /> </HeadProtectedRoute>} />
        <Route path='/hod/profile' element={<HeadProtectedRoute> <HeadProfile /> </HeadProtectedRoute>} />
        <Route path='/hod/users/faculty' element={<HeadProtectedRoute> <Faculty /> </HeadProtectedRoute>} />
        <Route path='/hod/notify' element={<HeadProtectedRoute> <Notify /> </HeadProtectedRoute>} />
        <Route path='/hod/notifications' element={<HeadProtectedRoute> <Notifications /> </HeadProtectedRoute>} />
        <Route path='*' element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
