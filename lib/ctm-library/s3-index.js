const { initS3Client } = require('./s3-client');
const s3Repository = require('./s3-repository');
const s3service = require('./s3-service');

let initialized = false;

const s3Init = (config) => {
  if (initialized) return;

  const s3Client = initS3Client(config);
  s3Repository.setup(s3Client);

  initialized = true;
};

module.exports = {
  s3Init,
  uploadSingleFileAsync: s3service.uploadSingleFileAsync,
  uploadMultipleFilesAsync: s3service.uploadMultipleFilesAsync,
  uploadFilesJoinInFolderAsync: s3service.uploadFilesJoinInFolderAsync,
  deleteFolderAsync : s3service.deleteFolderAsync,
};