const {addPhoto, onePhoto, listAllPhotos, deletePhoto } = require("../client/s3Client");
const Photo = require("../models/Photo");
const fileSystem = require('fs');
const User = require("../models/User");
const { Readable } = require('stream');

module.exports = {
    addSinglePhoto: async (req, res) => {
        console.log("server req", req);
        const file = req.file;
        const destinationKey = `photos/${file.originalname}`;
        const body = fileSystem.createReadStream(file.path)

        try {
          await addPhoto(destinationKey, body);
            console.log("add photo to s3 successful")
        } catch (error) {
            console.error("create s3 photo failed", error)
            res.status(500).send(error.message);
          return;
        }

        try {
            await Photo.create({
                photoKey: `${file.originalname}`,
                userId: req.params.userId
            })
            console.log("photo created in db")
        } catch (error) {
            console.error("create photo in db failed", error)
            res.status(404).send(error.message)
            return;
        }

        try{
            await User.updateOne(
                {_id: req.params.userId},
                {$set: {s3ProfilePhotoKey: `${file.originalname}`}},
            )
            console.log("photokey added to user")
            res.json({photoKey: file.originalname});
        }catch (error) {
            console.error("add photokey to user failed", error)
            res.status(404).send(error.message)
            return;
        }
    },

    getPhoto: async (req, res) => {
        console.log("server, req", req)
        const photoKey = req.params.photoKeyId;

        console.log("server, photokey", photoKey)

        try {
            const data = await onePhoto(`photos/${photoKey}`);
            console.log("data", data)
            res.setHeader('Content-Type', data.ContentType);
            data.Body.pipe(res);
        } catch (error) {
            res.status(404).send(error.message); 
        }
    },

    getAllPhotos: async (req, res) => {
        try {
            const result = await listAllPhotos();
            const photos = result.Contents.map(photo => photo.Key);
            return photos;
        } catch(error) {
            res.status(500).send(error.message);
        }
    },

    updatePhoto: async (req, res) => {
        const originalPhotoKey = req.params.photoKey;
        
        try {
            await this.addSinglePhoto(req);
        } catch (error) {
            res.status(500).send(error.message);
        }
        
        try {
            await deletePhoto(`photos/${originalPhotoKey}`);
            res.send('Photos deleted from S3 bucket.')
        } catch (error) {
            res.status(500).send(error.message);
        }

        try {
            await Photo.deleteOne({photoKey: `${originalPhotoKey}`})
            res.json("photoKey deleted from mongo photos collection")
        } catch (error) {
            res.status(404).send(error.message)
        }
    },

    deleteAPhoto: async (req, res) => {
        const photoKey = req.photoKey;

        try {
            await deletePhoto(`photos/${photoKey}`);
            res.send('Photos deleted from S3 bucket.')
        } catch (error) {
            res.status(500).send(error.message);
        }

        try {
            await Photo.deleteOne({photoKey: `${originalPhotoKey}`})
            res.json("photoKey deleted from mongo photos collection")
        } catch (error) {
            res.status(404).send(error.message)
        }
    },

}