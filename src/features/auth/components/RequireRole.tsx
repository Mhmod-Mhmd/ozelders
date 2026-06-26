import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { paths } from '@/router/paths';
import { useSession } from '../hooks/useAuth';
import { type UserRole } from '../types/auth.types';

interface RequireRoleProps {
  /** Role(s) allowed through this guard. */
  role: UserRole | UserRole[];
}

/**
 * Route guard. Renders the nested routes only when the session resolves to a
 * user whose role is permitted; otherwise redirects (to login when logged out,
 * preserving the intended destination; home when the role isn't allowed).
 *
 * This is enforcement, not just UI hiding — even if a link is shown, the guard
 * still blocks access.
 */
export function RequireRole({ role }: RequireRoleProps) {
  const { data: user, isLoading } = useSession();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate to={paths.login} replace state={{ from: location }} />
    );
  }

  const allowed = Array.isArray(role)
    ? role.includes(user.role)
    : user.role === role;

  if (!allowed) {
    return <Navigate to={paths.home} replace />;
  }

  return <Outlet />;
}
