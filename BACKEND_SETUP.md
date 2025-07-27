# Backend Setup for Custom Logo Upload

## Overview

The SecureTOTP application supports custom logo uploads for 2FA tokens. This requires proper backend configuration to handle file uploads and CORS requests.

## Backend Requirements

### 1. SecureTOTP Backend Server

- Must be running on `http://localhost:8080`
- Must have the `/api/v1/accounts/upload-logo` endpoint implemented
- Must support file uploads via multipart/form-data

### 2. CORS Configuration

The backend must be configured to allow cross-origin requests from the frontend (`http://localhost:5173`).

**For Spring Boot applications, add this configuration:**

```java
@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

### 3. File Upload Configuration

**Configure maximum file size in `application.properties`:**

```properties
# Maximum file size for uploads
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB

# Enable multipart support
spring.servlet.multipart.enabled=true
```

## API Endpoint Details

### Upload Logo Endpoint

```
POST /api/v1/accounts/upload-logo
Content-Type: multipart/form-data
Authorization: Bearer {token}
```

**Request Body:**

- `file`: Image file (JPG, PNG, GIF, WebP)
- Maximum size: 5MB (recommended)

**Response Format:**

```json
{
  "success": true,
  "message": "Logo uploaded successfully",
  "url": "https://cloudinary.com/path/to/uploaded/image.jpg",
  "publicId": "unique_public_id",
  "format": "jpg",
  "width": 800,
  "height": 600,
  "size": 1024576,
  "originalName": "my-logo.jpg"
}
```

**Error Response:**

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

## Common Issues and Solutions

### 1. CORS Error

**Error:** `Access to fetch at 'http://localhost:8080/api/v1/accounts/upload-logo' from origin 'http://localhost:5173' has been blocked by CORS policy`

**Solution:**

- Ensure CORS is properly configured in your backend
- Add `http://localhost:5173` to allowed origins
- Include all necessary headers and methods

### 2. File Too Large (413 Error)

**Error:** `POST http://localhost:8080/api/v1/accounts/upload-logo net::ERR_FAILED 413 (Content Too Large)`

**Solution:**

- The frontend automatically compresses images larger than 2MB
- Configure backend to accept larger files (up to 10MB)
- Check server/proxy settings for upload limits

### 3. Unsupported File Type (415 Error)

**Error:** File type not supported

**Solution:**

- Only upload JPG, PNG, GIF, or WebP files
- Check backend MIME type validation
- Ensure proper file extension validation

### 4. Backend Not Running

**Error:** `Network error: Unable to connect to the server`

**Solution:**

- Start the SecureTOTP backend server on port 8080
- Verify the server is accessible at `http://localhost:8080`
- Check if any firewall or antivirus is blocking the connection

## Frontend Features

### Image Compression

- Automatically compresses images larger than 2MB
- Maintains aspect ratio while reducing file size
- Uses HTML5 Canvas for client-side compression

### File Validation

- Checks file size (max 10MB before compression)
- Validates file type (image files only)
- Provides user-friendly error messages

### Fallback Handling

- If logo upload fails, token is created without custom logo
- User receives clear error message explaining the issue
- Can retry upload or continue without custom logo

## Testing the Setup

1. Start the SecureTOTP backend server on port 8080
2. Start the frontend development server on port 5173
3. Navigate to "Add Token" page
4. Select "Custom" issuer
5. Try uploading a small image file (< 2MB)
6. Check browser console for any CORS or network errors

If you encounter issues, check the browser console and backend logs for detailed error messages.
