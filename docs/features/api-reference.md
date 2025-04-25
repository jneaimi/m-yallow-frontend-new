# M-Yallow API Reference

This document provides a comprehensive reference for all API endpoints in the M-Yallow backend, organized by feature area. This reference is intended for frontend developers integrating with the backend.

## Table of Contents

- [Authentication](#authentication)
- [Provider Endpoints](#provider-endpoints)
  - [Public Provider Endpoints](#public-provider-endpoints)
  - [Provider Management Endpoints](#provider-management-endpoints)
  - [Provider Image Management](#provider-image-management)
- [Admin Endpoints](#admin-endpoints)
  - [Provider Administration](#provider-administration)
  - [Admin User Management](#admin-user-management)
  - [Admin Dashboard](#admin-dashboard)

## Authentication

All authenticated endpoints require a Clerk JWT token in the Authorization header.

**Header Format:**
```
Authorization: Bearer <clerk_jwt_token>
```

## Provider Endpoints

### Public Provider Endpoints

#### Get Recent Providers

Retrieves a list of recently approved providers for display on the landing page.

- **URL**: `/providers/recent`
- **Method**: `GET`
- **Authentication**: None
- **Query Parameters**:
  - `limit` (optional): Maximum number of providers to return (default: 20)
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    [
      {
        "id": 1,
        "name": "Provider Name",
        "heroImageUrl": "https://example.com/images/1/hero.jpg",
        "aboutSnippet": "A short snippet from the about field..."
      },
      ...
    ]
    ```
- **Error Response**:
  - **Code**: 500 Internal Server Error
  - **Content**: `{ "detail": "An internal server error occurred" }`

#### Get Provider by ID

Retrieves a single provider's details.

- **URL**: `/providers/{provider_id}`
- **Method**: `GET`
- **Authentication**: None
- **URL Parameters**:
  - `provider_id`: ID of the provider to retrieve
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "id": 1,
      "name": "Provider Name",
      "contact": "contact@example.com",
      "location": "City, State",
      "about": "Detailed description...",
      "heroImageUrl": "https://example.com/images/1/hero.jpg",
      "createdAt": "2023-11-01T12:00:00Z"
    }
    ```
- **Error Response**:
  - **Code**: 404 Not Found
  - **Content**: `{ "detail": "Provider not found" }`
  - **Code**: 500 Internal Server Error
  - **Content**: `{ "detail": "An internal server error occurred" }`

#### Search Providers

Searches for approved providers based on a search term.

- **URL**: `/providers/search`
- **Method**: `GET`
- **Authentication**: None
- **Query Parameters**:
  - `q`: Search term
  - `limit` (optional): Maximum number of results (default: 20)
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    [
      {
        "id": 1,
        "name": "Provider Name",
        "contact": "contact@example.com",
        "location": "City, State",
        "about": "Detailed description...",
        "heroImageUrl": "https://example.com/images/1/hero.jpg",
        "createdAt": "2023-11-01T12:00:00Z"
      },
      ...
    ]
    ```
- **Error Response**:
  - **Code**: 500 Internal Server Error
  - **Content**: `{ "detail": "An internal server error occurred" }`

#### List Approved Providers with Pagination and Filters

Retrieves a paginated list of approved providers with optional filters.

- **URL**: `/providers/list`
- **Method**: `GET`
- **Authentication**: None
- **Query Parameters**:
  - `page` (optional): Page number (default: 1)
  - `pageSize` (optional): Results per page (default: 20, max: 100)
  - `name` (optional): Filter by name (partial match)
  - `location` (optional): Filter by location (partial match)
  - `category` (optional): Filter by category
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "providers": [
        {
          "id": 1,
          "name": "Provider Name",
          "contact": "contact@example.com",
          "location": "City, State",
          "about": "Detailed description...",
          "heroImageUrl": "https://example.com/images/1/hero.jpg",
          "createdAt": "2023-11-01T12:00:00Z"
        },
        ...
      ],
      "total": 100,
      "page": 1,
      "pageSize": 20
    }
    ```
- **Error Response**:
  - **Code**: 500 Internal Server Error
  - **Content**: `{ "detail": "An internal server error occurred" }`

### Provider Management Endpoints

#### Create Provider Profile

Creates a new provider profile for the authenticated user.

- **URL**: `/providers`
- **Method**: `POST`
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "name": "Provider Name",
    "contact": "contact@example.com",
    "location": "City, State",
    "about": "Detailed description..."
  }
  ```
- **Success Response**:
  - **Code**: 201 Created
  - **Content**:
    ```json
    {
      "id": 1,
      "name": "Provider Name",
      "contact": "contact@example.com",
      "location": "City, State",
      "about": "Detailed description...",
      "heroImageUrl": "",
      "approved": false,
      "createdAt": "2023-11-01T12:00:00Z",
      "updatedAt": "2023-11-01T12:00:00Z",
      "ownerId": "user_2n4xpqUQoHIrKMVvYvqp0qGb0cH"
    }
    ```
- **Error Response**:
  - **Code**: 400 Bad Request
  - **Content**: `{ "detail": "Invalid request data" }`
  - **Code**: 401 Unauthorized
  - **Content**: `{ "detail": "Invalid or missing authentication" }`
  - **Code**: 409 Conflict
  - **Content**: `{ "detail": "Provider profile already exists for this user" }`
  - **Code**: 500 Internal Server Error
  - **Content**: `{ "detail": "An internal server error occurred" }`

#### Update Provider Profile

Updates an existing provider profile for the authenticated user.

- **URL**: `/providers/{provider_id}`
- **Method**: `PUT`
- **Authentication**: Required
- **URL Parameters**:
  - `provider_id`: ID of the provider to update
- **Request Body**:
  ```json
  {
    "name": "Updated Provider Name",
    "contact": "new-contact@example.com",
    "location": "New Location",
    "about": "Updated description..."
  }
  ```
  - All fields are optional. Only include fields you want to update.
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "id": 1,
      "name": "Updated Provider Name",
      "contact": "new-contact@example.com",
      "location": "New Location",
      "about": "Updated description...",
      "heroImageUrl": "https://example.com/images/1/hero.jpg",
      "approved": false,
      "createdAt": "2023-11-01T12:00:00Z",
      "updatedAt": "2023-11-01T13:00:00Z",
      "ownerId": "user_2n4xpqUQoHIrKMVvYvqp0qGb0cH"
    }
    ```
- **Error Response**:
  - **Code**: 400 Bad Request
  - **Content**: `{ "detail": "Invalid request data" }`
  - **Code**: 401 Unauthorized
  - **Content**: `{ "detail": "Invalid or missing authentication" }`
  - **Code**: 403 Forbidden
  - **Content**: `{ "detail": "User not authorized to update this provider profile" }`
  - **Code**: 404 Not Found
  - **Content**: `{ "detail": "Provider profile not found" }`
  - **Code**: 500 Internal Server Error
  - **Content**: `{ "detail": "An internal server error occurred" }`

#### Delete Provider Profile

Deletes an existing provider profile owned by the authenticated user.

- **URL**: `/providers/{provider_id}`
- **Method**: `DELETE`
- **Authentication**: Required
- **URL Parameters**:
  - `provider_id`: ID of the provider to delete
- **Success Response**:
  - **Code**: 204 No Content
- **Error Response**:
  - **Code**: 401 Unauthorized
  - **Content**: `{ "detail": "Invalid or missing authentication" }`
  - **Code**: 403 Forbidden
  - **Content**: `{ "detail": "User not authorized to delete this provider profile" }`
  - **Code**: 404 Not Found
  - **Content**: `{ "detail": "Provider profile not found" }`
  - **Code**: 500 Internal Server Error
  - **Content**: `{ "detail": "An internal server error occurred" }`

### Provider Image Management

#### Request Hero-Image Upload URL

Generates a pre-signed URL for uploading a provider hero image.

- **URL**: `/providers/{provider_id}/hero-image/url`
- **Method**: `POST`
- **Authentication**: Required
- **URL Parameters**:
  - `provider_id`: ID of the provider to update
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "uploadUrl": "https://storage.example.com/bucket/path?signature=xyz",
      "publicUrl": "https://cdn.example.com/images/1/hero.jpg"
    }
    ```
- **Error Response**:
  - **Code**: 401 Unauthorized
  - **Content**: `{ "detail": "Invalid or missing authentication" }`
  - **Code**: 403 Forbidden
  - **Content**: `{ "detail": "User not authorized to update this provider profile" }`
  - **Code**: 404 Not Found
  - **Content**: `{ "detail": "Provider profile not found" }`
  - **Code**: 500 Internal Server Error
  - **Content**: `{ "detail": "An internal server error occurred" }`

#### Confirm Hero-Image Upload

Confirms the hero image upload and updates the provider profile.

- **URL**: `/providers/{provider_id}/hero-image/confirm`
- **Method**: `POST`
- **Authentication**: Required
- **URL Parameters**:
  - `provider_id`: ID of the provider to update
- **Request Body**:
  ```json
  {
    "publicUrl": "https://cdn.example.com/images/1/hero.jpg"
  }
  ```
- **Success Response**:
  - **Code**: 200 OK
  - **Content**: Complete provider profile with updated heroImageUrl
- **Error Response**:
  - **Code**: 401 Unauthorized
  - **Content**: `{ "detail": "Invalid or missing authentication" }`
  - **Code**: 403 Forbidden
  - **Content**: `{ "detail": "User not authorized to update this provider profile" }`
  - **Code**: 404 Not Found
  - **Content**: `{ "detail": "Provider profile not found" }`
  - **Code**: 422 Unprocessable Entity
  - **Content**: `{ "detail": "Invalid URL format" }`
  - **Code**: 500 Internal Server Error
  - **Content**: `{ "detail": "An internal server error occurred" }`

## Admin Endpoints

All admin endpoints require authentication with an admin account.

### Provider Administration

#### List Pending Providers

Retrieves a list of providers pending approval.

- **URL**: `/admin/providers/pending`
- **Method**: `GET`
- **Authentication**: Required (Admin only)
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    [
      {
        "id": 1,
        "name": "Provider Name",
        "contact": "contact@example.com",
        "location": "City, State",
        "about": "Detailed description...",
        "heroImageUrl": "https://example.com/images/1/hero.jpg",
        "approved": false,
        "createdAt": "2023-11-01T12:00:00Z",
        "updatedAt": "2023-11-01T12:00:00Z",
        "ownerId": "user_2n4xpqUQoHIrKMVvYvqp0qGb0cH"
      },
      ...
    ]
    ```
- **Error Response**:
  - **Code**: 401 Unauthorized
  - **Content**: `{ "detail": "Invalid or missing authentication" }`
  - **Code**: 403 Forbidden
  - **Content**: `{ "detail": "Admin access required" }`
  - **Code**: 500 Internal Server Error
  - **Content**: `{ "detail": "An internal server error occurred" }`

#### Approve or Reject Provider

Approves or rejects a provider profile.

- **URL**: `/admin/providers/{provider_id}/approve`
- **Method**: `POST`
- **Authentication**: Required (Admin only)
- **URL Parameters**:
  - `provider_id`: ID of the provider to approve/reject
- **Request Body**:
  ```json
  {
    "approved": true
  }
  ```
- **Success Response**:
  - **Code**: 200 OK
  - **Content**: Complete provider profile with updated approval status
- **Error Response**:
  - **Code**: 401 Unauthorized
  - **Content**: `{ "detail": "Invalid or missing authentication" }`
  - **Code**: 403 Forbidden
  - **Content**: `{ "detail": "Admin access required" }`
  - **Code**: 404 Not Found
  - **Content**: `{ "detail": "Provider not found" }`
  - **Code**: 500 Internal Server Error
  - **Content**: `{ "detail": "An internal server error occurred" }`

#### List All Providers (Simple)

Retrieves a list of all providers, regardless of approval status.

- **URL**: `/admin/providers/all`
- **Method**: `GET`
- **Authentication**: Required (Admin only)
- **Success Response**:
  - **Code**: 200 OK
  - **Content**: Array of all provider profiles
- **Error Response**:
  - **Code**: 401 Unauthorized
  - **Content**: `{ "detail": "Invalid or missing authentication" }`
  - **Code**: 403 Forbidden
  - **Content**: `{ "detail": "Admin access required" }`
  - **Code**: 500 Internal Server Error
  - **Content**: `{ "detail": "An internal server error occurred" }`

#### List All Providers with Pagination and Filters

Retrieves a paginated list of all providers with optional filters.

- **URL**: `/admin/providers`
- **Method**: `GET`
- **Authentication**: Required (Admin only)
- **Query Parameters**:
  - `page` (optional): Page number (default: 1)
  - `pageSize` (optional): Results per page (default: 20, max: 100)
  - `name` (optional): Filter by name (partial match)
  - `location` (optional): Filter by location (partial match)
  - `category` (optional): Filter by category
  - `approved` (optional): Filter by approval status (true|false)
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "providers": [
        {
          "id": 1,
          "name": "Provider Name",
          "contact": "contact@example.com",
          "location": "City, State",
          "about": "Detailed description...",
          "heroImageUrl": "https://example.com/images/1/hero.jpg",
          "approved": true,
          "createdAt": "2023-11-01T12:00:00Z",
          "updatedAt": "2023-11-01T12:00:00Z",
          "ownerId": "user_2n4xpqUQoHIrKMVvYvqp0qGb0cH"
        },
        ...
      ],
      "total": 100,
      "page": 1,
      "pageSize": 20
    }
    ```
- **Error Response**:
  - **Code**: 401 Unauthorized
  - **Content**: `{ "detail": "Invalid or missing authentication" }`
  - **Code**: 403 Forbidden
  - **Content**: `{ "detail": "Admin access required" }`
  - **Code**: 500 Internal Server Error
  - **Content**: `{ "detail": "An internal server error occurred" }`

#### Delete Provider (Admin)

Deletes a provider profile (admin access).

- **URL**: `/admin/providers/{provider_id}`
- **Method**: `DELETE`
- **Authentication**: Required (Admin only)
- **URL Parameters**:
  - `provider_id`: ID of the provider to delete
- **Success Response**:
  - **Code**: 204 No Content
- **Error Response**:
  - **Code**: 401 Unauthorized
  - **Content**: `{ "detail": "Invalid or missing authentication" }`
  - **Code**: 403 Forbidden
  - **Content**: `{ "detail": "Admin access required" }`
  - **Code**: 404 Not Found
  - **Content**: `{ "detail": "Provider not found" }`
  - **Code**: 500 Internal Server Error
  - **Content**: `{ "detail": "An internal server error occurred" }`

### Admin User Management

#### Get Admin Status

Retrieves the admin status for a specific user.

- **URL**: `/admin/users/{user_id}/admin-status`
- **Method**: `GET`
- **Authentication**: Required (Admin only)
- **URL Parameters**:
  - `user_id`: ID of the user to check
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "userId": "user_2n4xpqUQoHIrKMVvYvqp0qGb0cH",
      "isAdmin": true,
      "success": true
    }
    ```
- **Error Response**:
  - **Code**: 401 Unauthorized
  - **Content**: `{ "detail": "Invalid or missing authentication" }`
  - **Code**: 403 Forbidden
  - **Content**: `{ "detail": "Admin access required" }`
  - **Code**: 500 Internal Server Error
  - **Content**: `{ "detail": "An internal server error occurred" }`

#### Update Admin Status

Updates the admin status for a specific user.

- **URL**: `/admin/users/{user_id}/admin-status`
- **Method**: `POST`
- **Authentication**: Required (Admin only)
- **URL Parameters**:
  - `user_id`: ID of the user to update
- **Request Body**:
  ```json
  {
    "userId": "user_2n4xpqUQoHIrKMVvYvqp0qGb0cH",
    "isAdmin": true
  }
  ```
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "userId": "user_2n4xpqUQoHIrKMVvYvqp0qGb0cH",
      "isAdmin": true,
      "success": true
    }
    ```
- **Error Response**:
  - **Code**: 400 Bad Request
  - **Content**: `{ "detail": "User ID in path does not match user ID in request body" }`
  - **Code**: 401 Unauthorized
  - **Content**: `{ "detail": "Invalid or missing authentication" }`
  - **Code**: 403 Forbidden
  - **Content**: `{ "detail": "Admin access required" }`
  - **Code**: 500 Internal Server Error
  - **Content**: `{ "detail": "An internal server error occurred" }`

### Admin Dashboard

#### Get Admin Dashboard

Retrieves data for the admin dashboard.

- **URL**: `/admin/dashboard`
- **Method**: `GET`
- **Authentication**: Required (Admin only)
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "message": "Admin access granted",
      "adminId": "user_2n4xpqUQoHIrKMVvYvqp0qGb0cH",
      "dashboardData": {
        "status": "Active",
        "version": "1.0.0"
      }
    }
    ```
- **Error Response**:
  - **Code**: 401 Unauthorized
  - **Content**: `{ "detail": "Invalid or missing authentication" }`
  - **Code**: 403 Forbidden
  - **Content**: `{ "detail": "Admin access required" }`
  - **Code**: 500 Internal Server Error
  - **Content**: `{ "detail": "An internal server error occurred" }`
