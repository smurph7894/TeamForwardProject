const {addPhoto, onePhoto, listAllPhotos, deletePhoto } = require("../client/s3Client");
const Photo = require("../models/Photo");
const fileSystem = require('fs');
const User = require("../models/User");

module.exports = {
    addSinglePhoto: async (req, res) => {
        const file = req.file;
        const destinationKey = `photos/${file.originalname}`;
        const body = fileSystem.createReadStream(file.path)

        try {
          await addPhoto(destinationKey, body);
          res.json({photoKey: file.originalname});
        } catch (error) {
          res.status(500).send(error.message);
          return;
        }

        try {
            await Photo.create({
                photoKey: `${file.originalname}`,
                userId: req.userId
            })
            res.json("photoKey added to mongo photos db")
        } catch (error) {
            (error) => res.status(404).send(error.message)
        }

        try{
            await User.updateOne(
                {_id: req.userId},
                {$set: {s3ProfilePhotoKey: `${file.originalname}`}},
            )
            res.json("photoKey added to user")
        }catch (error) {
            (error) => res.status(404).send(error.message)
        }
    },

    getPhoto: async (req, res) => {
        console.log("server, req", req)
        const photoKey = req.photoKey;

        console.log("server, photokey", photoKey)

        try {
            const data = await onePhoto(`photos/${photoKey}`);
            res.setHeader('Content-Type', data.ContentType);
            res.send(data.Body);
            console.log("data.body server", data.Body);
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
            (err) => res.status(404).send(error.message)
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
            (err) => res.status(404).send(error.message)
        }
    },

}