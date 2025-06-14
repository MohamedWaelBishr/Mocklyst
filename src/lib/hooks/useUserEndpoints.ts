"use client"

import { useState, useEffect } from 'react'
import { supabaseTyped } from '@/lib/supabase'
import { useAuthUser } from '@/lib/stores/auth-store'

export interface UserEndpoint {
  id: string;
  config: any;
  endpoint: string;
  created_at: string;
  expires_at: string;
  updated_at: string;
  user_id: string | null;
  hits: number;
}

interface UseUserEndpointsReturn {
  endpoints: UserEndpoint[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useUserEndpoints(): UseUserEndpointsReturn {
  const [endpoints, setEndpoints] = useState<UserEndpoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useAuthUser();

  const fetchEndpoints = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabaseTyped
        .from("mock_endpoints")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      setEndpoints(data || []);
    } catch (err) {
      console.error("Error fetching user endpoints:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch endpoints"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEndpoints();
  }, [user?.id]);

  return {
    endpoints,
    loading,
    error,
    refetch: fetchEndpoints,
  };
}
