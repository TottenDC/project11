'use strict';

// load modules
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Set up custom email validation
const validator = (value) => {
    if (/\w@\w/.test(value)) {
        if (/(\.com)$/.test(value)) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

const emailValidation = [validator, 'Please enter a valid email.']

// Schemas
const UserSchema = new Schema({
    fullName: {
        type: String, 
        required: [true, 'User name is required.']
    },
    emailAddress: {
        type: String, 
        required: [true,  'User email is required.'],
        unique: true,
        lowercase: true,
        validate: emailValidation
    },
    password: {
        type: String,
        trim: true, 
        required: [true, 'Password is required.']
    }
});

const ReviewSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId, ref: 'User'
    },
    postedOn: {
        type: Date, 
        default: Date.now()
    },
    rating: {
        type: Number, 
        required: [true, 'Please provide a rating.'],
        min: [1, 'Cannot rate lower than 1.'], 
        max: [5, 'Cannot rate higher than five.']
    },
    review: String
});

const CourseSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId, ref: 'User'
    },
    title: {
        type: String, 
        required: [true, 'Title is required.']
    },
    description: {
        type: String, 
        required: [true, 'Please provide a description.']
    },
    estimatedTime: String,
    materialsNeeded: String,
    steps:[
        {
            stepNumber: Number,
            title: {
                type: String, 
                required: [true, 'Step title is required.']
            },
            description: {
                type: String, 
                required: [true, 'Please provide a step description.']
            }
        }
    ],
    reviews: [
        {type: Schema.Types.ObjectId, ref: 'Review'}
    ]
});

// Create models
const User = mongoose.model('User', UserSchema);
const Review = mongoose.model('Review', ReviewSchema);
const Course = mongoose.model('Course', CourseSchema);

module.exports.User = User;
module.exports.Course = Course;
module.exports.Review = Review;
