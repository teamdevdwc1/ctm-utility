const { S3Client } = require('@aws-sdk/client-s3');

let s3Client;

const initS3Client = ({ endpoint, region , accessKeyId, secretAccessKey }) => {
  if (!s3Client) {
    s3Client = new S3Client({
      endpoint,
      region: region || 'us-east-1',
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      forcePathStyle: true,
    });
  }
  return s3Client;
};

module.exports = { initS3Client };
