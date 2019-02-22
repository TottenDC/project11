# TechDegree Unit 11 Project - Build a Course Rating API with Express

## Purpose:
* Learn to interface with a NoSQL database (MongoDB) using Mongoose.
* Build a RESTful API.
* Learn about authentication, authorization, and security. Implement basic practices. 
* Practice MongoDB, Mongoose, Express, and RESTful API design skills. 
## Note:
* Treehouse provided the starting API files (basic Express server startup in index.js), seed data for the DB, and some Postman requests for manual testing.
* I connected the database, set up all routes, created the models and methods, and built the tests.
## To Use:
Download the project, then in your terminal, navigate to the directory and use `npm install` to download all dependencies.
**Note:** You will need to install [npm](https://www.npmjs.com/get-npm).

Once installed, run `npm start` in your terminal to start a development server. Using [Postman](https://www.getpostman.com/downloads/), the following endpoints are available:

* /POST /api/users
    * Creates a new user. Supply the following as JSON:
        * fullName, emailAddress, password, and confirmPassword
* /GET /api/users
    * Returns the data for the authenticated user.
        * Ensure you send a basic authorization header. (emailAddress:password)
* /GET /courses
    * Returns all courses
* /POST /courses
    * Creates a new course. See models.js for schema.
    * Must send basic authorization header.
* /GET /courses/:courseId
    * Returns all info on a particular course
* /PUT /courses/:courseId
    * Updates a particular course.
    * Must send basic authorization header.
* /POST /courses/:courseId/reviews
    * Creates a new review for a course.
    * Must send basic authorization header.

To test, simply run `npm test` in the directory. 


Enjoy!
