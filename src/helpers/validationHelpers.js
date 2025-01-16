const fs = require("fs");
const mime = require("mime-types");
const path = require("path");

const isValidExtension = (fileName, allowedExtensions) => {
  const ext = path.extname(fileName).slice(1); // Ambil extension tanpa dot
  return allowedExtensions.includes(ext.toLowerCase());
};

const isValidMimeType = (mimeType, allowedMimeTypes) => {
  return allowedMimeTypes.includes(mimeType);
};

const generateAllowedMimeTypes = (allowedExtensions) => {
  return allowedExtensions.map((ext) => mime.lookup(ext)).filter(Boolean);
};

const isMaliciousContent = (filePath) => {
  // Daftar pattern yang dianggap berbahaya
  const disallowedPatterns = [
    /<\?php/i, // PHP code
    /<script>/i, // Inline JS
    /<\/script>/i, // Inline JS close tag
    /eval\(/i, // JS eval function
    /document\.cookie/i, // JS untuk akses cookie
    /<iframe>/i, // Inline iframe
    /onerror=/i, // XSS payload
  ];

  try {
    const content = fs.readFileSync(filePath, "utf-8");

    // Cek setiap pattern disallowed di dalam konten file
    for (const pattern of disallowedPatterns) {
      if (pattern.test(content)) {
        return true; // Ditemukan pattern mencurigakan
      }
    }

    return false; // Aman
  } catch (err) {
    console.error(`Error reading file: ${err.message}`);
    throw new Error("Failed to validate file content");
  }
};

module.exports = {
  isValidExtension,
  isValidMimeType,
  generateAllowedMimeTypes,
  isMaliciousContent,
};
