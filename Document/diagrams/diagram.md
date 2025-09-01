## 1 User cases
### 1.1 User case 1 - Home page showing all images or image by id
<img src="../images/image-2.png" alt="drawing" width="1000"/>

```mermaid
sequenceDiagram

    participant U as User (Browser)
    participant F as Frontend (Home Page)
    participant B as Backend (API Controller)
    participant DB as Database

    U->>F: Open home page
    F->>B: GET /api/images
    B->>DB: SELECT * FROM Images ORDER BY created_date DESC
    DB-->>B: List of images
    B-->>F: JSON with image data
    F-->>U: Render images in UI
```
```mermaid
sequenceDiagram

    participant U as User (Browser)
    participant F as Frontend (Home Page)
    participant B as Backend (API Controller)
    participant DB as Database

    U->>F: Open home page
    F->>B: GET /api/images/:id
    B->>DB: Query by id
    DB-->>B: Image with correct id
    B-->>F: JSON with image data
    F-->>U: Render images in UI
```
### 1.2 User case 2 - Details of an image
#### 1.2.1 Get image information
```mermaid
sequenceDiagram
    participant U as User (Browser)
    participant F as Frontend (Image Details Page)
    participant B as Backend (Image API)
    participant DB as Database

    U->>F: Open /images/{imageId}
    F->>B: GET /api/images/{imageId}?viewerId={currentUserId}

    B->>DB: SELECT * FROM Images WHERE imageId = ?
    DB-->>B: Return image info

    B->>DB: SELECT fullName, avatar_path FROM Users WHERE userId = image.userId
    DB-->>B: Return uploader info

    B->>DB: SELECT * FROM Comments WHERE imageId = ?
    DB-->>B: Return list of comments

    B->>DB: SELECT * FROM Saved_images WHERE userId = ? AND imageId = ?
    DB-->>B: Return save status (exists or not)

    B-->>F: Return full JSON response
    F-->>U: Render image, uploader, comments, save status
```

### 1.2.2 Comment to an image
<img src="../images/image-1.png" alt="drawing" width="1000"/>

```mermaid
sequenceDiagram
    participant U as User (Browser)
    participant F as Frontend (Image View Page)
    participant B as Backend (Comment API)
    participant DB as Database

    U->>F: Type comment and click "Post"
    F->>B: POST /api/comments (userId, imageId, content)
    B->>DB: INSERT INTO Comments (userId, imageId, content)
    DB-->>B: Insert success (commentId)
    B-->>F: Response 201 Created
    F-->>U: Show new comment under image
```

### 1.3 User case 3 - Personal profile
#### 1.3.1 Edit personal profile
<img src="../images/image-5.png" alt="drawing" width="500"/>

```mermaid
sequenceDiagram
    participant U as User (Browser)
    participant F as Frontend (Profile Edit Page)
    participant B as Backend (User API)
    participant DB as Database
    participant FS as File Storage (for Avatar)

    U->>F: Update profile fields (fullName, description, avatar)
    F->>FS: Upload new avatar image
    FS-->>F: Return image URL or path
    F->>B: PUT /api/users/{userId} (fullName, description, avatar_path)
    B->>DB: UPDATE Users SET fullName = ..., avatar_path = ..., description = ... WHERE userId = ...
    DB-->>B: Update success
    B-->>F: 200 OK
    F-->>U: Show updated profile

```
#### 1.3.2 View personal profile
```mermaid
sequenceDiagram
    participant U as User (Browser)
    participant F as Frontend (Profile Page)
    participant B as Backend (User API)
    participant DB as Database

    U->>F: Navigate to /profile
    F->>B: GET /api/users/me (with JWT)
    B->>B: Decode JWT → get userId
    B->>DB: Query user's info
    DB-->>B: Return user info
    B-->>F: Return profile info

    F->>B: GET /api/users/me/saved-images
    B->>DB: Query user saved images
    DB-->>B: Return list of saved images
    B-->>F: Return saved images

    F->>B: GET /api/users/me/created-images
    B->>DB: Query user created images
    DB-->>B: Return created images
    B-->>F: Return created images

    Note over U,F: User clicks "Delete" on one of their images

    F->>B: DELETE /api/images/{imageId}
    B->>DB: DELETE FROM Images WHERE imageId = ? AND userId = ?
    DB-->>B: Success or failure
    B-->>F: 200 OK or 403 Forbidden
    F-->>U: Show confirmation or error

```

### 1.4 User case 4 - view other profile
```mermaid
sequenceDiagram
    participant U as Viewer (Browser)
    participant F as Frontend (Profile Page)
    participant B as Backend (User API)
    participant DB as Database

    U->>F: Navigate to /users/{userId}
    F->>B: GET /api/users/{userId}
    B->>DB: SELECT fullName, avatar_path, description FROM Users WHERE userId = ?
    DB-->>B: Return user profile data
    B-->>F: JSON with profile info
    F-->>U: Render profile (avatar, fullName, description)
```


## 2 Authentication
### 2.1 Sign up
<img src="../images/image-3.png" alt="drawing" width="300"/>

```mermaid
sequenceDiagram
    participant U as User (Browser)
    participant F as Frontend (Sign Up Page)
    participant B as Backend (Auth API)
    participant DB as Database

    U->>F: Fill and submit sign up form
    F->>B: POST /api/signup (email, password, fullName, age)
    
    alt Email is null or invalid, passwod is null
        B-->>F: 400 Bad Request ("Email or Password is required")
        F-->>U: Show error message
    else Email provided
        B->>DB: SELECT * FROM Users WHERE email = ?
        DB-->>B: User found or not

        alt Email already exists
            B-->>F: 409 Conflict ("Email already registered")
            F-->>U: Show error message
        else Email is unique
            B->>B: Hash password
            B->>DB: INSERT INTO Users (...)
            DB-->>B: Insert success (userId)
            B-->>F: 201 Created
            F-->>U: Redirect to login or home page
        end
    end

```

### 2.2 Sign in
<img src="../images/image-4.png" alt="drawing" width="300"/>


```mermaid
sequenceDiagram
    participant U as User (Browser)
    participant F as Frontend (App)
    participant B as Backend (Auth API / Protected APIs)
    participant DB as Database

    U->>F: Submit email + password
    F->>B: POST /api/signin
    B->>DB: SELECT * FROM Users WHERE email = ?
    DB-->>B: Return user with hashed password
    B->>B: Compare passwords
    alt Password matches
        B-->>F: 200 OK + JWT token
        F-->>U: Store token (e.g. localStorage)
    else Invalid password
        B-->>F: 401 Unauthorized
    end

    U->>F: Try to access protected page (e.g. save image)
    F->>B: Request with Authorization: Bearer <token>
    B->>B: Verify JWT signature and expiration
    alt Token is valid
        B->>DB: Proceed with protected DB action
        DB-->>B: Return data
        B-->>F: 200 OK
        F-->>U: Show protected content
    else Token is missing/invalid/expired
        B-->>F: 401 Unauthorized
        F-->>U: Redirect to login or show error
    end
```