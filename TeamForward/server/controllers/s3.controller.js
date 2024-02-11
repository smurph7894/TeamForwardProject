const {addPhoto, onePhoto, listAllPhotos, deletePhoto } = require("../client/s3Client");
const fileSystem = require('fs');
const User = require("../models/User");
const { Readable } = require('stream');

const self = module.exports = {
    addOnePhoto: async (req) => {
        const file = req.file;
        const destinationKey = `photos/${file.originalname}`;
        const body = fileSystem.createReadStream(file.path)

        await addPhoto(destinationKey, body);
        await User.updateOne(
            {_id: req.params.userId},
            {$set: {s3ProfilePhotoKey: `${file.originalname}`}},
        )

        return file.originalname;
    },

    addSinglePhoto: async (req, res) => {
        try {
            const originalname = await self.addOnePhoto(req);
            res.json({ photoKey: originalname });
        } catch (error) {
            console.error("failed to add photo", error)
            res.status(500).send(error.message)
            return;
        }

        // console.log("server req", req);
        // const file = req.file;
        // const destinationKey = `photos/${file.originalname}`;
        // const body = fileSystem.createReadStream(file.path)

        // try {
        //   await addPhoto(destinationKey, body);
        //     console.log("add photo to s3 successful")
        // } catch (error) {
        //     console.error("create s3 photo failed", error)
        //     res.status(500).send(error.message);
        //   return;
        // }

        // try{
        //     await User.updateOne(
        //         {_id: req.params.userId},
        //         {$set: {s3ProfilePhotoKey: `${file.originalname}`}},
        //     )
        //     console.log("photokey added to user");
        //     //res.json is causing catch and errors (both sending res or res.json({photoKey: file.originalname}) or res.json({photoKey: `${file.originalname}`}) haven't worked)
        //     res.json({photoKey: file.originalname});
        // }catch (error) {
        //     console.error("add photokey to user failed", error)
        //     res.status(404).send(error.message)
        //     return;
        // }
    },

    getPhoto: async (req, res) => {
        // console.log("server, req", req)
        const photoKey = req.params.photoKeyId;

        // console.log("server, photokey", photoKey)

        try {
            const data = await onePhoto(`photos/${photoKey}`);
            // console.log("data", data)
            res.setHeader('Content-Type', data.ContentType);
            data.Body.pipe(res);
        } catch (error) {
            res.status(404).send(error.message); 
        }
    },

    updatePhoto: async (req, res) => {
        const originalPhotoKey = req.params.photoKey;
        
        try {
            console.log("s3 update - req ", req)
            await self.addSinglePhoto(req, res);
        } catch (error) {
            console.log("s3 update - first catch")
            res.status(500).send(error.message);
            return
        }
        
        try {
            await deletePhoto(`photos/${originalPhotoKey}`);
            console.log('Photos deleted from S3 bucket.')
        } catch (error) {
            console.log("s3 update - second catch")
            res.status(500).send(error.message);
            return
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
    },

}