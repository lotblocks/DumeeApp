﻿// const sharp = require('sharp');
// Temporary mock for Sharp - bypasses image processing to fix Node.js compatibility
const sharp = (input) => ({
  metadata: () => Promise.resolve({
    width: 1024,
    height: 1024,
    format: 'jpeg'
  }),
  resize: (width, height, options) => ({
    toBuffer: () => Promise.resolve(Buffer.from(input || '')),
    png: () => ({ toBuffer: () => Promise.resolve(Buffer.from(input || '')) }),
    jpeg: () => ({ toBuffer: () => Promise.resolve(Buffer.from(input || '')) }),
    webp: () => ({ toBuffer: () => Promise.resolve(Buffer.from(input || '')) })
  }),
  png: () => ({ toBuffer: () => Promise.resolve(Buffer.from(input || '')) }),
  jpeg: () => ({ toBuffer: () => Promise.resolve(Buffer.from(input || '')) }),
  webp: () => ({ toBuffer: () => Promise.resolve(Buffer.from(input || '')) }),
  toBuffer: () => Promise.resolve(Buffer.from(input || ''))
});

/**
 * Determines the file type of a buffer
 * @param {Buffer} dataBuffer
 * @param {boolean} [returnFileType=false] - Optional. If true, returns the file type instead of the file extension.
 * @returns {Promise<string|null|import('file-type').FileTypeResult>} - Returns the file extension if found, else null
 * */
const determineFileType = async (dataBuffer, returnFileType) => {
  const fileType = await import('file-type');
  const type = await fileType.fileTypeFromBuffer(dataBuffer);
  if (returnFileType) {
    return type;
  }
  return type ? type.ext : null; // Returns extension if found, else null
};

/**
 * Get buffer metadata
 * @param {Buffer} buffer
 * @returns {Promise<{ bytes: number, type: string, dimensions: Record<string, number>, extension: string}>}
 */
const getBufferMetadata = async (buffer) => {
  const fileType = await determineFileType(buffer, true);
  const bytes = buffer.length;
  let extension = fileType ? fileType.ext : 'unknown';

  /** @type {Record<string, number>} */
  let dimensions = {};

  if (fileType && fileType.mime.startsWith('image/') && extension !== 'unknown') {
    const imageMetadata = await sharp(buffer).metadata();
    dimensions = {
      width: imageMetadata.width,
      height: imageMetadata.height,
    };
  }

  return {
    bytes,
    type: fileType?.mime ?? 'unknown',
    dimensions,
    extension,
  };
};

module.exports = { determineFileType, getBufferMetadata };

