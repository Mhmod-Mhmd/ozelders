import { Outlet } from 'react-router-dom';
import { StudentSubNav } from './StudentSubNav';

/**
 * Shell for the student account sub-pages (messages, lessons, settings): the
 * secondary navigation followed by the active page. The main student header is
 * already provided by {@link RootLayout}.
 */
export function StudentAccountLayout() {
  return (
    <>
      <StudentSubNav />
      <Outlet />
    </>
  );
}
