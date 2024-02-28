# RESTful API
## Dependencies:
- package.json
- package-lock.json
```
cd ./api
npm install
```

## Index file:
- index.js [backend/index.js](https://github.com/danaespentz/ntua-software-engineering/blob/master/backend/index.js)

## Connection with PostgreSQL Database:
- connect.js [backend/connect.js](https://github.com/danaespentz/ntua-software-engineering/blob/master/backend/connect.js)

## API Functional Endpoints:
- bygenre.js
- title.js
- name.js
- searchtitle.js
- searchname.js
- login.js
- logout.js

## API Admin Endpoints:
- admin/healthcheck.js
- admin/resetall.js
- admin/usermod.js
- admin/users.js
- admin/upload/namebasics.js
- admin/upload/titlebasics.js
- admin/upload/titleakas.js
- admin/upload/titlecrew.js
- admin/upload/titleepisode.js
- admin/upload/titleratings.js
- admin/upload/titleprincipals.js

## SSL Certificates and Keys (https):
- certificates/localhost.crt
- certificates/localhost.csr
- certificates/hocalhost.decrypted.key
- certificates/localhost.ext
- certificates/localhost.key
- certificates/CA.key
- certificates/CA.pem
- certificates/CA.srl
