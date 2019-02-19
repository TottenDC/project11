'use strict';

// load modules
const express = require('express');
const router = express.Router();
const {User, Course, Review} = require('./models');

// Param handlers
router.param('courseId', (req, res, next,id) => {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        Course.findById(req.params.courseId, (err, doc) => {
            if (err) return next(err);
            if (!doc) {
                err = new Error('File Not Found');
                err.status(404);
                return next(err);
            }
            req.course = doc;
            return next();
        });
    } else {
        return res.sendStatus(404);
    }
        
});

// User routes
// TODO add authentication and finish route
router.get('/users', (req, res, next) => {
    next();
});

router.post('/users', (req, res, next) => {
    let user = new User(req.body);
    user.save((err, user) => {
        if (err) {
            err.status(400);
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
    Course.populate(req.course, {path: 'user reviews'}, (err, course) => {
        if (err) return next(err);
        res.json(course);
    });
});

router.post('/courses', (req, res, next) => {
    let course = new Course(req.body);
    course.save((err, course) => {
        if (err) {
            err.status(400);
            return next(err);
        }
        res.status(201)
            .set('Location', '/')
            .end();
    });
});

router.put('/courses/:courseId', (req, res, next) => {
    next();
});

router.post('/courses/:courseId/reviews', (req, res, next) => {
    next();
})

module.exports = router;
