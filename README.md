# Passport-Local & Express-Session Demonstration
demonstrating /login /logout authenticated:/profile and /home


this is working with cookies, cookie is signed, so we can trust them when they return to us. We should not be storing sensible data in the cookie, more or less kind of id is enough to store on the browser. Then browser responds us the cookie, express-session verifies its integrity, passport deserializes the user based on the id and makes req.session, req.user, res.isAuthenticated available to us.

we demonstrate the persistance with sqllite3 session store, so we can restart the server and still be logged in.

## Express-Session Documentation
https://www.npmjs.com/package/express-session#compatible-session-stores

## Session Store SqlLite3
https://www.npmjs.com/package/connect-sqlite3

