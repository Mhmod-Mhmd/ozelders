import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useHasRole } from '@/features/auth';
import { Navbar } from './Navbar';
import { StudentNavbar } from './StudentNavbar';
import { Footer } from './Footer';

/** Scrolls to the top of the page whenever the route changes. */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);
  return null;
}

/**
 * App shell rendered around every route: sticky navbar, the page `<Outlet />`,
 * and footer.
 */
export function RootLayout() {
  // The header follows the session, not the URL: signed-in students get the
  // account header everywhere; guests (and other roles) get the marketing nav.
  // This is what lets a guest browse /student/find-tutor without the student
  // chrome. While the session is still resolving, default to the guest nav.
  const isStudent = useHasRole('student');

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <ScrollToTop />
      {isStudent ? <StudentNavbar /> : <Navbar />}
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
