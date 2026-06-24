import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from '@/components/layout/RootLayout';
import { HomePage } from '@/pages/HomePage';
import { TutorsPage } from '@/pages/TutorsPage';
import { TutorProfilePage } from '@/pages/TutorProfilePage';
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
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
