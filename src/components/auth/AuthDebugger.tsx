'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

export function AuthDebugger() {
  const [authStatus, setAuthStatus] = useState<any>(null);
  const [cookies, setCookies] = useState<string>('');

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const checkAuth = async () => {
      try {
        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        // Get all cookies
        const allCookies = document.cookie;
        
        setAuthStatus({
          session: session ? {
            access_token: session.access_token ? 'present' : 'missing',
            refresh_token: session.refresh_token ? 'present' : 'missing',
            expires_at: session.expires_at,
            user_id: session.user?.id
          } : null,
          user: user ? {
            id: user.id,
            email: user.email,
            email_confirmed_at: user.email_confirmed_at
          } : null,
          sessionError: sessionError?.message,
          userError: userError?.message
        });
        
        setCookies(allCookies);
      } catch (error) {
        console.error('Auth debug error:', error);
        setAuthStatus({ error: (error as Error).message });
      }
    };

    checkAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      checkAuth();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (!authStatus) {
    return <div className="p-4 bg-gray-100 rounded">Loading auth status...</div>;
  }

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg space-y-4 text-sm">
      <h3 className="font-bold text-lg">🔍 Authentication Debug Info</h3>
      
      <div>
        <h4 className="font-semibold">Session Status:</h4>
        <pre className="bg-gray-200 dark:bg-gray-700 p-2 rounded mt-1 overflow-auto">
          {JSON.stringify(authStatus.session, null, 2)}
        </pre>
      </div>
      
      <div>
        <h4 className="font-semibold">User Status:</h4>
        <pre className="bg-gray-200 dark:bg-gray-700 p-2 rounded mt-1 overflow-auto">
          {JSON.stringify(authStatus.user, null, 2)}
        </pre>
      </div>
      
      <div>
        <h4 className="font-semibold">Errors:</h4>
        <p>Session Error: {authStatus.sessionError || 'None'}</p>
        <p>User Error: {authStatus.userError || 'None'}</p>
      </div>
      
      <div>
        <h4 className="font-semibold">Browser Cookies:</h4>
        <pre className="bg-gray-200 dark:bg-gray-700 p-2 rounded mt-1 overflow-auto max-h-32">
          {cookies || 'No cookies found'}
        </pre>
      </div>
    </div>
  );
}
