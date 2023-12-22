/**
 * MAIN IMPORTS
 */
import { BrowserRouter, Routes , Route} from 'react-router-dom'

/**
 * CUSTOM IMPORTS
 */

import Home from './container/home/Home';
import Login from './container/auth/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path='/auth/login' element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
