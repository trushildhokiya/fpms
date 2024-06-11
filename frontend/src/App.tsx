/**
 * MAIN IMPORTS
 */
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
/**
 * CUSTOM IMPORTS
 */

import Home from './container/home/Home';
import Login from './container/auth/Login';
import Register from './container/auth/Register';
import About from './container/about/About';
import PageNotFound from './utils/pages/PageNotFound';
import Loader from './utils/pages/Loader';

/**
 * SUPER ADMIN IMPORTS
 */

const SuperAdminDashboard = lazy(() => import('./container/views/superadmin/container/dashboard/dashboard'));

/**
 * ADMIN IMPORTS
 */
const Dashboard = lazy(() => import('./container/views/admin/container/dashboard/Dashboard'));
const AddUser = lazy(() => import('./container/views/admin/container/addUser/AddUser'));
const Profile = lazy(() => import('./container/views/admin/container/profile/Profile'));
const DisplayUsers = lazy(() => import('./container/views/admin/container/displayUsers/DisplayUsers'));

/**
 * HEAD OF DEPARTMENT IMPORTS
 */
const HeadDashboard = lazy(() => import('./container/views/head/container/dashboard/Dashboard'));
const HeadProfile = lazy(() => import('@/container/views/head/container/profile/Profile'));
const Faculty = lazy(() => import('./container/views/head/container/faculties/Faculty'));
const Notify = lazy(() => import('./container/views/head/container/notify/Notify'));
const Notifications = lazy(() => import('./container/views/head/container/notifications/Notifications'));

/**
 * FACULTY IMPORTS
 */
const FacultyDashboard = lazy(() => import('./container/views/faculty/container/dashboard/Dashboard'));

/**
 * PROTECTED ROUTES
 */
import AdminProtectedRoute from './components/protected/AdminProtectedRoute';
import HeadProtectedRoute from './components/protected/HeadProtectedRoute';
import FacultyProtectedRoute from './components/protected/FacultyProtectedRoute';

import { useEffect } from 'react';
import { loadUserData } from './utils/functions/reduxFunctions';
import CommonProtectedRoute from './components/protected/CommonProtectedRoute';
import SuperAdminProtectedRoute from './components/protected/SuperAdminProtectedRoute';

/**
 * FORM ROUTES
 */
const ConsultancyForm = lazy(() => import('./container/views/common/forms/consultancy'));
const CopyrightForm = lazy(() => import('./container/views/common/forms/copyrightDetails'));
const ProjectForm = lazy(() => import('./container/views/common/forms/majorMinorProject'));
const JournalForm = lazy(() => import('./container/views/common/forms/journelPublication'));
const BookForm = lazy(() => import('./container/views/common/forms/bookPublication'));
const BookChapterForm = lazy(() => import('./container/views/common/forms/bookChapterPublication'));
const PatentForm = lazy(() => import('./container/views/common/forms/patentDetails'));
const ResearchProfileForm = lazy(() => import('./container/views/common/forms/facultyResearchProfile'));
const ProfileForm = lazy(() => import('./container/views/common/forms/profile'));
const ExperienceForm = lazy(() => import('./container/views/common/forms/experience'));
const AwardsAndHonorsForm = lazy(() => import('./container/views/common/forms/awardsAndHonors'));
const ConferenceForm = lazy(() => import('./container/views/common/forms/conference'));
const NeedProjectsForm =  lazy(() => import('./container/views/common/forms/needsBasedProjects'));;

function App() {

  useEffect(() => {
    loadUserData()
  })

  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route index element={<Home />} />
          <Route path='/auth/login' element={<Login />} />
          <Route path='/auth/register' element={<Register />} />
          <Route path='/about' element={<About />} />
          <Route path='/superadmin' element={<SuperAdminProtectedRoute> <SuperAdminDashboard /> </SuperAdminProtectedRoute>} />
          <Route path='/admin' element={<AdminProtectedRoute> <Dashboard /> </AdminProtectedRoute>} />
          <Route path='/admin/add-users' element={<AdminProtectedRoute> <AddUser /> </AdminProtectedRoute>} />
          <Route path='/admin/profile' element={<AdminProtectedRoute> <Profile /> </AdminProtectedRoute>} />
          <Route path='/admin/users/:type' element={<AdminProtectedRoute> <DisplayUsers /> </AdminProtectedRoute>} />
          <Route path='/hod' element={<HeadProtectedRoute><HeadDashboard /> </HeadProtectedRoute>} />
          <Route path='/hod/profile' element={<HeadProtectedRoute> <HeadProfile /> </HeadProtectedRoute>} />
          <Route path='/hod/users/faculty' element={<HeadProtectedRoute> <Faculty /> </HeadProtectedRoute>} />
          <Route path='/hod/notify' element={<HeadProtectedRoute> <Notify /> </HeadProtectedRoute>} />
          <Route path='/hod/notifications' element={<HeadProtectedRoute> <Notifications /> </HeadProtectedRoute>} />
          <Route path='/faculty' element={<FacultyProtectedRoute> <FacultyDashboard /></FacultyProtectedRoute>} />
          <Route path='/common/forms/profile' element={<CommonProtectedRoute> <ProfileForm/> </CommonProtectedRoute>} />
          <Route path='/common/forms/experience' element={<CommonProtectedRoute> <ExperienceForm/> </CommonProtectedRoute>} />
          <Route path='/common/forms/researchprofile' element={<CommonProtectedRoute> <ResearchProfileForm /> </CommonProtectedRoute>} />
          <Route path='/common/forms/journal' element={<CommonProtectedRoute> <JournalForm/> </CommonProtectedRoute>} />
          <Route path='/common/forms/conference' element={<CommonProtectedRoute> <ConferenceForm/> </CommonProtectedRoute>  } />
          <Route path='/common/forms/book' element={<CommonProtectedRoute> <BookForm /> </CommonProtectedRoute>} />
          <Route path='/common/forms/bookchapter' element={<CommonProtectedRoute> <BookChapterForm /> </CommonProtectedRoute>} />
          <Route path='/common/forms/patent' element={<CommonProtectedRoute> <PatentForm /> </CommonProtectedRoute>} />
          <Route path='/common/forms/copyright' element={<CommonProtectedRoute> <CopyrightForm/> </CommonProtectedRoute>} />
          <Route path='/common/forms/consultancy' element={<CommonProtectedRoute> <ConsultancyForm/> </CommonProtectedRoute>} />
          <Route path='/common/forms/projects' element={<CommonProtectedRoute> <ProjectForm/> </CommonProtectedRoute>} />
          <Route path='/common/forms/awards-honors' element={<CommonProtectedRoute> <AwardsAndHonorsForm/> </CommonProtectedRoute>} />
           <Route path='/common/forms/need-projects' element={<CommonProtectedRoute> <NeedProjectsForm/> </CommonProtectedRoute>} />
          <Route path='*' element={<PageNotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
