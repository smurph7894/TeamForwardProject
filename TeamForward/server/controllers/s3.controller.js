const User = require("../models/User");
const log = require("../helpers/logging");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const locationHelpers = require("../helpers/locationHelpers");
const {addPhoto, onePhoto, listAllPhotos, deletePhoto } = require("../client/s3Client");
const Photo = require("../models/Photo");
const multer = require("multer");
const fileSystem = require('fs');

module.exports = {
    addSinglePhoto: async (req, res) => {
        const file = req.file;
        const destinationKey = `photos/${file.originalname}`;
        const body = fileSystem.createReadStream(file.path)
      
        try {
          await addPhoto(destinationKey, body);
          res.send('Photo added to S3 bucket.');
        } catch (error) {
          res.status(500).send(error.message);
          return;
        }

        try {
            await Photo.create({photoKey: destinationKey})
            res.json("photoKey added")
        } catch (error) {
            (err) => res.status(404).send(error.message)
        }
    },

    getPhoto: async (req, res) => {
        const photoKey = req.params.photoKey;

        try {
            const data = await onePhoto(photoKey);
            res.setHeader('Content-Type', data.ContentType);
            res.send(data.Body);
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
        const photoKey = req.params.photoKey;
        const file = req.file;
        const updatedKey = `photos/${file.originalname}`;
        const body = fileSystem.createReadStream(file.path)
        
        try {
            await this.addSinglePhoto(updatedKey, body);
            await this.deleteAPhoto(photoKey)
        } catch (error) {
            res.status(500).send(error.message);
        }
    },

    deleteAPhoto: async (req, res) => {
        const photoKey = req.params.photoKey;

        try {
            await deletePhoto(photoKey);
            res.send('Photos deleted from S3 bucket.')
        } catch (error) {
            res.status(500).send(error.message);
        }
    },

}