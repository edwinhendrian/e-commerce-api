# Auth & Users API Spec

## Register User

Endpoint : POST /api/auth/register

Request Body :

```json
{
  "email": "edwinhendrian23@gmail.com",
  "name": "Edwin Hendrian",
  "password": "rahasia"
}
```

Response Body (Success) :

```json
{
  "data": {
    "email": "edwinhendrian23@gmail.com",
    "name": "Edwin Hendrian"
  }
}
```

Response Body (Fail) :

```json
{
  "errors": "Email already registered"
}
```

## Login User

Endpoint : POST /api/auth/login

Request Body :

```json
{
  "email": "edwinhendrian23@gmail.com",
  "password": "rahasia"
}
```

Response Body (Success) :

```json
{
  "data": {
    "email": "edwinhendrian23@gmail.com",
    "name": "Edwin Hendrian",
    "token": "<session_id_generated>"
  }
}
```

Response Body (Fail) :

```json
{
  "errors": "Email or password is wrong"
}
```

## Logout User

Endpoint : DELETE /api/auth/logout

Headers :

- authorization: token

Response Body (Success) :

```json
{
  "data": true
}
```

Response Body (Fail) :

```json
{
  "errors": "Unauthorized"
}
```

## Get All Users

Endpoint : GET /api/users

Headers :

- authorization: token

Response Body (Success) :

```json
{
  "data": [
    {
      "email": "edwinhendrian23@gmail.com",
      "name": "Edwin Hendrian"
    },
    {
      "email": "user2@gmail.com",
      "name": "User 2"
    }
  ]
}
```

Response Body (Fail) :

```json
{
  "errors": "Unauthorized"
}
```

## Get User

Endpoint : GET /api/users/:id

Headers :

- authorization: token

Response Body (Success) :

```json
{
  "data": {
    "email": "edwinhendrian23@gmail.com",
    "name": "Edwin Hendrian"
  }
}
```

Response Body (Fail) :

```json
{
  "errors": "Unauthorized"
}
```

## Update User

Endpoint : PATCH /api/users/:id

Headers :

- authorization: token

Request Body :

```json
{
  "name": "Edwin Hendrian", // optional
  "password": "rahasia" // optional
}
```

Response Body (Success) :

```json
{
  "data": {
    "email": "edwinhendrian23@gmail.com",
    "name": "Edwin Hendrian"
  }
}
```

Response Body (Fail) :

```json
{
  "errors": "Unauthorized"
}
```

## Delete User

Endpoint : DELETE /api/users/:id

Headers :

- authorization: token

Response Body (Success) :

```json
{
  "data": true
}
```

Response Body (Fail) :

```json
{
  "errors": "Unauthorized"
}
```
