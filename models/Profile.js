const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },    
    country: {
        type: String
    },
    city: {
        type: String
    },
    birthdate: {
        type: Date,        
    },
    gender: {
        type: String,          
    },
    bio: {
        type: String
    },   
    photo: {
        type: String
    },
    education: [ 
        {
            school: {
                type: String,
                required: true
            },            
            from: {
                type: Date,
                required: true
            },
            to: {
                type: Date,
                required: true
            },            
            description: {
                type: String,
            }
        }
    ],    
    date: {
        type: Date,
        default: Date.now
    }

});
module.exports = Profile = mongoose.model('profile', profileSchema);