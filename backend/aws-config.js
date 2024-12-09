// aws-config.js
const { S3Client } = require("@aws-sdk/client-s3");

// Explicitly define the AWS configuration values
const AWS_ACCESS_KEY_ID = "AKIAUJ3VUSNXYACZERLS";
const AWS_SECRET_ACCESS_KEY = "/jd3/L2/QgfsFfSELmY++NrdRsiVU1OhDMxl7uVV";
const AWS_REGION = "eu-north-1"; // Replace with your region
const S3_BUCKET_NAME = "kidgage"; // Replace with your bucket name

// Log the values to verify
console.log("AWS Access Key:", AWS_ACCESS_KEY_ID);
console.log("AWS Secret Key:", AWS_SECRET_ACCESS_KEY);
console.log("AWS Region:", AWS_REGION);
console.log("S3 Bucket:", S3_BUCKET_NAME);

// Create the S3 client with the hardcoded credentials
const s3 = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

module.exports = s3;
