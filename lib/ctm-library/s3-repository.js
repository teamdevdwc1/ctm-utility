const {
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  DeleteObjectsCommand
} = require('@aws-sdk/client-s3');

let s3Client = null;

const setup = (client) => {
  s3Client = client;
};


/**
 * Upload 1 buffer ảnh lên S3
 */
const uploadToS3 = async (buffer, bucketName, key, contentType = 'image/webp') => {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    ACL: 'public-read',  
  });

  await s3Client.send(command);
  return `${process.env.S3_URL}/${bucketName}/${key}`;
};

/**
 * Xoá 1 ảnh trên S3
 */
const deleteFromS3 = async (bucketName, key) => {
  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  await s3Client.send(command);
  return true;
};

async function checkIfFolderExists(bucketName, folderPath) {
    const params = {
        Bucket: bucketName,
        Prefix: folderPath,
        MaxKeys: 1
    };

    try {
        const command = new ListObjectsV2Command(params);
        const response = await s3Client.send(command);
        return response?.Contents?.length > 0;
    } catch (error) {
        console.error("Error checking folder existence:", error);
        return false;
    }
}
const deleteFolderFromS3 = async (bucketName, folderPath) => {
  // Ensure folderPath ends with "/"
  const checkIfFolderExistsValue = await checkIfFolderExists(bucketName, folderPath);
  if (!checkIfFolderExistsValue) {
    console.log('Folder does not exist.');
    return true;
  }
  const prefix = folderPath.endsWith('/') ? folderPath : `${folderPath}/`;

  // Step 1: List all objects in the folder
  const listCommand = new ListObjectsV2Command({
    Bucket: bucketName,
    Prefix: prefix,
  });

  const listResult = await s3Client.send(listCommand);

  if (!listResult.Contents || listResult.Contents.length === 0) {
    console.log('No objects found in folder.');
    return true;
  }

  // Step 2: Delete all listed objects
  const deleteCommand = new DeleteObjectsCommand({
    Bucket: bucketName,
    Delete: {
      Objects: listResult.Contents.map(obj => ({ Key: obj.Key })),
      Quiet: false,
    },
  });

  await s3Client.send(deleteCommand);
  return true;
};
module.exports = {
  setup,
  uploadToS3,
  deleteFromS3,
  deleteFolderFromS3
};
