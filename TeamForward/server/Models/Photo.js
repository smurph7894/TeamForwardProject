const mongoose = require('mongoose');

const PhotoSchema = new mongoose.Schema({
    photoKey:{
        type:String
    },
});

const Photo = mongoose.model('photo',PhotoSchema);
module.exports = Photo;


