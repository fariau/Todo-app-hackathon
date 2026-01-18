'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const HomePage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard on component mount
    router.push('/dashboard');
  }, [router]);

  return null; // Don't render anything since we're redirecting
};

export default HomePage;