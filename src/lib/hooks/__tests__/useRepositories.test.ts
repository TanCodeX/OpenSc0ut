import { renderHook, act, waitFor } from '@testing-library/react';
import { useRepositories } from '../useRepositories';
import { searchRepositories } from '../../api/github-api';
import { SearchParams } from '../../../types/types';

// Mock the API module
jest.mock('../../api/github-api', () => ({
  searchRepositories: jest.fn(),
}));

jest.mock('react-hot-toast', () => ({
  error: jest.fn(),
  success: jest.fn(),
}));

const mockSearchRepositories = searchRepositories as jest.MockedFunction<typeof searchRepositories>;

const initialParams: SearchParams = {
  sort: "stars",
  order: "desc",
  page: 1,
  per_page: 12,
};

describe('useRepositories', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default states', () => {
    mockSearchRepositories.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    const { result } = renderHook(() => useRepositories(initialParams));

    expect(result.current.loading).toBe(true);
    expect(result.current.repositories).toEqual([]);
    expect(result.current.error).toBeNull();
    expect(result.current.totalCount).toBe(0);
    expect(result.current.searchParams).toEqual(initialParams);
  });

  it('should fetch and update state successfully', async () => {
    const mockItems = [{ id: 1, name: 'react' }];
    mockSearchRepositories.mockResolvedValueOnce({
      items: mockItems as any,
      total_count: 50,
    });

    const { result } = renderHook(() => useRepositories(initialParams));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.repositories).toEqual(mockItems);
    expect(result.current.totalCount).toBe(50);
    expect(result.current.error).toBeNull();
  });

  it('should handle API errors and rate limits', async () => {
    const error = new Error('Rate limit exceeded');
    (error as any).resetTime = '1234567890';
    mockSearchRepositories.mockRejectedValueOnce(error);

    const { result } = renderHook(() => useRepositories(initialParams));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Rate limit exceeded');
    expect(result.current.resetTime).toBe('1234567890');
    expect(result.current.repositories).toEqual([]);
    expect(result.current.totalCount).toBe(0);
  });

  it('should trigger new fetch on handleSearch', async () => {
    mockSearchRepositories.mockResolvedValue({
      items: [],
      total_count: 0,
    });

    const { result } = renderHook(() => useRepositories(initialParams));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const newParams = { ...initialParams, language: 'typescript' };
    
    act(() => {
      result.current.handleSearch(newParams);
    });

    expect(result.current.loading).toBe(true);
    expect(result.current.searchParams).toEqual(newParams);
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(mockSearchRepositories).toHaveBeenCalledTimes(2);
  });
});
