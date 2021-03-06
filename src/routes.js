'use strict';

// load modules
const express = require('express');
const auth = require('basic-auth');
const router = express.Router();
const {User, Course, Review} = require('./models');

// Param handler
    // Looks for a courseId and sets the document to req.course
router.param('courseId', (req, res, next,id) => {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        Course.findById(req.params.courseId, (err, doc) => {
            if (err) return next(err);
            if (!doc) {
                err = new Error('File Not Found');
                err.status = 404;
                return next(err);
            }
            req.course = doc;
            return next();
        });
    } else {
        return res.sendStatus(404);
    }
        
});

// Authentication Middleware
const authenticateUser = (req, res, next) => {
    const credentials = auth(req);
    if (credentials) {
        User.authenticate(credentials.name, credentials.pass, (err, user) => {
            if (err || !user) {
                const error = new Error('Wrong email or password.');
                error.status = 401;
                return next(error);
            }
            req.currentUser = user;
            return next();
        }); 
    } else {
        const err = new Error('Provide credentials.');
        err.status = 400;
        return next(err);
    }
};

// User routes
// Returns current user
router.get('/users', authenticateUser, (req, res, next) => {
    res.json(req.currentUser);
});

// Creates a new user
router.post('/users', (req, res, next) => {
    if (! req.body.confirmPassword) {
        const err = new Error('Please confirm password.');
        err.status = 400;
        return next(err);
    } else if (req.body.password !== req.body.confirmPassword) {
        const err = new Error('Passwords do not match.');
        err.status = 400;
        return next(err);
    }
    let user = new User(req.body);
    user.save((err, user) => {
        if (err) {
            err.status = 400;
            return next(err);
        }
        res.status(201)
            .set('Location', '/')
            .end();
    });
});

// Course routes
// Returns all course titles
router.get('/courses', (req, res, next) => {
    Course.find({}, {_id: true, title: true}, (err, courses) => {
        if (err) return next(err);
        res.json(courses);
    });
});

// Returns all info for a single course
router.get('/courses/:courseId', (req, res, next) => {
    Course.populate(req.course, 
        [
            {path: 'user', select: '_id fullName'}, 
            {path: 'reviews', model: 'Review', populate: 
                {path: 'user', model: 'User', select: '_id fullName'}
            }
        ], 
        (err, course) => {
            if (err) return next(err);
            res.json(course);
    });
});

// Creates a new course
router.post('/courses', authenticateUser, (req, res, next) => {
    let user = {"user": req.currentUser._id};
    let course = Object.assign(user, req.body);
    let createCourse = new Course(course);
    createCourse.save((err, course) => {
        if (err) {
            err.status = 400;
            return next(err);
        }
        res.status(201)
            .set('Location', '/')
            .end();
    });
});

// Updates a course
router.put('/courses/:courseId', authenticateUser, (req, res, next) => {
    Course.updateOne(req.course, req.body, {runValidators: true}, (err, result) => {
        if (err) {
            err.status = 400;
            return next(err);
        }
        res.status(204).end();
    });
});

// Creates a review
router.post('/courses/:courseId/reviews', authenticateUser, (req, res, next) => {
    // Ensure course creator cannot review own course
    if (String(req.currentUser._id) === String(req.course.user)) {
        const err = new Error('Cannot post a review to your own course.');
        err.status = 400;
        return next(err);
    }
    let user = {"user": req.currentUser._id};
    let review = Object.assign(user, req.body);
    let createReview = new Review(review);
    createReview.save((err, review) => {
        if (err) {
            err.status = 400;
            return next(err);
        }
        req.course.reviews.push(review);
        req.course.save((err, course) => {
            if (err) return next(err);
            res.status(201)
                .set('Location', '/')
                .end();
        });
    });
});

module.exports = router;
