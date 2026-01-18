'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/auth';

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode; // Optional fallback component to show while checking auth status
}

const ProtectedRoute = ({ children, fallback = null }: ProtectedRouteProps) => {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    // If user is not authenticated and auth status is loaded, redirect to login
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, loading, router]);

  // Show fallback while checking authentication status
  if (loading) {
    return fallback || <div>Loading...</div>;
  }

  // If authenticated, render children
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // If not authenticated, return nothing (redirect effect will handle it)
  return null;
};

export default ProtectedRoute;