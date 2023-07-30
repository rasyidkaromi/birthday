# birthday

<div>
  <br>
</div>

```
1. install depedencies yarn
2. start server api | yarn startp.api 
3. start server email | yarn startp.email 
4. call localhost:3000/generateuser 1000 user and birthdayStatus data or reset localhost:3000/reset to delete all data
5. start server system | yarn startp.system 
to accessed or change digitalenvision api or localhost server email, just change in line 38, 59, in /util/Helper.system.ts
6. yarn test | simple test
```

------------------------------------------------------------
------------------------------------------------------------

<div>
  <br>
</div>

## Server api
```
- POST | localhost:3000/user
{
    "firstName": string,
    "lastName": string,
    "email": string,
    "birthdayDate": time string,
    "location": string,
    "anniversaryDate": string
}

- PUT | localhost:3000/user
{
    "firstName": string,
    "lastName": string,
}

- DELETE | localhost:3000/user
{
    id: string
}

- GET | localhost:3000/generateuser 
    to generate 1000 user with fullname, birth date with their time zone, email, location and message status with birthdayStatus data table for test sending 1000 message

- GET | localhost:3000/reset
    to delete all user and birthdayStatus data table
```


## Server email

```
this server is same way with digitalenvision just very random between error code 400, 500, 502 returned or using digitalenvision with give 10% of the time this status code will be returned.
```

## Server system
```
system sending message api with two user local time zone "New York and Melbourne" with follow user zone and capability sending all unsent messages from a day with non duplicate and testable.
this code not use any database’s internal mechanisms.
```


