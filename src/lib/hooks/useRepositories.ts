import { useState, useEffect } from 'react';
import { searchRepositories } from '../api/github-api';
import { Repository, SearchParams } from '../../types/types';

export function useRepositories(initialParams: SearchParams) {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [searchParams, setSearchParams] = useState<SearchParams>(initialParams);

  const fetchRepositories = async (params: SearchParams) => {
    setLoading(true);
    setError(null);

    try {
      const { items, total_count } = await searchRepositories(params);
      setRepositories(items);
      setTotalCount(Math.min(total_count, 1000)); // GitHub API limits to 1000 results
    } catch (err: any) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Search error:', err);
      setRepositories([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepositories(searchParams);
  }, [searchParams.page]);

  const handleSearch = (params: SearchParams) => {
    setSearchParams(params);
    fetchRepositories(params);
  };

  const handlePageChange = (page: number) => {
    setSearchParams((prev) => ({ ...prev, page }));
  };

  return {
    repositories,
    loading,
    error,
    totalCount,
    searchParams,
    handleSearch,
    handlePageChange,
  };
}
