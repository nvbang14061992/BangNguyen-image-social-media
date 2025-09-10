# BangNguyen-image-social-media

The application for upload, find, and manage images

# 1. Sequence diagrams 🗺️

- All sequence diagrams for this application are listed in [diagrams](./Document/diagrams/diagram.md)

# 2. Set up 🧑‍🔧

## 2.1 Resource requried 💻

- Docker and mysql image
- Visual studio code
- At least 500 MB disk for image storage

## 2.2 Database info 🧳

### 2.2.1 Technology

- This app uses mysql database containerized in docker image with port `3307:3306`. The port `3307` is recommended, you can change `3307` to other port in property `DATABASE_URL` of the `.env` file.
- ORM for this app is prisma, please check the dependencies to check the version of that [dependency](package.json)

### 2.2.2 Approach

- Database first is the way this app established, tables are created before app models.

- Tables for this app are created by [db.sql](./db/db.sql)

## 2.3 .env 🪙

```properties
DATABASE_URL=mysql://YourUserName:DataBasePassword@127.0.0.1:3307/YourDataBaseName
ACCESS_TOKEN_SECRET=YOUR_ACCESS_TOKEN_SECRET
REFRESH_TOKEN_SECRET=YOUR_REFRESH_TOKEN_SECRET
ACCESS_TOKEN_EXPIRED_IN=YOUR_EXPECTED_EXPIRED_DURATION
REFRESH_TOKEN_EXPIRED_IN=YOUR_EXPECTED_EXPIRED_DURATION
WINDOWS_RATE_LIMITER=3600000
MAX_RATE_LIMITER=100
```

> [!NOTE]
>
> - `YourDataBaseName` MUST match the created one in the [db.sql](./db/db.sql)

> - `ACCESS_TOKEN_EXPIRED_IN` and `REFRESH_TOKEN_EXPIRED_IN` can be `1m` or `1h`, etc. but `1d` is recommend for testing purpose.

> - `WINDOWS_RATE_LIMITER` is the limit windows for get access to all protected apis again, it is in minisecond, you can input just 3000 for testing.

> - `MAX_RATE_LIMITER` is number of requests that you can send, if the number of api calling exceeds this value, you can only send more request(s) after WINDOWS_RATE_LIMITER (ms).

## 2.4. Docker setup 🐳

- Mysql image:

```terminal
docker run --name mysql-image-name -e MYSQL_ROOT_PASSWORD=YourDataBasePassword -d -p 3307:3306 mysql
```

> [!NOTE]
> Change the password of this command to your expected password, and keep it secret, you don't want to loose it 😊.

## 2.5 BackEnd app 🚀

### 2.5.1 General set up

#### install nodemodules

```bash
npm i
```

#### run backend app

```terminal
npm run dev
```

> [!NOTE]
> Protected endpoints need authorization to access data, thus please get accessToken first in auth service.

### 2.5.2 Prisma setup

#### init prisma (run once)

> [!NOTE]
> Only run this after setup backend

```terminal
npx prisma init
```

#### pull data from database by prisma

```terminal
npm run prisma
```

> [!NOTE]
> Re-run this if you have any change for tables' columns.

## 2.6 Test (manually)

- You can use export of postman collection in [Add_export_of_Postman_collection](./tests/api-test/Bang-image-social-media.postman_collection.json) for testing api.
- This export including some scripts and global variables for avoiding some rework of login, get tokens

# 3. API description 📜

## Check server 👋

#### endpoint

```api
GET api/
```

For example: `localhost:3000/api`

#### Parameters

```json
None
```

#### header

`None`

#### body

`None`

#### response

```json
"Hello From Bang Image Social Media!!!"
```

## 3.1 Authentication 👮

### 3.1.1 - Register

#### endpoint

```api
POST api/auth/register
```

#### Parameters

```json
None
```

#### header

```json
None
```

#### body

**_example_**

```json
{
  "full_name": "Peter Schuze",
  "email": "PeterSch@example.com",
  "password": "passABC123#@"
}
```

### 3.1.2 - login

#### endpoint:

```api
POST api/auth/login
```

The `accessToken` and `refeshToken` are sent back to frontend not in body, but in the header where cookie storing and HTTP only activated.

#### Parameters

```json
None
```

#### header

`None`

#### body

**_example_**

```json
{
  "email": "PeterSch@example.com",
  "password": "passABC123#@"
}
```

#### response

**_example_**

```json
{
  "status": "success",
  "statusCode": 200,
  "message": "Get tokens successfully",
  "data": true
}
```

**_Cookie(postman view)_**
| Name | value | Domain | Path | Expire | HttpOnly | Secure |
| --------- | --------------------------- | ------- |------- |------- |------- |------- |
| authTokens | %7B%22accessToken%22%3... | 127.0.0.1 | / | Session | true | false |

> [!NOTE]
> If you use postman script for retrive `accessToken` and `refreshToken`, you can use below script:

```javascript
const data = pm.response.json();

let rawCookie = pm.cookies.get("authTokens");

if (rawCookie) {
  try {
    // Parse the JSON stored in the cookie
    let tokens = JSON.parse(rawCookie);

    // Set tokens as global variables
    pm.globals.set("accessToken", tokens.accessToken);
    pm.globals.set("refreshToken", tokens.refreshToken);

    console.log("Tokens extracted and stored globally:", tokens);
  } catch (e) {
    console.error("Failed to parse token cookie:", e);
  }
} else {
  console.warn("authTokens cookie not found");
}
```

### 3.1.3 - refesh token

#### endpoint:

```api
POST api/auth/refresh-token
```

#### Parameters

```json
None
```

#### header

```json
None
```

#### body

**_postman script_**

```json
{
  "accessToken": "{{accessToken}}",
  "refreshToken": "{{refreshToken}}"
}
```

#### response

**_example_**

```json
{
  "status": "success",
  "statusCode": 200,
  "message": "Refresh tokens successfully",
  "data": true
}
```

## 3.2 Image 🖼️

### 3.2.1 Get all images

#### endpoint:

```api
GET api/image
```

This endpoint is used for home page where all images shown after user logged in and he or she can filter images by `name` or `description`.

#### Parameters

**_Query_**
| Parameter | Description | Example |
| --------- | ---------------------------------------- | -------------------------------------- |
| page | (int) page number (for pagination) | 2 |
| pageSize | (int) number of items (images) in a page | 4 |
| filter | (json) filter to apply for frontend | {"name": "ol"} or {"description": "1"} |

#### header

| Header        | Type         | Description     |
| ------------- | ------------ | --------------- |
| Authorization | Bearer Token | use accessToken |

#### body

```json
None
```

#### response

**_example_**

```json
{
    "status": "success",
    "statusCode": 200,
    "message": "Get all images successfully",
    "data": {
        "page": 1,
        "pageSize": 4,
        "totalItem": 3,
        "totalPage": 1,
        "items": [
            {
                "id": 14,
                "name": "old image1",
                "pathToImage": "image_local-1757095934102-296187893.jpg",
                "description": "this is old image1",
                "userId": 2,
                "deletedBy": 0,
                "isDeleted": false,
                "deletedAt": null,
                "createdAt": "2025-09-05T18:12:14.000Z",
                "updatedAt": "2025-09-05T18:12:14.000Z"
            },
            {
                "id": 13,
                "name": "old image1",
                "pathToImage": "image_local-1757095932943-144569712.jpg",
                "description": "this is old image1",
                "userId": 2,
                "deletedBy": 0,
                "isDeleted": false,
                "deletedAt": null,
                "createdAt": "2025-09-05T18:12:13.000Z",
                "updatedAt": "2025-09-05T18:12:13.000Z"
            },
            ...
        ]
    }
}
```

> [!NOTE]
> Make sure you put the `json` format for `filter` parameter.

### 3.2.2 Get one image

#### endpoint:

```api
GET api/image/:id
```

This endpoint is used for home page where all images shown after user logged in and he or she can filter images by `name` or `description`.

#### Parameter

**_Path_**
| Parameter | Description | Example |
| --------- | ----------- | ------- |
| id | (int) id of the image | 13 |

#### header

| Header        | Type         | Description     |
| ------------- | ------------ | --------------- |
| Authorization | Bearer Token | use accessToken |

#### body

**_example_**

```json
None
```

#### response

**_example_**

```json
{
  "status": "success",
  "statusCode": 200,
  "message": "Get image #14 successfully",
  "data": {
    "id": 14,
    "name": "old image1",
    "pathToImage": "image_local-1757095934102-296187893.jpg",
    "description": "this is old image1",
    "userId": 2,
    "deletedBy": 0,
    "isDeleted": false,
    "deletedAt": null,
    "createdAt": "2025-09-05T18:12:14.000Z",
    "updatedAt": "2025-09-05T18:12:14.000Z"
  }
}
```

### 3.2.3 Create an image

#### endpoint:

```api
POST api/image/
```

This endpoint is used for uploading an image.

#### Parameters

```json
None
```

#### header

| Header        | Type         | Description     |
| ------------- | ------------ | --------------- |
| Authorization | Bearer Token | use accessToken |

#### body

> [!TIP]
>
> - Use postman for uploading file easier.
> - Use `form-data` to upload file

| key         | value                       | Description                          |
| ----------- | --------------------------- | ------------------------------------ |
| image       | (file) upload file          | select a file from you local machine |
| name        | (string) old image1         | input name for the image             |
| description | (string) this is old image1 | input description for the image      |

## 3.3 Save-image 🩷

### 3.3.1 Save an image

#### endpoint:

```api
POST api/save-image/toggle-save
```

This endpoint is used for user to save an image in detail view page of an image. It works the same way as like button on facebook where user will toggle the save button to change state of the image between `saved` or `unsave`.

#### Parameters

```json
None
```

#### header

| Header        | Type         | Description     |
| ------------- | ------------ | --------------- |
| Authorization | Bearer Token | use accessToken |

#### body

```json
{
  "imageId": 14
}
```

#### response

**_example_**

```json
{
  "status": "success",
  "statusCode": 200,
  "message": "Create saveImage successfully",
  "data": {
    "userId": 2,
    "imageId": 14,
    "deletedBy": 0,
    "isDeleted": false,
    "deletedAt": null,
    "createdAt": "2025-09-06T15:14:43.000Z",
    "updatedAt": "2025-09-06T15:14:43.000Z"
  }
}
```

## 3.4 Detail image 🎴

These api are used for detail view page for an image where user can see:

- The image
- Posted user
- Save infor
- Comments for this image
- Create a comment for this image
- Toggle save (sent via `save-image` api) in [3.3.1](#331-save-an-image)

### 3.4.1 Get image and posted user

#### endpoint:

```api
GET api/detail-image/image
```

This endpoint is used for getting image (the public url for this image) and posted user.
The public url has the form as: `localhost:3000/images/image_local-1757095934102-296187893.jpg`

#### Parameters

**_Query_**
| Parameter | Description | Example |
| --------- | ----------- | ------- |
| id | (int) id of the selected image | 14 |

#### header

| Header        | Type         | Description     |
| ------------- | ------------ | --------------- |
| Authorization | Bearer Token | use accessToken |

#### body

```json
None
```

#### response

**_example_**

```json
{
  "status": "success",
  "statusCode": 200,
  "message": "Get image and posted user successfully",
  "data": {
    "id": 14,
    "name": "old image1",
    "pathToImage": "images/image_local-1757095934102-296187893.jpg",
    "description": "this is old image1",
    "userId": 2,
    "deletedBy": 0,
    "isDeleted": false,
    "deletedAt": null,
    "createdAt": "2025-09-05T18:12:14.000Z",
    "updatedAt": "2025-09-05T18:12:14.000Z"
  }
}
```

### 3.4.2 Get save info

#### endpoint:

```api
GET api/detail-image/save
```

This endpoint is used for showing if selected image was saved, `data` field in response will return `true` if this image is saved or `false` this image is not saved or not found (this will not happen because the front end will send exactly the image id via selecting action from user).

#### Parameters

**_Query_**
| Parameter | Description | Example |
| --------- | ----------- | ------- |
| id | (int) id of the selected image | 14 |

#### header

| Header        | Type         | Description     |
| ------------- | ------------ | --------------- |
| Authorization | Bearer Token | use accessToken |

#### body

```json
None
```

#### response

**_example_**

```json
{
  "status": "success",
  "statusCode": 200,
  "message": "Get save successfully",
  "data": true
}
```

### 3.4.3 Get all comments for image

#### endpoint:

```api
GET api/detail-image/comments
```

This endpoint is used for get all comments and commented user ids.

#### Parameters

**_Query_**
| Parameter | Description | Example |
| --------- | ----------- | ------- |
| id | (int) id of the selected image | 14 |

#### header

| Header        | Type         | Description     |
| ------------- | ------------ | --------------- |
| Authorization | Bearer Token | use accessToken |

#### body

```json
None
```

#### response

**_example_**

```json
{
  "status": "success",
  "statusCode": 200,
  "message": "Get all comments to image successfully",
  "data": [
    {
      "id": 5,
      "userId": 2,
      "imageId": 14,
      "content": "This is comment from PeterSch@example.com again 1",
      "deletedBy": 0,
      "isDeleted": false,
      "deletedAt": null,
      "createdAt": "2025-09-06T15:37:36.000Z",
      "updatedAt": "2025-09-06T15:37:36.000Z"
    }
  ]
}
```

### 3.4.4 Add comment for image

#### endpoint:

```api
POST api/detail-image/comment/:id
```

This endpoint is used for posting a new comment from logged in user, and return back all comments and commented user ids, this helps frontend voiding recall [get comments](#343-get-all-comments-for-image)

#### Parameters

**_Query_**
| Parameter | Description | Example |
| --------- | ----------- | ------- |
| id | (int) id of the selected image | 14 |

#### header

| Header        | Type         | Description     |
| ------------- | ------------ | --------------- |
| Authorization | Bearer Token | use accessToken |

#### body

```json
{
  "content": "This is comment from PeterSch@example.com again 2"
}
```

#### response

**_example_**

```json
{
  "status": "success",
  "statusCode": 200,
  "message": "Get all comments to image successfully",
  "data": [
    {
      "id": 5,
      "userId": 2,
      "imageId": 14,
      "content": "This is comment from PeterSch@example.com again 1",
      "deletedBy": 0,
      "isDeleted": false,
      "deletedAt": null,
      "createdAt": "2025-09-06T15:37:36.000Z",
      "updatedAt": "2025-09-06T15:37:36.000Z"
    },
    {
      "id": 7,
      "userId": 2,
      "imageId": 14,
      "content": "This is comment from PeterSch@example.com again 2",
      "deletedBy": 0,
      "isDeleted": false,
      "deletedAt": null,
      "createdAt": "2025-09-06T15:51:17.000Z",
      "updatedAt": "2025-09-06T15:51:17.000Z"
    }
  ]
}
```

## 3.5 User 🙂

### 3.5.1 Get user info

#### endpoint:

```api
GET api/user/
```

This endpoint is used for getting user name and email.

#### Parameters

```json
None
```

#### header

| Header        | Type         | Description     |
| ------------- | ------------ | --------------- |
| Authorization | Bearer Token | use accessToken |

#### body

```json
None
```

#### response

**_example_**

```json
{
  "status": "success",
  "statusCode": 200,
  "message": "Get user info successfully",
  "data": {
    "userName": null,
    "email": "PeterSch@example.com"
  }
}
```

### 3.5.2 Update user profile

#### endpoint:

```api
PATCH api/user/
```

This endpoint is used for updatting user's profile inlcuding email, fullName, age, description. This does not need parameter `:id` because only logged in user can change his / her profile but not other profile(s).

#### Parameters

```json
None
```

#### header

| Header        | Type         | Description     |
| ------------- | ------------ | --------------- |
| Authorization | Bearer Token | use accessToken |

#### body

**_example_**

```json
{
  "fullName": "Peter schuz",
  "age": 32
}
```

#### response

**_example_**

```json
{
  "status": "success",
  "statusCode": 200,
  "message": "Updated user profile!!!",
  "data": {
    "id": 2,
    "email": "PeterSch@example.com",
    "fullName": "Peter schuz",
    "age": 32,
    "avatar_path": "avatar_local-1757096528333-881038385.jpg",
    "description": null,
    "deletedBy": 0,
    "isDeleted": false,
    "deletedAt": null,
    "createdAt": "2025-09-01T14:40:16.000Z",
    "updatedAt": "2025-09-07T14:27:54.000Z",
    "passwordChangedAt": null,
    "passwordResetToken": "07cec13007076b3c16982cbfccb2d2b6d50f71fa884b0616a7a3a00dca787074",
    "passwordResetExpires": "2025-09-06T05:01:28.000Z"
  }
}
```

### 3.5.3 Get user posted images

#### endpoint:

```api
GET api/user/uploads
```

This endpoint is used for getting all images _uploaded_ by logged in user page. Frontend can use the public url to see the picture e.g. `localhost:3000/images/image_local-1757095923376-308307888.jpg`.

#### Parameters

**_Query_**
| Parameter | Description | Example |
| --------- | ---------------------------------------- | -------------------------------------- |
| page | (int) page number (for pagination) | 2 |
| pageSize | (int) number of items (images) in a page | 4 |
| filter | (json) filter to apply for frontend | {"name": "ol"} or {"description": "1"} |

#### header

| Header        | Type         | Description     |
| ------------- | ------------ | --------------- |
| Authorization | Bearer Token | use accessToken |

#### body

```json
None
```

#### response

**_example_**

```json
{
  "status": "success",
  "statusCode": 200,
  "message": "Get all posted images successfully",
  "data": {
    "page": 1,
    "pageSize": 2,
    "totalItem": 5,
    "totalPage": 3,
    "items": [
      {
        "id": 16,
        "name": "old image1",
        "pathToImage": "images/image_local-1757255826569-700919710.jpg",
        "description": "this is old image1",
        "userId": 2,
        "deletedBy": 0,
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2025-09-07T14:37:07.000Z",
        "updatedAt": "2025-09-07T14:39:56.000Z"
      },
      {
        "id": 15,
        "name": "old image1",
        "pathToImage": "images/image_local-1757170831791-552326431.jpg",
        "description": "this is old image1",
        "userId": 2,
        "deletedBy": 0,
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2025-09-06T15:00:32.000Z",
        "updatedAt": "2025-09-07T14:39:56.000Z"
      }
    ]
  }
}
```

### 3.5.4 Get user saved images

#### endpoint:

```api
GET api/user/saves
```

This endpoint is used for getting all images _saved_ by logged in user page. Frontend can use the public url to see the picture e.g. `localhost:3000/images/image_local-1757095923376-308307888.jpg`.

#### Parameters

**_Query_**
| Parameter | Description | Example |
| --------- | ---------------------------------------- | -------------------------------------- |
| page | (int) page number (for pagination) | 2 |
| pageSize | (int) number of items (images) in a page | 4 |
| filter | (json) filter to apply for frontend | {"name": "ol"} or {"description": "1"} |

#### header

| Header        | Type         | Description     |
| ------------- | ------------ | --------------- |
| Authorization | Bearer Token | use accessToken |

#### body

```json
None
```

#### response

**_example_**

```json
{
  "status": "success",
  "statusCode": 200,
  "message": "Get all saved images successfully",
  "data": {
    "page": 1,
    "pageSize": 2,
    "totalItem": 4,
    "totalPage": 2,
    "items": [
      {
        "id": 16,
        "name": "old image1",
        "pathToImage": "images/images/image_local-1757255826569-700919710.jpg",
        "postedUserId": 2
      },
      {
        "id": 15,
        "name": "old image1",
        "pathToImage": "images/images/image_local-1757170831791-552326431.jpg",
        "postedUserId": 2
      }
    ]
  }
}
```

### 3.5.5 Remove an image

#### endpoint:

```api
DELETE api/user/delete-image/:id
```

This endpoint is used for deleting an iamge in user page where he or she selects (click on) the image.

#### Parameter

**_Path_**
| Parameter | Description | Example |
| --------- | ----------- | ------- |
| id | (int) id of the image | 13 |

#### header

| Header        | Type         | Description     |
| ------------- | ------------ | --------------- |
| Authorization | Bearer Token | use accessToken |

#### body

```json
None
```

#### response

**_example_**

```json
None
```

### 3.5.6 Upload avatar local

#### endpoint:

```api
POST api/user/avatar-local
```

This endpoint is used for user uploading an avatar image. This happen when user press upload button on update profile page. Frontend can take the image via url in response e.g. `localhost:3000/avatars/avatar_local-1757260624715-376072597.jpg` .

#### Parameters

```json
None
```

#### header

| Header        | Type         | Description     |
| ------------- | ------------ | --------------- |
| Authorization | Bearer Token | use accessToken |

#### body

> [!TIP]
>
> - Use postman for uploading file easier.
> - Use `form-data` to upload file

| key   | value              | Description                          |
| ----- | ------------------ | ------------------------------------ |
| image | (file) upload file | select a file from you local machine |

#### response

**_example_**

```json
{
  "status": "success",
  "statusCode": 200,
  "message": "Get user info successfully",
  "data": {
    "id": 2,
    "email": "PeterSch@example.com",
    "fullName": "Peter schuz",
    "age": 32,
    "avatar_path": "avatars/avatar_local-1757260624715-376072597.jpg",
    "description": null,
    "deletedBy": 0,
    "isDeleted": false,
    "deletedAt": null,
    "createdAt": "2025-09-01T14:40:16.000Z",
    "updatedAt": "2025-09-07T15:57:04.000Z",
    "passwordChangedAt": null,
    "passwordResetToken": "07cec13007076b3c16982cbfccb2d2b6d50f71fa884b0616a7a3a00dca787074",
    "passwordResetExpires": "2025-09-06T05:01:28.000Z"
  }
}
```

# 4. Security testing

# 4.1 Ratelimiting

# 4.1 XSS-Protection

The server api is protected from XSS to run javascript to get headers information by `helmetjs`. We can use [check server api](#check-server-) and postman for seeing the resposne header X-XSS-Protection

<img src="./Document//images/HTTP_header_protection.png" alt="drawing" width="1000"/>

# 5. Swagger

> [!TIP]
> As mentioned, except the authentication endpoints, all other endpoints are protect via `tokens`. However, the `tokens` are sent via cookies, thus you can not see them also on swagger response, thus you need to workaround by using postman to login and see `accessToken` via cookie on postman.
