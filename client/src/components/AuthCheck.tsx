'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2, Twitter } from 'lucide-react';

export default function AuthCheck({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    
    // Check if user is not authenticated or doesn't have Twitter access token
    if (!session || !session.accessToken) {
      router.push('/login');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session || !session.accessToken) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Twitter className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Please sign in with Twitter to continue</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}