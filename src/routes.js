'use strict';

// load modules
const express = require('express');
const router = express.Router();
const {User, Course, Review} = require('./models');

// User routes
// TODO add authentication and finish route
router.get('/users', (req, res, next) => {
    next();
});

router.post('/users', (req, res, next) => {
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
router.get('/courses', (req, res, next) => {
    next();
});

router.get('/courses/:courseId', (req, res, next) => {
    next();
});

router.post('/courses', (req, res, next) => {
    next();
});

router.put('/courses/:courseId', (req, res, next) => {
    next();
});

router.post('/courses/:courseId/reviews', (req, res, next) => {
    next();
})

module.exports = router;
