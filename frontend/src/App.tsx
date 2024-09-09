/**
 * MAIN IMPORTS
 */
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { useEffect } from "react";
import { loadUserData } from "./utils/functions/reduxFunctions";
/**
 * CUSTOM IMPORTS
 */

import Home from './container/home/Home';
import Login from './container/auth/Login';
import Register from './container/auth/Register';
import About from './container/about/About';
import PageNotFound from './utils/pages/PageNotFound';
import Loader from './utils/pages/Loader';
import ResetPassword from './container/auth/reset-password';
import ForgotPassword from './container/auth/forgot-password';
import FAQs from './container/faq/faq';
import Privacy from './container/privacy/privacy';
/**
 * SUPER ADMIN IMPORTS
 */

const SuperAdminDashboard = lazy(() => import("./container/views/superadmin/container/dashboard/dashboard"));
const Toggleusers = lazy(() => import("./container/views/superadmin/container/Toggleusers"));
const Adduser = lazy(() => import("./container/views/superadmin/container/Adduser"));


/**
 * ADMIN IMPORTS
 */
const Dashboard = lazy(() => import("./container/views/admin/container/dashboard/dashboard"));
const AddUser = lazy(() => import("./container/views/admin/container/addUser/AddUser"));
const Profile = lazy(() => import("./container/views/admin/container/profile/Profile"));
const DisplayUsers = lazy(() => import("./container/views/admin/container/displayUsers/DisplayUsers"));
const AdminPatentDisplay = lazy(() => import("./container/views/admin/container/display/patent"));
const AdminCopyrightDisplay = lazy(() => import("./container/views/admin/container/display/copyright"));
const AdminJournalDisplay = lazy(() => import("./container/views/admin/container/display/journal"));
const AdminConferenceDisplay = lazy(() => import("./container/views/admin/container/display/conference"));
const AdminBookDisplay = lazy(() => import("./container/views/admin/container/display/book"));
const AdminBookChapterDisplay = lazy(() => import("./container/views/admin/container/display/book-chapter"));
const AdminNeedBasedProjectDisplay = lazy(() => import("./container/views/admin/container/display/need-based-project"));
const AdminAwardsHonorsDisplay = lazy(() => import("./container/views/admin/container/display/award-honors"));
const AdminProjectsDisplay = lazy(() => import("./container/views/admin/container/display/projects"));
const AdminConsultancyDisplay = lazy(() => import("./container/views/admin/container/display/consultancy"));


/**
 * HEAD OF DEPARTMENT IMPORTS
 */
const HeadDashboard = lazy(() => import("./container/views/head/container/dashboard/dashboard"));
const Faculty = lazy(() => import("./container/views/head/container/faculties/Faculty"));
const Notify = lazy(() => import("./container/views/head/container/notify/Notify"));
const HeadPatentDisplay = lazy(() => import("./container/views/head/container/display/patent"));
const HeadCopyrightDisplay = lazy(() => import("./container/views/head/container/display/copyright"));
const HeadJournalDisplay = lazy(() => import("./container/views/head/container/display/journal"));
const HeadConferenceDisplay = lazy(() => import("./container/views/head/container/display/conference"));
const HeadBookDisplay = lazy(() => import("./container/views/head/container/display/book"));
const HeadBookChapterDisplay = lazy(() => import("./container/views/head/container/display/book-chapter"));
const HeadNeedBasedProjectDisplay = lazy(() => import("./container/views/head/container/display/need-based-project"));
const HeadAwardsHonorsDisplay = lazy(() => import("./container/views/head/container/display/award-honors"));
const HeadProjectsDisplay = lazy(() => import("./container/views/head/container/display/projects"));
const HeadConsultancyDisplay = lazy(() => import("./container/views/head/container/display/consultancy"));
const HeadCourseCertificateDisplay = lazy(() => import("./container/views/head/container/display/course-certification"));
const HeadActivityConductedDisplay = lazy(() => import("./container/views/head/container/display/activity-conducted"));
const HeadAwardRecievedDisplay = lazy(() => import("./container/views/head/container/display/awards-recieved"));
const HeadSeminarAttendedDisplay = lazy(() => import("./container/views/head/container/display/seminar-attended"));
const HeadSeminarConductedDisplay = lazy(() => import("./container/views/head/container/display/seminar-conducted"));
const HeadSeminarOrganizedDisplay = lazy(() => import("./container/views/head/container/display/seminar-organised"));
const HeadSttpAttendedDisplay = lazy(() => import("./container/views/head/container/display/sttp-attended"));
const HeadSttpConductedDisplay = lazy(() => import("./container/views/head/container/display/sttp-conducted"));
const HeadSttpOrganizedDisplay = lazy(() => import("./container/views/head/container/display/sttp-organized"));

/**
 * FACULTY IMPORTS
 */
const FacultyDashboard = lazy(() => import("./container/views/faculty/container/dashboard/dashboard"));

/**
 * COMMON IMPORTS 
 */
const Notifications = lazy(() => import("./container/views/common/notifications/Notifications"));

/**
 * PROTECTED ROUTES
 */
import AdminProtectedRoute from './components/protected/AdminProtectedRoute';
import HeadProtectedRoute from './components/protected/HeadProtectedRoute';
import FacultyProtectedRoute from './components/protected/FacultyProtectedRoute';
import CommonProtectedRoute from './components/protected/CommonProtectedRoute';
import SuperAdminProtectedRoute from './components/protected/SuperAdminProtectedRoute';


/**
 * RESEARCH AND PROFILE FORM IMPORTS
 */
const ConsultancyForm = lazy(() => import("./container/views/common/forms/consultancy"));
const CopyrightForm = lazy(() => import("./container/views/common/forms/copyright"));
const ProjectForm = lazy(() => import("./container/views/common/forms/project"));
const JournalForm = lazy(() => import("./container/views/common/forms/journal"));
const BookForm = lazy(() => import("./container/views/common/forms/book"));
const BookChapterForm = lazy(() => import("./container/views/common/forms/book-chapter"));
const PatentForm = lazy(() => import("./container/views/common/forms/patent"));
const ResearchProfileForm = lazy(() => import("./container/views/common/forms/research-profile"));
const ProfileForm = lazy(() => import("./container/views/common/forms/profile"));
const ExperienceForm = lazy(() => import("./container/views/common/forms/experience"));
const QualificationForm = lazy(() => import("./container/views/common/forms/qualification"));
const AwardsAndHonorsForm = lazy(() => import("./container/views/common/forms/awards-honors"));
const ConferenceForm = lazy(() => import("./container/views/common/forms/conference"));
const NeedProjectsForm = lazy(() => import("./container/views/common/forms/need-based-project"));


/**
 * EDITABLE RESEARCH AND PROFILE FORM IMPORTS
 */
const ResearchProfileEditForm = lazy(() => import("./container/views/common/edit/research-profile"));
const ProfileEditForm = lazy(() => import("./container/views/common/edit/profile"));
const ExperienceEditForm = lazy(() => import("./container/views/common/edit/experience"));
const QualificationEditForm = lazy(() => import("./container/views/common/edit/qualification"));
const PatentEditForm = lazy(() => import("./container/views/common/edit/patent"));
const CopyrightEditForm = lazy(() => import("./container/views/common/edit/copyright"));
const JournalEditForm = lazy(() => import("./container/views/common/edit/journal"));
const ConferenceEditForm = lazy(() => import("./container/views/common/edit/conference"));
const BookEditForm = lazy(() => import("./container/views/common/edit/book"));
const BookChapterEditForm = lazy(() => import("./container/views/common/edit/book-chapter"));
const AwardsHonorsEditForm = lazy(() => import("./container/views/common/edit/awards-honors"));
const NeedBasedProjectEditForm = lazy(() => import("./container/views/common/edit/need-based-project"));
const ProjectEditForm = lazy(() => import("./container/views/common/edit/project"));
const ConsultancyEditForm = lazy(() => import("./container/views/common/edit/consultancy"));


/**
 *  ACHIEVEMENTS FORM IMPORTS
 */
const SttpAttendedForm = lazy(() => import("@/container/views/common/forms/sttp-attended"));
const SttpConductedForm = lazy(() => import("@/container/views/common/forms/sttp-conducted"));
const SttpOrganizedForm = lazy(() => import("@/container/views/common/forms/sttp-organized"));
const SeminarAttendedForm = lazy(() => import("@/container/views/common/forms/seminar-attended"));
const SeminarConductedForm = lazy(() => import("@/container/views/common/forms/seminar-conducted"));
const SeminarOrganizedForm = lazy(() => import("@/container/views/common/forms/seminar-organized"));
const AwardRecievedForm = lazy(() => import("@/container/views/common/forms/awards-recieved"));
const ActivityConductedForm = lazy(() => import("@/container/views/common/forms/activity-conducted"));
const CourseCertificateForm = lazy(() => import("@/container/views/common/forms/course-certification"));


/**
 * ACHIEVEMENTS EDITABLE FORMS
 */
const AwardRecievedEditForm = lazy(() => import("./container/views/common/edit/awards-recieved"));
const ActivityConductedEditForm = lazy(() => import("./container/views/common/edit/activity-conducted"));
const CourseCertificateEditForm = lazy(() => import("./container/views/common/edit/course-certification"));
const SttpConductedEditForm = lazy(() => import('./container/views/common/edit/sttp-conducted'));
const SttpAttendedEditForm = lazy(() => import('./container/views/common/edit/sttp-attended'));
const SttpOrganizedEditForm = lazy(() => import('./container/views/common/edit/sttp-organized'));
const SeminarAttendedEditForm = lazy(() => import('./container/views/common/edit/seminar-attended'));
const SeminarConductedEditForm = lazy(() => import('./container/views/common/edit/seminar-conducted'));
const SeminarOrganizedEditForm = lazy(() => import('./container/views/common/edit/seminar-organised'));


/**
 * COMMON DISPLAY IMPORTS
 */
const ProfileDisplay = lazy(() => import("./container/views/common/display/profile"));
const ExperienceDisplay = lazy(() => import("./container/views/common/display/experience"));
const ResearchProfileDisplay = lazy(() => import("./container/views/common/display/research-profile"));
const QualificationDisplay = lazy(() => import("./container/views/common/display/qualification"));
const PatentDisplay = lazy(() => import("./container/views/common/display/patent"));
const CopyrightDisplay = lazy(() => import("./container/views/common/display/copyright"));
const JournalDisplay = lazy(() => import("./container/views/common/display/journal"));
const ConferenceDisplay = lazy(() => import("./container/views/common/display/conference"));
const BookDisplay = lazy(() => import("./container/views/common/display/book"));
const BookChapterDisplay = lazy(() => import("./container/views/common/display/book-chapter"));
const NeedBasedProjectDisplay = lazy(() => import("./container/views/common/display/need-based-project"));
const AwardHonorsDisplay = lazy(() => import("./container/views/common/display/award-honors"));
const ConsultancyDisplay = lazy(() => import("./container/views/common/display/consultancy"));
const AwardRecievedDisplay = lazy(() => import("./container/views/common/display/awards-recieved"));
const ActivityConductedDisplay = lazy(() => import("./container/views/common/display/activity-conducted"));
const CourseCertificateDisplay = lazy(() => import("./container/views/common/display/course-certification"));
const SttpConductedDisplay = lazy(() => import('./container/views/common/display/sttp-conducted'));
const SttpAttendedDisplay = lazy(() => import('./container/views/common/display/sttp-attended'));
const SttpOrganizedDisplay = lazy(() => import('./container/views/common/display/sttp-organized'));
const SeminarAttendedDisplay = lazy(() => import('./container/views/common/display/seminar-attended'));
const SeminarConductedDisplay = lazy(() => import('./container/views/common/display/seminar-conducted'));
const SeminarOrganizedDisplay = lazy(() => import('./container/views/common/display/seminar-organised'));
const ProjectsDisplay = lazy(() => import("./container/views/common/display/projects"));
const BulkUpload = lazy(() => import("@/container/views/common/bulk/bulk"));


function App() {
  useEffect(() => {
    loadUserData();
  });

  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route index element={<Home />} />
          <Route path='/auth/login' element={<Login />} />
          <Route path='/auth/register' element={<Register />} />
          <Route path='/about' element={<About />} />
          <Route path='/faqs' element={<FAQs />} />
          <Route path='/privacy-policy' element={<Privacy />} />
          <Route path='/auth/forgot-password' element={<ForgotPassword />} />
          <Route path='/auth/reset-password/:token' element={<ResetPassword />} />
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
          <Route path='/hod/display/activity-conducted' element={<HeadProtectedRoute> <HeadActivityConductedDisplay /> </HeadProtectedRoute>} />
          <Route path='/hod/display/awards-recieved' element={<HeadProtectedRoute> <HeadAwardRecievedDisplay /> </HeadProtectedRoute>} />
          <Route path='/hod/display/seminar-attended' element={<HeadProtectedRoute> <HeadSeminarAttendedDisplay /> </HeadProtectedRoute>} />
          <Route path='/hod/display/seminar-conducted' element={<HeadProtectedRoute> <HeadSeminarConductedDisplay /> </HeadProtectedRoute>} />
          <Route path='/hod/display/seminar-organised' element={<HeadProtectedRoute> <HeadSeminarOrganizedDisplay /> </HeadProtectedRoute>} />
          <Route path='/hod/display/sttp-attended' element={<HeadProtectedRoute> <HeadSttpAttendedDisplay /> </HeadProtectedRoute>} />
          <Route path='/hod/display/sttp-conducted' element={<HeadProtectedRoute> <HeadSttpConductedDisplay /> </HeadProtectedRoute>} />
          <Route path='/hod/display/sttp-organized' element={<HeadProtectedRoute> <HeadSttpOrganizedDisplay /> </HeadProtectedRoute>} />
          <Route path='/hod/display/course-certification' element={<HeadProtectedRoute> <HeadCourseCertificateDisplay /> </HeadProtectedRoute>} />
          <Route path='/common/notifications' element={<CommonProtectedRoute> <Notifications /> </CommonProtectedRoute>} />
          <Route path='/faculty' element={<FacultyProtectedRoute> <FacultyDashboard /></FacultyProtectedRoute>} />
          <Route path='/common/forms/profile' element={<CommonProtectedRoute> <ProfileForm /> </CommonProtectedRoute>} />
          <Route path='/common/forms/experience' element={<CommonProtectedRoute> <ExperienceForm /> </CommonProtectedRoute>} />
          <Route path='/common/forms/research-profile' element={<CommonProtectedRoute> <ResearchProfileForm /> </CommonProtectedRoute>} />
          <Route path='/common/forms/qualification' element={<CommonProtectedRoute> <QualificationForm /> </CommonProtectedRoute>} />
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
          <Route path='/common/forms/sttp-attended' element={<CommonProtectedRoute> <SttpAttendedForm /> </CommonProtectedRoute>} />
          <Route path='/common/forms/sttp-conducted' element={<CommonProtectedRoute> <SttpConductedForm /> </CommonProtectedRoute>} />
          <Route path='/common/forms/sttp-organized' element={<CommonProtectedRoute> <SttpOrganizedForm /> </CommonProtectedRoute>} />
          <Route path='/common/forms/seminar-conducted' element={<CommonProtectedRoute> <SeminarConductedForm /> </CommonProtectedRoute>} />
          <Route path='/common/forms/seminar-attended' element={<CommonProtectedRoute> <SeminarAttendedForm /> </CommonProtectedRoute>} />
          <Route path='/common/forms/seminar-organized' element={<CommonProtectedRoute> <SeminarOrganizedForm /> </CommonProtectedRoute>} />
          <Route path='/common/forms/activity-conducted' element={<CommonProtectedRoute> <ActivityConductedForm /> </CommonProtectedRoute>} />
          <Route path='/common/forms/awards-recieved' element={<CommonProtectedRoute> <AwardRecievedForm /> </CommonProtectedRoute>} />
          <Route path='/common/forms/course-certification' element={<CommonProtectedRoute> <CourseCertificateForm /> </CommonProtectedRoute>} />
          <Route path='/common/edit/profile' element={<CommonProtectedRoute> <ProfileEditForm /> </CommonProtectedRoute>} />
          <Route path='/common/edit/experience' element={<CommonProtectedRoute> <ExperienceEditForm /> </CommonProtectedRoute>} />
          <Route path='/common/edit/research-profile' element={<CommonProtectedRoute> <ResearchProfileEditForm /> </CommonProtectedRoute>} />
          <Route path='/common/edit/qualification' element={<CommonProtectedRoute> <QualificationEditForm /> </CommonProtectedRoute>} />
          <Route path='/common/edit/patent/:id' element={<CommonProtectedRoute> <PatentEditForm /> </CommonProtectedRoute>} />
          <Route path='/common/edit/copyright/:id' element={<CommonProtectedRoute> <CopyrightEditForm /> </CommonProtectedRoute>} />
          <Route path='/common/edit/journal/:id' element={<CommonProtectedRoute> <JournalEditForm /> </CommonProtectedRoute>} />
          <Route path='/common/edit/conference/:id' element={<CommonProtectedRoute> <ConferenceEditForm /> </CommonProtectedRoute>} />
          <Route path='/common/edit/book/:id' element={<CommonProtectedRoute> <BookEditForm /> </CommonProtectedRoute>} />
          <Route path='/common/edit/book-chapter/:id' element={<CommonProtectedRoute> <BookChapterEditForm /> </CommonProtectedRoute>} />
          <Route path='/common/edit/projects/:id' element={<CommonProtectedRoute> <ProjectEditForm /> </CommonProtectedRoute>} />
          <Route path='/common/edit/need-based-project/:id' element={<CommonProtectedRoute> <NeedBasedProjectEditForm /> </CommonProtectedRoute>} />
          <Route path='/common/edit/awards-honors/:id' element={<CommonProtectedRoute> <AwardsHonorsEditForm /> </CommonProtectedRoute>} />
          <Route path='/common/edit/consultancy/:id' element={<CommonProtectedRoute> <ConsultancyEditForm /> </CommonProtectedRoute>} />
          <Route path='/common/edit/sttp-conducted/:id' element={<CommonProtectedRoute> <SttpConductedEditForm /> </CommonProtectedRoute>} />
          <Route path='/common/edit/sttp-attended/:id' element={<CommonProtectedRoute> <SttpAttendedEditForm /> </CommonProtectedRoute>} />
          <Route path='/common/edit/sttp-organized/:id' element={<CommonProtectedRoute> <SttpOrganizedEditForm /> </CommonProtectedRoute>} />
          <Route path='/common/edit/seminar-attended/:id' element={<CommonProtectedRoute> <SeminarAttendedEditForm /> </CommonProtectedRoute>} />
          <Route path='/common/edit/seminar-conducted/:id' element={<CommonProtectedRoute> <SeminarConductedEditForm /> </CommonProtectedRoute>} />
          <Route path='/common/edit/seminar-organized/:id' element={<CommonProtectedRoute> <SeminarOrganizedEditForm /> </CommonProtectedRoute>} />
          <Route path='/common/edit/awards-recieved/:id' element={<CommonProtectedRoute> <AwardRecievedEditForm /> </CommonProtectedRoute>} />
          <Route path='/common/edit/course-certification/:id' element={<CommonProtectedRoute> <CourseCertificateEditForm /> </CommonProtectedRoute>} />
          <Route path='/common/edit/activity-conducted/:id' element={<CommonProtectedRoute> <ActivityConductedEditForm /> </CommonProtectedRoute>} />
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
          <Route path='/common/display/qualification' element={<CommonProtectedRoute> <QualificationDisplay /> </CommonProtectedRoute>} />
          <Route path='/common/display/sttp-conducted' element={<CommonProtectedRoute> <SttpConductedDisplay /> </CommonProtectedRoute>} />
          <Route path='/common/display/sttp-attended' element={<CommonProtectedRoute> <SttpAttendedDisplay /> </CommonProtectedRoute>} />
          <Route path='/common/display/sttp-organized' element={<CommonProtectedRoute> <SttpOrganizedDisplay /> </CommonProtectedRoute>} />
          <Route path='/common/display/seminar-attended' element={<CommonProtectedRoute> <SeminarAttendedDisplay /> </CommonProtectedRoute>} />
          <Route path='/common/display/seminar-conducted' element={<CommonProtectedRoute> <SeminarConductedDisplay /> </CommonProtectedRoute>} />
          <Route path='/common/display/seminar-organized' element={<CommonProtectedRoute> <SeminarOrganizedDisplay /> </CommonProtectedRoute>} />
          <Route path='/common/display/awards-recieved' element={<CommonProtectedRoute> <AwardRecievedDisplay /> </CommonProtectedRoute>} />
          <Route path='/common/display/course-certification' element={<CommonProtectedRoute> <CourseCertificateDisplay /> </CommonProtectedRoute>} />
          <Route path='/common/display/activity-conducted' element={<CommonProtectedRoute> <ActivityConductedDisplay /> </CommonProtectedRoute>} />
          <Route path='/common/upload/bulk' element={<CommonProtectedRoute> <BulkUpload /> </CommonProtectedRoute>} />
          <Route path='*' element={<PageNotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
