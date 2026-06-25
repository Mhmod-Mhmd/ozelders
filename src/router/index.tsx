import { Navigate, createBrowserRouter } from 'react-router-dom';
import { RootLayout } from '@/components/layout/RootLayout';
import { StudentAccountLayout } from '@/components/layout/StudentAccountLayout';
import { HomePage } from '@/pages/HomePage';
import { TutorsPage } from '@/pages/TutorsPage';
import { TutorProfilePage } from '@/pages/TutorProfilePage';
import { FindTutorPage } from '@/pages/studentPages/FindTutorPage';
import { StudentSavedTutorsPage } from '@/pages/studentPages/StudentSavedTutorsPage';
import { StudentMessagesPage } from '@/pages/studentPages/StudentMessagesPage';
import { StudentLessonsPage } from '@/pages/studentPages/StudentLessonsPage';
import { StudentSettingsPage } from '@/pages/studentPages/StudentSettingsPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

/**
 * Application router (React Router data API).
 *
 * Pages are eagerly imported for now. As the app grows, prefer route-level
 * code-splitting with the `lazy` property to keep the initial bundle small.
 */
export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'tutors', element: <TutorsPage /> },
      { path: 'tutors/:id', element: <TutorProfilePage /> },
      {
        path: 'student',
        children: [
          { index: true, element: <Navigate to="find-tutor" replace /> },
          { path: 'find-tutor', element: <FindTutorPage /> },
          { path: 'saved', element: <StudentSavedTutorsPage /> },
          {
            element: <StudentAccountLayout />,
            children: [
              { path: 'messages', element: <StudentMessagesPage /> },
              { path: 'lessons', element: <StudentLessonsPage /> },
              { path: 'settings', element: <StudentSettingsPage /> },
            ],
          },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
