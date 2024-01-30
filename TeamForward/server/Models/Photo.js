const mongoose = require('mongoose');

const PhotoSchema = new mongoose.Schema({
    photoKey:{
        type:String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
});

const Photo = mongoose.model('photo',PhotoSchema);
module.exports = Photo;


