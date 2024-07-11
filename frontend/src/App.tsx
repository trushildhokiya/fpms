/**
 * MAIN IMPORTS
 */
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { useEffect } from 'react';
import { loadUserData } from './utils/functions/reduxFunctions';
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
const Toggleusers = lazy(() => import('./container/views/superadmin/container/Toggleusers'));
const Adduser = lazy(() => import('./container/views/superadmin/container/Adduser'));

/**
 * ADMIN IMPORTS
 */
const Dashboard = lazy(() => import('./container/views/admin/container/dashboard/dashboard'));
const AddUser = lazy(() => import('./container/views/admin/container/addUser/AddUser'));
const Profile = lazy(() => import('./container/views/admin/container/profile/Profile'));
const DisplayUsers = lazy(() => import('./container/views/admin/container/displayUsers/DisplayUsers'));
const AdminPatentDisplay = lazy(() => import('./container/views/admin/container/display/patent'));
const AdminCopyrightDisplay = lazy(() => import('./container/views/admin/container/display/copyright'));
const AdminJournalDisplay = lazy(() => import('./container/views/admin/container/display/journal'));
const AdminConferenceDisplay = lazy(() => import('./container/views/admin/container/display/conference'));
const AdminBookDisplay = lazy(() => import('./container/views/admin/container/display/book'));
const AdminBookChapterDisplay = lazy(() => import('./container/views/admin/container/display/book-chapter'));
const AdminNeedBasedProjectDisplay = lazy(() => import('./container/views/admin/container/display/need-based-project'));
const AdminAwardsHonorsDisplay = lazy(() => import('./container/views/admin/container/display/award-honors'));
const AdminProjectsDisplay = lazy(() => import('./container/views/admin/container/display/projects'));
const AdminConsultancyDisplay = lazy(() => import('./container/views/admin/container/display/consultancy'));


/**
 * HEAD OF DEPARTMENT IMPORTS
 */
const HeadDashboard = lazy(() => import('./container/views/head/container/dashboard/dashboard'));
const Faculty = lazy(() => import('./container/views/head/container/faculties/Faculty'));
const Notify = lazy(() => import('./container/views/head/container/notify/Notify'));
const Notifications = lazy(() => import('./container/views/head/container/notifications/Notifications'));
const HeadPatentDisplay = lazy(() => import('./container/views/head/container/display/patent'));
const HeadCopyrightDisplay = lazy(() => import('./container/views/head/container/display/copyright'));
const HeadJournalDisplay = lazy(() => import('./container/views/head/container/display/journal'));
const HeadConferenceDisplay = lazy(() => import('./container/views/head/container/display/conference'));
const HeadBookDisplay = lazy(() => import('./container/views/head/container/display/book'));
const HeadBookChapterDisplay = lazy(() => import('./container/views/head/container/display/book-chapter'));
const HeadNeedBasedProjectDisplay = lazy(() => import('./container/views/head/container/display/need-based-project'));
const HeadAwardsHonorsDisplay = lazy(() => import('./container/views/head/container/display/award-honors'));
const HeadProjectsDisplay = lazy(() => import('./container/views/head/container/display/projects'));
const HeadConsultancyDisplay = lazy(() => import('./container/views/head/container/display/consultancy'));

/**
 * FACULTY IMPORTS
 */
const FacultyDashboard = lazy(() => import('./container/views/faculty/container/dashboard/dashboard'));

/**
 * PROTECTED ROUTES
 */
import AdminProtectedRoute from './components/protected/AdminProtectedRoute';
import HeadProtectedRoute from './components/protected/HeadProtectedRoute';
import FacultyProtectedRoute from './components/protected/FacultyProtectedRoute';
import CommonProtectedRoute from './components/protected/CommonProtectedRoute';
import SuperAdminProtectedRoute from './components/protected/SuperAdminProtectedRoute';



/**
 * RESEARCH AND DEVELOPMENT FORM IMPORTS
 */
const ConsultancyForm = lazy(() => import('./container/views/common/forms/consultancy'));
const CopyrightForm = lazy(() => import('./container/views/common/forms/copyright'));
const ProjectForm = lazy(() => import('./container/views/common/forms/project'));
const JournalForm = lazy(() => import('./container/views/common/forms/journal'));
const BookForm = lazy(() => import('./container/views/common/forms/book'));
const BookChapterForm = lazy(() => import('./container/views/common/forms/book-chapter'));
const PatentForm = lazy(() => import('./container/views/common/forms/patent'));
const ResearchProfileForm = lazy(() => import('./container/views/common/forms/research-profile'));
const ProfileForm = lazy(() => import('./container/views/common/forms/profile'));
const ExperienceForm = lazy(() => import('./container/views/common/forms/experience'));
const AwardsAndHonorsForm = lazy(() => import('./container/views/common/forms/awards-honors'));
const ConferenceForm = lazy(() => import('./container/views/common/forms/conference'));
const NeedProjectsForm = lazy(() => import('./container/views/common/forms/need-based-project'));



/**
 *  ACHIEVEMENTS FORM IMPORTS
 */

const SttpAttended = lazy(() => import('@/container/views/common/forms/sttp-attended'));
const SttpConducted = lazy(() => import('@/container/views/common/forms/sttp-conducted'));
const CourseCertificate = lazy(() => import('@/container/views/common/forms/course-certificate'));
const AwardRecieved = lazy(() => import('@/container/views/common/forms/awards-recieved'));
const SeminarAttended = lazy(() => import('@/container/views/common/forms/seminar-attended'));
const SeminarConducted = lazy(() => import('@/container/views/common/forms/seminar-conducted'));
const ActivityConducted = lazy(() => import('@/container/views/common/forms/activity-conducted'));
const SttpOrganized = lazy(() => import('@/container/views/common/forms/sttp-organized'));
const SeminarOrganized = lazy(()=> import('@/container/views/common/forms/seminar-organized'))

/**
 * COMMON DISPLAY IMPORTS
 */
const ProfileDisplay = lazy(() => import('./container/views/common/display/profile'));
const ExperienceDisplay = lazy(() => import('./container/views/common/display/experience'));
const ResearchProfileDisplay = lazy(() => import('./container/views/common/display/research-profile'));
const PatentDisplay = lazy(() => import('./container/views/common/display/patent'));
const CopyrightDisplay = lazy(() => import('./container/views/common/display/copyright'));
const JournalDisplay = lazy(() => import('./container/views/common/display/journal'));
const ConferenceDisplay = lazy(() => import('./container/views/common/display/conference'));
const BookDisplay = lazy(() => import('./container/views/common/display/book'));
const BookChapterDisplay = lazy(() => import('./container/views/common/display/book-chapter'));
const NeedBasedProjectDisplay = lazy(() => import('./container/views/common/display/need-based-project'));
const AwardHonorsDisplay = lazy(() => import('./container/views/common/display/award-honors'));
const ConsultancyDisplay = lazy(() => import('./container/views/common/display/consultancy'));
const ProjectsDisplay = lazy(() => import('./container/views/common/display/projects'));
const BulkUpload = lazy(()=> import('@/container/views/common/bulk/bulk'))

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
          <Route path='/superadmin/toggle' element={<SuperAdminProtectedRoute> <Toggleusers /> </SuperAdminProtectedRoute>} />
          <Route path='/superadmin/add' element={<SuperAdminProtectedRoute> <Adduser /> </SuperAdminProtectedRoute>} />
          <Route path='/admin' element={<AdminProtectedRoute> <Dashboard /> </AdminProtectedRoute>} />
          <Route path='/admin/add-users' element={<AdminProtectedRoute> <AddUser /> </AdminProtectedRoute>} />
          <Route path='/admin/display/patent' element={<AdminProtectedRoute> <AdminPatentDisplay /> </AdminProtectedRoute>} />
          <Route path='/admin/display/copyright' element={<AdminProtectedRoute> <AdminCopyrightDisplay /> </AdminProtectedRoute>} />
          <Route path='/admin/display/journal' element={<AdminProtectedRoute> <AdminJournalDisplay /> </AdminProtectedRoute>} />
          <Route path='/admin/display/conference' element={<AdminProtectedRoute> <AdminConferenceDisplay /> </AdminProtectedRoute>} />
          <Route path='/admin/display/book' element={<AdminProtectedRoute> <AdminBookDisplay /> </AdminProtectedRoute>} />
          <Route path='/admin/display/book-chapter' element={<AdminProtectedRoute> <AdminBookChapterDisplay /> </AdminProtectedRoute>} />
          <Route path='/admin/display/need-based-projects' element={<AdminProtectedRoute> <AdminNeedBasedProjectDisplay /> </AdminProtectedRoute>} />
          <Route path='/admin/display/awards-honors' element={<AdminProtectedRoute> <AdminAwardsHonorsDisplay /> </AdminProtectedRoute>} />
          <Route path='/admin/display/projects' element={<AdminProtectedRoute> <AdminProjectsDisplay /> </AdminProtectedRoute>} />
          <Route path='/admin/display/consultancy' element={<AdminProtectedRoute> <AdminConsultancyDisplay /> </AdminProtectedRoute>} />
          <Route path='/admin/profile' element={<AdminProtectedRoute> <Profile /> </AdminProtectedRoute>} />
          <Route path='/admin/users/:type' element={<AdminProtectedRoute> <DisplayUsers /> </AdminProtectedRoute>} />
          <Route path='/hod' element={<HeadProtectedRoute><HeadDashboard /> </HeadProtectedRoute>} />
          <Route path='/hod/users/faculty' element={<HeadProtectedRoute> <Faculty /> </HeadProtectedRoute>} />
          <Route path='/hod/notify' element={<HeadProtectedRoute> <Notify /> </HeadProtectedRoute>} />
          <Route path='/hod/display/patent' element={<HeadProtectedRoute> <HeadPatentDisplay /> </HeadProtectedRoute>} />
          <Route path='/hod/display/copyright' element={<HeadProtectedRoute> <HeadCopyrightDisplay /> </HeadProtectedRoute>} />
          <Route path='/hod/display/journal' element={<HeadProtectedRoute> <HeadJournalDisplay /> </HeadProtectedRoute>} />
          <Route path='/hod/display/conference' element={<HeadProtectedRoute> <HeadConferenceDisplay /> </HeadProtectedRoute>} />
          <Route path='/hod/display/book' element={<HeadProtectedRoute> <HeadBookDisplay /> </HeadProtectedRoute>} />
          <Route path='/hod/display/book-chapter' element={<HeadProtectedRoute> <HeadBookChapterDisplay /> </HeadProtectedRoute>} />
          <Route path='/hod/display/need-based-projects' element={<HeadProtectedRoute> <HeadNeedBasedProjectDisplay /> </HeadProtectedRoute>} />
          <Route path='/hod/display/awards-honors' element={<HeadProtectedRoute> <HeadAwardsHonorsDisplay /> </HeadProtectedRoute>} />
          <Route path='/hod/display/projects' element={<HeadProtectedRoute> <HeadProjectsDisplay /> </HeadProtectedRoute>} />
          <Route path='/hod/display/consultancy' element={<HeadProtectedRoute> <HeadConsultancyDisplay /> </HeadProtectedRoute>} />
          <Route path='/hod/notifications' element={<HeadProtectedRoute> <Notifications /> </HeadProtectedRoute>} />
          <Route path='/faculty' element={<FacultyProtectedRoute> <FacultyDashboard /></FacultyProtectedRoute>} />
          <Route path='/common/forms/profile' element={<CommonProtectedRoute> <ProfileForm /> </CommonProtectedRoute>} />
          <Route path='/common/forms/experience' element={<CommonProtectedRoute> <ExperienceForm /> </CommonProtectedRoute>} />
          <Route path='/common/forms/research-profile' element={<CommonProtectedRoute> <ResearchProfileForm /> </CommonProtectedRoute>} />
          <Route path='/common/forms/journal' element={<CommonProtectedRoute> <JournalForm /> </CommonProtectedRoute>} />
          <Route path='/common/forms/conference' element={<CommonProtectedRoute> <ConferenceForm /> </CommonProtectedRoute>} />
          <Route path='/common/forms/book' element={<CommonProtectedRoute> <BookForm /> </CommonProtectedRoute>} />
          <Route path='/common/forms/book-chapter' element={<CommonProtectedRoute> <BookChapterForm /> </CommonProtectedRoute>} />
          <Route path='/common/forms/patent' element={<CommonProtectedRoute> <PatentForm /> </CommonProtectedRoute>} />
          <Route path='/common/forms/copyright' element={<CommonProtectedRoute> <CopyrightForm /> </CommonProtectedRoute>} />
          <Route path='/common/forms/consultancy' element={<CommonProtectedRoute> <ConsultancyForm /> </CommonProtectedRoute>} />
          <Route path='/common/forms/projects' element={<CommonProtectedRoute> <ProjectForm /> </CommonProtectedRoute>} />
          <Route path='/common/forms/awards-honors' element={<CommonProtectedRoute> <AwardsAndHonorsForm /> </CommonProtectedRoute>} />
          <Route path='/common/forms/need-based-projects' element={<CommonProtectedRoute> <NeedProjectsForm /> </CommonProtectedRoute>} />
          <Route path='/common/forms/copyright' element={<CommonProtectedRoute> <CopyrightForm /> </CommonProtectedRoute>} />
          <Route path='/common/forms/consultancy' element={<CommonProtectedRoute> <ConsultancyForm /> </CommonProtectedRoute>} />
          <Route path='/common/forms/projects' element={<CommonProtectedRoute> <ProjectForm /> </CommonProtectedRoute>} />
          <Route path='/common/forms/awards-honors' element={<CommonProtectedRoute> <AwardsAndHonorsForm /> </CommonProtectedRoute>} />
          <Route path='/common/forms/need-based-projects' element={<CommonProtectedRoute> <NeedProjectsForm /> </CommonProtectedRoute>} />
          <Route path='/common/forms/sttp-attended' element={<CommonProtectedRoute> <SttpAttended /> </CommonProtectedRoute>} />
          <Route path='/common/forms/sttp-conducted' element={<CommonProtectedRoute> <SttpConducted /> </CommonProtectedRoute>} />
          <Route path='/common/forms/sttp-organized' element={<CommonProtectedRoute> <SttpOrganized /> </CommonProtectedRoute>} />
          <Route path='/common/forms/seminar-conducted' element={<CommonProtectedRoute> <SeminarConducted /> </CommonProtectedRoute>} />
          <Route path='/common/forms/seminar-attended' element={<CommonProtectedRoute> <SeminarAttended /> </CommonProtectedRoute>} />
          <Route path='/common/forms/seminar-organized' element={<CommonProtectedRoute> <SeminarOrganized /> </CommonProtectedRoute>} />
          <Route path='/common/forms/activity-conducted' element={<CommonProtectedRoute> <ActivityConducted /> </CommonProtectedRoute>} />
          <Route path='/common/forms/awards-recieved' element={<CommonProtectedRoute> <AwardRecieved /> </CommonProtectedRoute>} />
          <Route path='/common/forms/course-certification' element={<CommonProtectedRoute> <CourseCertificate /> </CommonProtectedRoute>} />
          <Route path='/common/display/profile' element={<CommonProtectedRoute> <ProfileDisplay /> </CommonProtectedRoute>} />
          <Route path='/common/display/experience' element={<CommonProtectedRoute> <ExperienceDisplay /> </CommonProtectedRoute>} />
          <Route path='/common/display/research-profile' element={<CommonProtectedRoute> <ResearchProfileDisplay /> </CommonProtectedRoute>} />
          <Route path='/common/display/patent' element={<CommonProtectedRoute> <PatentDisplay /> </CommonProtectedRoute>} />
          <Route path='/common/display/copyright' element={<CommonProtectedRoute> <CopyrightDisplay /> </CommonProtectedRoute>} />
          <Route path='/common/display/journal' element={<CommonProtectedRoute> <JournalDisplay /> </CommonProtectedRoute>} />
          <Route path='/common/display/conference' element={<CommonProtectedRoute> <ConferenceDisplay /> </CommonProtectedRoute>} />
          <Route path='/common/display/book' element={<CommonProtectedRoute> <BookDisplay /> </CommonProtectedRoute>} />
          <Route path='/common/display/book-chapter' element={<CommonProtectedRoute> <BookChapterDisplay /> </CommonProtectedRoute>} />
          <Route path='/common/display/need-based-projects' element={<CommonProtectedRoute> <NeedBasedProjectDisplay /> </CommonProtectedRoute>} />
          <Route path='/common/display/awards-honors' element={<CommonProtectedRoute> <AwardHonorsDisplay /> </CommonProtectedRoute>} />
          <Route path='/common/display/consultancy' element={<CommonProtectedRoute> <ConsultancyDisplay /> </CommonProtectedRoute>} />
          <Route path='/common/display/projects' element={<CommonProtectedRoute> <ProjectsDisplay /> </CommonProtectedRoute>} />
          <Route path='/common/upload/bulk' element={<CommonProtectedRoute> <BulkUpload /> </CommonProtectedRoute>} />
          <Route path='*' element={<PageNotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
