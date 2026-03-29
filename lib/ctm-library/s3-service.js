
const { v4: uuidv4 } = require("uuid");
// const { processImage } = require("./imageProcessor");
const { uploadToS3, deleteFolderFromS3} = require("./s3-repository");

const uploadSingleFileAsync = async (
  files,
  folderPath,
  organization,
  aspectRatio 
) => {
  if (!files || files.length === 0) {
    throw new Error("No file provided");
  }

  try {
    // Xử lý ảnh với sharp (webp)
    // const processedBuffer = await processImage(files[0].buffer, aspectRatio);
    const processedBuffer = files[0].buffer ;
    const newFileName = uuidv4() + ".webp";


    const key = `${folderPath}/${newFileName}`;

    // Bucket name mặc định - bạn có thể đổi theo org nếu muốn
    const bucketName = organization;

    // Upload file buffer lên S3 (MinIO)
    await deleteFolderFromS3(bucketName,folderPath)
    const fileUrl = await uploadToS3(processedBuffer, bucketName, key, "image/webp");

    return {
      message: "File uploaded & processed successfully!",
      fileName: newFileName,
      folderPath:fileUrl, // link truy cập file trên S3
      key,     // key lưu trên S3, để có thể xóa sau này
      bucketName,
      status: 200,
    };
  } catch (error) {
    throw error;
  }
};


const uploadMultipleFilesAsync = async (
  files,
  folderPath,
  organization,
  aspectRatio = "16:9" // hoặc "500x300" tuỳ yêu cầu
) => {
  if (!files || files.length === 0) {
    throw new Error("No files provided");
  }

  try {
    const bucketName = organization;

    // Xoá folder cũ nếu tồn tại
    await deleteFolderFromS3(bucketName, folderPath);

    const uploadResults = await Promise.all(
      files.map(async (file) => {
        // const processedBuffer = await processImage(file.buffer, aspectRatio);
        const processedBuffer = file[0].buffer ;
        const newFileName = uuidv4() + ".webp";
        const key = `${folderPath}/${newFileName}`;

        const fileUrl = await uploadToS3(processedBuffer, bucketName, key, "image/webp");

        return {
          fileName: newFileName,
          fileUrl,
          key,
        };
      })
    );
    const fileNames = uploadResults.map((file) => file.fileName);
    return {
      message: "Files uploaded & processed successfully!",
      fileNames: JSON.stringify(fileNames),
      folderPath :  `${folderPath}`,
      status: 200,
    };
  } catch (error) {
    throw error;
  }
};
const uploadFilesJoinInFolderAsync = async (
  files,
  folderPath,
  organization,
  aspectRatio = "16:9" // hoặc "500x300" tuỳ yêu cầu
) => {
  if (!files || files.length === 0) {
    throw new Error("No files provided");
  }

  try {
    const bucketName = organization;

    const uploadResults = await Promise.all(
      files.map(async (file) => {
        // const processedBuffer = await processImage(file.buffer, aspectRatio);
        const processedBuffer = file[0].buffer ;
        const newFileName = uuidv4() + ".webp";
        const key = `${folderPath}/${newFileName}`;

        const fileUrl = await uploadToS3(processedBuffer, bucketName, key, "image/webp");

        return {
          fileName: newFileName,
          fileUrl,
          key,
        };
      })
    );
    const fileNames = uploadResults.map((file) => file.fileName);
    return {
      message: "Files uploaded & processed successfully!",
      fileNames: JSON.stringify(fileNames),
      folderPath :  `${folderPath}`,
      status: 200,
    };
  } catch (error) {
    throw error;
  }
};
const deleteFolderAsync = async (folderPath, organization) => {
  try {
    const bucketName = organization;
    await deleteFolderFromS3(bucketName, folderPath);
    return {
      message: "Folder deleted successfully!",
      status: 200,
    };
  } catch (error) {
    throw error;
  }
};
module.exports = {
  uploadSingleFileAsync,
  uploadMultipleFilesAsync,
  uploadFilesJoinInFolderAsync,
  deleteFolderAsync,
};
