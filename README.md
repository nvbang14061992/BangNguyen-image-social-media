# BangNguyen-image-social-media
The application for upload, find, and manage images

# 1. Sequence diagrams
- All sequence diagrams for this application are listed in [diagrams](./Document/diagrams/diagram.md)

# 2. Set up 
## 2.1 Database info
### 2.1.1 Technology
- This app uses mysql database containerized in docker image with port ```3307:3306```. port ```3307``` is recommended, you can change ```3307``` to other port in property ```DATABASE_URL``` of the ```.env``` file.
- ORM for this app is prisma, please check the dependencies to check the version of that  [dependency](package.json)

### 2.1.2 Approach
- Database first is also the way this app established, the tables were created before app models.

- Tables for this app are created by [db.sql](./db/db.sql)

### Prisma setup
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

## 2.2 .env
```properties
DATABASE_URL=mysql://YourUserName:DataBasePassword@127.0.0.1:3307/YourDataBaseName
ACCESS_TOKEN_SECRET=YOUR_ACCESS_TOKEN_SECRET
REFRESH_TOKEN_SECRET=YOUR_REFRESH_TOKEN_SECRET
ACCESS_TOKEN_EXPIRED_IN=YOUR_EXPECTED_EXPIRED_DURATION
REFRESH_TOKEN_EXPIRED_IN=YOUR_EXPECTED_EXPIRED_DURATION
```
- ```YourDataBaseName``` MUST match the creation in the [db.sql](./db/db.sql)

- ```ACCESS_TOKEN_EXPIRED_IN``` and ```REFRESH_TOKEN_EXPIRED_IN``` can be ```1m``` or ```1h```, etc. but ```1d``` is recommend for testing purpose.

## 2.3 BackEnd app
### 2.3.1 set up
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

## 2.4 Test (manually)
- You can use export of postman collection in [Add_export_of_Postman_collection]() for testing api.
- This export including some scripts and global variables for avoiding some rework of login, get tokens

# 3. API description
