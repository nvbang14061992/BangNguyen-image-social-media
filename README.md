# BangNguyen-image-social-media

The application for upload, find, and manage images

# 1. Sequence diagrams

- All sequence diagrams for this application are listed in [diagrams](./Document/diagrams/diagram.md)

# 2. Set up

## 2.1 Resource requried

- Docker and mysql image
- Visual studio code
- At least 500 MB disk for image storage

## 2.2 Database info

### 2.2.1 Technology

- This app uses mysql database containerized in docker image with port `3307:3306`. port `3307` is recommended, you can change `3307` to other port in property `DATABASE_URL` of the `.env` file.
- ORM for this app is prisma, please check the dependencies to check the version of that [dependency](package.json)

### 2.2.2 Approach

- Database first is also the way this app established, the tables were created before app models.

- Tables for this app are created by [db.sql](./db/db.sql)

## 2.3 .env

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
> - `YourDataBaseName` MUST match the creation in the [db.sql](./db/db.sql)

> - `ACCESS_TOKEN_EXPIRED_IN` and `REFRESH_TOKEN_EXPIRED_IN` can be `1m` or `1h`, etc. but `1d` is recommend for testing purpose.

> - `WINDOWS_RATE_LIMITER` is the liimt windows for get access to all api again, it is in minisecond, you can input just 3000 for testing.

> - `MAX_RATE_LIMITER` is number of requests that you can send, it exceeding, you can only send more request after WINDOWS_RATE_LIMITER (ms).

## 2.4. Docker setup

- Mysql image:

```terminal
docker run --name mysql-image-name -e MYSQL_ROOT_PASSWORD=YourDataBasePassword -d -p 3307:3306 mysql
```

## 2.5 BackEnd app

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

- You can use export of postman collection in [Add_export_of_Postman_collection]() for testing api.
- This export including some scripts and global variables for avoiding some rework of login, get tokens

# 3. API description

## Check server

#### endpoint

```api
GET api/
```

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

## 3.1 Auth

### 3.1.1 - register

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

```json
None
```

### 3.1.2 - login

#### endpoint:

```api
POST api/auth/login
```

for example

```api
localhost:3000/api/auth/login
```

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
> If you use postman script for retrive `accessToken` and `refreshToken` you can use below script

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

## 3.2 image

### 3.2.1 get images

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

### 3.2.2 get one image

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

### 3.2.3 create images

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

## 3.3 save-image

### 3.3.1 save an image

#### endpoint:

```api
POST api/save-image/toggle-save
```

This endpoint is used for user to save an image in detail view page of an image. It work the same way as like button on facebook where user will toggle the save button to change state of the image between `saved` or `unsave`.

#### Parameters

```json
None
```

#### header

| Header        | Type         | Description     |
| ------------- | ------------ | --------------- |
| Authorization | Bearer Token | use accessToken |

#### body

**_postman script_**

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

## 3.4 detail image

These api are used for detail view page for an image where user can see:

- The image
- Posted user
- Save infor
- Comments for this image
- Create a comment for this image
- Toggle save (sent via `save-image` api) in [3.3.1](#331-save-an-image)

### 3.4.1 get image and posted user

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

### 3.4.2 get save info

#### endpoint:

```api
GET api/detail-image/save
```

This endpoint is used for get if selected image is saved, `data` field in response will return `true` if this image is saved or `false` this image is not saved or not found (this will not happen because the front end will send exactly the image id via selecting action from user).

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

### 3.4.3 get all comments for image

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

### 3.4.4 add comment for image

#### endpoint:

```api
POST api/detail-image/comments
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

## 3.5 user

# 4. Security testing

# 4.1 Ratelimiting

# 4.1 XSS-Protection

The server api is protected from XSS to run javascript to get headers information, we can use check server api and postman for seeing the header X-XSS-Protection

<img src="./Document//images/HTTP_header_protection.png" alt="drawing" width="1000"/>
