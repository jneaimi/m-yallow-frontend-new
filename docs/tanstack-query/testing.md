# Testing Best Practices

This document outlines best practices for testing components and hooks that use TanStack Query in the M-Yallow Frontend project.

## 1. Type-Safe Testing with Mock Components

**Issue**: Using `any` type in test mocks bypasses TypeScript's type checking and can lead to subtle bugs.

**Solution**:
- Define explicit interfaces for mock component props
- Import or define the same interfaces used in production code
- Use proper typing for all mock components and functions

```typescript
// Define or import the interface for component props
interface ComponentProps {
  providers: Provider[];
  isLoading: boolean;
  error: Error | null;
  // Additional props...
}

// Use the interface in the mock component
jest.mock('../component-path', () => ({
  SomeComponent: (props: ComponentProps) => (
    // Mock implementation...
  )
}));
```

Benefits:
- Catches type mismatches during development rather than runtime
- Makes tests more maintainable when component interfaces change
- Improves IDE support with proper autocompletion
- Serves as additional documentation of the component's contract

## 2. Comprehensive Testing for All UI States

**Issue**: Tests may not cover all possible UI states, leading to uncaught edge cases.

**Solution**:
- Test all meaningful UI states: loading, error, empty, and populated
- Create specific test cases for each state variant
- Use proper assertions to verify the component behavior in each state

```typescript
it('handles empty state correctly', () => {
  // Setup mock to return empty data
  (useDataHook as jest.Mock).mockReturnValue({
    data: [],
    isLoading: false,
    error: null,
    // Additional properties...
  });

  render(<TestedComponent />);
  
  // Verify component renders the empty state correctly
  expect(screen.getByText('No items found')).toBeInTheDocument();
  // Additional assertions...
});
```

This approach ensures:
- All user-facing states are tested and working correctly
- Edge cases like empty data sets are properly handled
- Regressions are caught when component behavior changes
- The component provides appropriate feedback in all possible scenarios

## 3. Testing Query Hooks

**Issue**: Testing hooks that use TanStack Query can be challenging, especially with complex dependencies.

**Solution**:
- Use the `renderHook` utility from `@testing-library/react-hooks`
- Create a wrapper with a QueryClientProvider for testing
- Mock the fetch function or API client at the boundary
- Test success, error, and loading states explicitly

```typescript
// Setup a fresh query client for each test
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

// Create a wrapper with the query client
const createWrapper = () => {
  const testQueryClient = createTestQueryClient();
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={testQueryClient}>
      {children}
    </QueryClientProvider>
  );
};

// Mock the API client or fetch function
jest.mock('../api-client', () => ({
  getApiClient: jest.fn(() => ({
    get: jest.fn()
  }))
}));

// Test the hook
describe('useProviders', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches providers successfully', async () => {
    // Setup mock response
    (getApiClient as jest.Mock).mockResolvedValueOnce({
      get: jest.fn().mockResolvedValueOnce({
        data: {
          providers: [{ id: 1, name: 'Test Provider' }]
        }
      })
    });

    // Render the hook with the wrapper
    const { result, waitForNextUpdate } = renderHook(() => useProviders(), {
      wrapper: createWrapper()
    });

    // Initial state should be loading with no data
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();

    // Wait for the query to complete
    await waitForNextUpdate();

    // Final state should have data and not be loading
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual([{ id: 1, name: 'Test Provider' }]);
  });

  it('handles error state', async () => {
    // Setup mock error
    (getApiClient as jest.Mock).mockResolvedValueOnce({
      get: jest.fn().mockRejectedValueOnce(new Error('API error'))
    });

    // Render the hook with the wrapper
    const { result, waitForNextUpdate } = renderHook(() => useProviders(), {
      wrapper: createWrapper()
    });

    // Wait for the query to fail
    await waitForNextUpdate();

    // Should be in error state
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error.message).toBe('API error');
  });
});
```

This approach provides comprehensive test coverage for query hooks, ensuring they handle all states correctly and interact properly with the API.

## 4. Testing Mutation Hooks

**Issue**: Testing mutation hooks requires handling asynchronous state changes and callbacks.

**Solution**:
- Use similar setup as for query hooks
- Test both the mutation function call and the resulting state changes
- Verify that callbacks (onSuccess, onError) are called correctly
- Test optimistic updates when applicable

```typescript
describe('useToggleBookmark', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('successfully toggles a bookmark', async () => {
    // Setup mock response
    (getApiClient as jest.Mock).mockResolvedValueOnce({
      post: jest.fn().mockResolvedValueOnce({
        data: { success: true }
      })
    });

    // Setup mock callbacks
    const onSuccess = jest.fn();
    const onError = jest.fn();

    // Render the hook with the wrapper
    const { result, waitForNextUpdate } = renderHook(() => useToggleBookmark({
      onSuccess,
      onError
    }), {
      wrapper: createWrapper()
    });

    // Initial state
    expect(result.current.isPending).toBe(false);

    // Call the mutation function
    result.current.mutate(123);

    // Should be in pending state
    expect(result.current.isPending).toBe(true);

    // Wait for the mutation to complete
    await waitForNextUpdate();

    // Should no longer be pending
    expect(result.current.isPending).toBe(false);
    
    // Success callback should have been called
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenCalledWith({ success: true }, 123, undefined);
    
    // Error callback should not have been called
    expect(onError).not.toHaveBeenCalled();
  });

  it('handles mutation errors', async () => {
    // Setup mock error
    const mockError = new Error('API error');
    (getApiClient as jest.Mock).mockResolvedValueOnce({
      post: jest.fn().mockRejectedValueOnce(mockError)
    });

    // Setup mock callbacks
    const onSuccess = jest.fn();
    const onError = jest.fn();

    // Render the hook with the wrapper
    const { result, waitForNextUpdate } = renderHook(() => useToggleBookmark({
      onSuccess,
      onError
    }), {
      wrapper: createWrapper()
    });

    // Call the mutation function
    result.current.mutate(123);

    // Wait for the mutation to fail
    await waitForNextUpdate();

    // Error callback should have been called
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith(mockError, 123, undefined);
    
    // Success callback should not have been called
    expect(onSuccess).not.toHaveBeenCalled();
  });
});
```

This approach ensures that mutation hooks handle both success and error cases correctly, and properly invoke the callbacks provided by the components that use them.
