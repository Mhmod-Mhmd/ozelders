import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { paths } from '@/router/paths';
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
  const { pathname } = useLocation();
  // Logged-in students get the account header; everyone else the marketing nav.
  const isStudentArea = pathname.startsWith(paths.studentHome);

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <ScrollToTop />
      {isStudentArea ? <StudentNavbar /> : <Navbar />}
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
