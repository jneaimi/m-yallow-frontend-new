# TanStack Query Documentation

This document serves as an index for all TanStack Query documentation in the M-Yallow Frontend project. It provides links to detailed guides and explains how the documentation is structured.

## Documentation Structure

Our TanStack Query documentation is organized into several focused guides to make it easier to find relevant information:

### 1. [Data Transformation](./tanstack-query/data-transformation.md)
Best practices for transforming data between API responses and UI components.

**Key topics:**
- Shared data transformation functions
- Handling NULL values in API responses
- Robust category data transformation
- Consistent user experience with mock data

### 2. [Component Design](./tanstack-query/component-design.md)
Guidelines for designing components that work effectively with TanStack Query.

**Key topics:**
- Server-side prefetching alignment
- Flexible component props for different data structures
- Optimizing query execution with the `enabled` option
- Dependent queries with provider data
- Environment-aware fetch options

### 3. [Error Handling and API Integration](./tanstack-query/error-handling.md)
Best practices for handling errors and integrating with APIs.

**Key topics:**
- Robust error handling strategies
- API endpoint authentication requirements
- URL parameter encoding
- Next.js App Router and dynamic route parameters
- React Query version compatibility

### 4. [Query Optimization](./tanstack-query/query-optimization.md)
Techniques for optimizing queries to improve performance and maintainability.

**Key topics:**
- Proper query key typing and structure
- Stable query keys for arrays
- Shared query functions with transformation

### 5. [Testing](./tanstack-query/testing.md)
Guidelines for testing components and hooks that use TanStack Query.

**Key topics:**
- Type-safe testing with mock components
- Comprehensive testing for all UI states
- Testing query hooks
- Testing mutation hooks

## Reference Documentation

For more in-depth information and examples, refer to these additional guides:

### 1. [TanStack Query Reference Guide](./tanstack-query-reference.md)
   
A comprehensive reference guide covering all aspects of TanStack Query implementation in the project. It includes detailed information on core concepts, configuration, query hooks, mutations, and advanced patterns.

### 2. [TanStack Query Quick Start Guide](./tanstack-query-quickstart.md)

A practical guide to get started quickly with TanStack Query in the project. It provides step-by-step examples for implementing common patterns and use cases.

### 3. [TanStack Query Patterns](./tanstack-query-patterns.md)

A detailed guide on recommended patterns and best practices for implementing TanStack Query in the project. It ensures consistency across the codebase and makes it easier to maintain and extend the application.

### 4. [TanStack Query Migration Guide](./tanstack-query-migration-guide.md)

A step-by-step guide for migrating existing code to use TanStack Query. It includes practical examples, common patterns, and troubleshooting tips to help you refactor your code effectively.

## Using This Documentation

### For New Developers

If you're new to the project or TanStack Query:

1. Start with the [Quick Start Guide](./tanstack-query-quickstart.md) to get a basic understanding of how TanStack Query is implemented in the project.
2. Then read the [Patterns](./tanstack-query-patterns.md) document to understand the recommended approaches for different scenarios.
3. Review the category-specific guides (Data Transformation, Component Design, etc.) based on your current focus area.
4. Use the [Reference Guide](./tanstack-query-reference.md) as a comprehensive resource when you need detailed information.

### For Refactoring Existing Code

If you're migrating existing code to use TanStack Query:

1. Read the [Migration Guide](./tanstack-query-migration-guide.md) to understand the process and see examples.
2. Refer to the [Patterns](./tanstack-query-patterns.md) document to ensure your implementation follows project standards.
3. Consult the category-specific guides for best practices in each area of concern.
4. Use the [Reference Guide](./tanstack-query-reference.md) for detailed information on specific topics.

### For Troubleshooting

If you're experiencing issues with TanStack Query:

1. Check the [Error Handling and API Integration](./tanstack-query/error-handling.md) guide for common issues.
2. For testing-related issues, see the [Testing](./tanstack-query/testing.md) guide.
3. For specific topics, reference the appropriate category guide.
4. Check the Troubleshooting section in the [Reference Guide](./tanstack-query-reference.md).
5. For migration-specific issues, see the Troubleshooting section in the [Migration Guide](./tanstack-query-migration-guide.md).

## Implementation Progress

The TanStack Query implementation is being rolled out incrementally across the project. The initial setup and configuration has been completed, and now individual features are being migrated according to the sequenced refactoring plan.

Current status:
- ✅ Initial setup and configuration
- ✅ API client adapters
- ✅ Authentication integration
- ✅ Provider categories refactoring
- ✅ Provider category detail page (category/[id])
- ✅ Recent providers implementation
- ✅ Provider list implementation
- ✅ Provider detail implementation
- ✅ Provider reviews implementation
- ✅ Bookmarks implementation
- ✅ Search implementation
- ✅ Dashboard features implementation
- ✅ Provider dashboard refactoring

## Resources

- [Official TanStack Query Documentation](https://tanstack.com/query/latest/docs/react/overview)
- [TanStack Query Examples Repository](https://github.com/TanStack/query/tree/main/examples)
- [Next.js App Router Integration Guide](https://tanstack.com/query/latest/docs/react/guides/advanced-ssr)

## Implementation Examples

The following refactoring examples provide real-world implementation details and patterns:

1. [Browse Categories TanStack Query Refactoring](./refactoring-examples/categories-tanstack-refactoring.md) - Demonstrates handling React components in the cache and transforming data at render time
2. [Providers List TanStack Query Refactoring](./refactoring-examples/providers-list-tanstack-refactoring.md) - Shows how to implement pagination, filtering, and handle API authentication requirements
3. [Category Detail Page TanStack Query Refactoring](./refactoring-examples/category-detail-tanstack-refactoring.md) - Illustrates migrating from server components to a hybrid approach with consistent data transformation
4. [Provider Detail Page TanStack Query Refactoring](./refactoring-examples/provider-detail-tanstack-refactoring.md) - Shows how to implement server-side prefetching with client-side state management for a complex detail page
5. [Search TanStack Query Refactoring](./refactoring-examples/search-tanstack-refactoring.md) - Demonstrates refactoring search functionality with robust error handling and response format normalization
6. [Bookmarks TanStack Query Refactoring](./refactoring-examples/bookmarks-tanstack-refactoring.md) - Shows how to implement optimistic updates for bookmarks with a backward-compatible API
7. [Dashboard Bookmarks TanStack Query Refactoring](./refactoring-examples/dashboard-bookmarks-tanstack-refactoring.md) - Demonstrates improved separation of concerns with presentation and container components, data transformation layer, and enhanced error handling
8. [Provider Dashboard TanStack Query Refactoring](./refactoring-examples/provider-dashboard-tanstack-refactoring.md) - Illustrates refactoring a complex dashboard with multiple data dependencies to a modular, component-based architecture
