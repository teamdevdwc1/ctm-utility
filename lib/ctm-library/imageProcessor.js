const sharp = require("sharp");


function parseTargetSize(sizeStr) {
  if (!sizeStr || !sizeStr.includes("x")) return { width: 500, height: 300 }; // fallback
  const [w, h] = sizeStr.split("x").map(Number);
  return {
    width: isNaN(w) ? 500 : w,
    height: isNaN(h) ? 300 : h,
  };
}

async function processImage(buffer, targetSizeStr) {
  const image = sharp(buffer);
  const metadata = await image.metadata();
  const { width, height } = metadata;

  let processed = image;

  if (targetSizeStr && targetSizeStr.includes("x")) {
    const { width: targetW, height: targetH } = parseTargetSize(targetSizeStr);
    const targetRatio = targetW / targetH;
    const actualRatio = width / height;
    const isOk = Math.abs(actualRatio - targetRatio) <= 0.1;

    if (!isOk) {
      if (actualRatio > targetRatio) {
        // ảnh quá rộng → cắt ngang
        const newWidth = Math.round(height * targetRatio);
        const left = Math.floor((width - newWidth) / 2);
        processed = processed.extract({ left, top: 0, width: newWidth, height });
      } else {
        // ảnh quá cao → cắt dọc
        const newHeight = Math.round(width / targetRatio);
        const top = Math.floor((height - newHeight) / 2);
        processed = processed.extract({ left: 0, top, width, height: newHeight });
      }
    }

    // Resize về đúng kích thước mong muốn
    processed = processed.resize(targetW, targetH, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    });
  }

  // Convert sang webp, bỏ metadata
  const outputBuffer = await processed.webp({ quality: 80 }).toBuffer();
  return outputBuffer;
}


module.exports = {
  processImage,
};
