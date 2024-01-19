const {S3Client, ListBucketsCommand} = require('@aws-sdk/client-s3');
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

const getS3Buckets = () => {
  return s3.send(new ListBucketsCommand({}));
}

module.exports = {
  getS3Buckets,

}

// Call S3 to list the buckets (v2)
// s3.listBuckets(function (err, data) {
//     if (err) {
//       console.log("Error", err);
//     } else {
//       console.log("Success", data.Buckets);
//     }
//   });


s3.send(new ListBucketsCommand({}))
.then(
  res => console.log(res)
).catch (
  err => console.log(err)
);