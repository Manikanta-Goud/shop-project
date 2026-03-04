import { useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, profile, loading } = useAuth();
  // Track if auth has ever finished loading — once true, stays true
  const hasLoadedOnce = useRef(false);
  if (!loading) hasLoadedOnce.current = true;

  // Only show the blocking full-screen loader on the very first app load
  // (before we know if user is logged in). After that, suppress it to
  // prevent the blank-screen flash when navigating between protected pages.
  if (loading && !hasLoadedOnce.current) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl text-gold animate-pulse inline-block italic">ॐ</span>
          <p className="text-gold-light mt-4 font-body">Loading...</p>
        </div>
      </div>
    );
  }

  // If not logged in, redirect to home page
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // If logged in but profile incomplete, redirect to profile page
  if (user && (!profile?.full_name?.trim())) {
    return <Navigate to="/profile" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
