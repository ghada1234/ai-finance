import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

interface UseApiOptions<T> {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  dependencies?: any[];
  enabled?: boolean;
}

interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useApi<T>({
  url,
  method = "GET",
  body,
  dependencies = [],
  enabled = true,
}: UseApiOptions<T>): UseApiResult<T> {
  const { user, isSignedIn, isLoaded } = useUser();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    // For now, allow API calls even when not authenticated since we're using mock data
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      const options: RequestInit = {
        method,
        headers: {
          "Content-Type": "application/json",
        },
      };

      if (body && method !== "GET") {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(url, options);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [enabled, ...dependencies]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}

// Specialized hooks for common operations
export function useAccounts() {
  return useApi<Array<any>>({
    url: "/api/accounts",
    enabled: true,
  });
}

export function useTransactions(params?: {
  page?: number;
  limit?: number;
  accountId?: string;
  categoryId?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
}) {
  const queryParams = new URLSearchParams();
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });
  }

  return useApi<{ transactions: Array<any>; pagination: any }>({
    url: `/api/transactions?${queryParams.toString()}`,
    enabled: true,
    dependencies: [params?.page, params?.limit, params?.accountId, params?.categoryId, params?.type, params?.startDate, params?.endDate],
  });
}

export function useBudgets() {
  return useApi<Array<any>>({
    url: "/api/budgets",
    enabled: true,
  });
}
