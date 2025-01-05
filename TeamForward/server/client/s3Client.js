const {S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command} = require('@aws-sdk/client-s3');
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const region = process.env.S3_REGION;
const bucket = process.env.S3_BUCKET;

var config = {
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
  region: region
}

const s3 = new S3Client(config);

const addPhoto = (photoKey, body) => {
  return s3.send(new PutObjectCommand({
    Bucket: bucket,
    Key: photoKey,
    Body: body
  }));
}

const onePhoto = (photoKey) => {
  return s3.send(new GetObjectCommand({
    Bucket: bucket,
    Key: photoKey
  }));
}

const listAllPhotos = () => {
  return s3.send(new ListObjectsV2Command({
    Bucket: bucket,
    Prefix: 'photos/',
  }));
}

const deletePhoto = (photoKey) => {
  return s3.send(new DeleteObjectCommand({
    Bucket: bucket,
    Key: photoKey,
  }));
}

module.exports = {
  addPhoto,
  onePhoto,
  listAllPhotos,
  deletePhoto,
}
