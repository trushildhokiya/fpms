/**
 * MAIN IMPORTS
 */
import { BrowserRouter, Routes , Route} from 'react-router-dom'

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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path='/auth/login' element={<Login />} />
        <Route path='/auth/register' element={<Register />} />
        <Route path='/about' element={<About />} />
        <Route path='/admin' element={ <Dashboard /> } />
        <Route path='/admin/add-users' element={ <AddUser /> } />
        <Route path='/admin/profile' element={ <Profile /> } />
        <Route path='/admin/users/:type' element={ <DisplayUsers /> } />
        <Route path='*' element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
