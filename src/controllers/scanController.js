const fs = require("fs");
const {
  isValidExtension,
  isValidMimeType,
  generateAllowedMimeTypes,
  isMaliciousContent
} = require("../helpers/validationHelpers");
const clamavService = require("../services/clamavService");
const yaraService = require("../services/yaraService");

const scanFiles = async (files, extensions) => {
  try {
    if (files.length === 0) {
      return {
        code: 400,
        success: false,
        message: "No files uploaded!",
      };
    }

    const allowedExtensions = extensions.split(",").map((ext) => ext.trim().toLowerCase());
    const allowedMimeTypes = generateAllowedMimeTypes(allowedExtensions);

    const results = [];

    // Loop untuk cek tiap file
    for (let file of files) {
      // Validasi extension
      if (!isValidExtension(file.originalname, allowedExtensions)) {
        results.push({ file: file.originalname, success: false, message: "Invalid file extension" });
        continue;
      }

      // Validasi MIME type
      if (!isValidMimeType(file.mimetype, allowedMimeTypes)) {
        results.push({ file: file.originalname, success: false, message: "Invalid MIME type" });
        continue;
      }

      // Validasi konten file
      if (isMaliciousContent(file.path)) {
        results.push({ file: file.originalname, success: false, message: "Malicious content detected!" });
        continue;
      }

      // Scan dengan Yara
      const yaraResult = await yaraService.scanWithYara(file.path);
      if (yaraResult.malicious) {
        results.push({
          file: file.originalname,
          success: false,
          message: "Malicious patterns detected by Yara!",
          details: yaraResult.details,
        });
        continue;
      }

      // Scan file dengan ClamAV
      const scanResult = await clamavService.scan(file);
      results.push({
        file: file.originalname,
        success: true,
        ...scanResult,
      });
    }

    // Response hasil scan
    return {
      code: 200,
      success: true,
      results,
    };

  } catch (error) {
    return {
      code: 500,
      success: false,
      message: error.message || error,
    };

  } finally {
    // Hapus file yang sudah diproses
    if (files) {
      files.forEach((file) => {
        fs.unlink(file.path, (err) => {
          if (err) console.error("Failed to delete file:", err);
        });
      });
    }
  }
};

exports.scanFile = async (req, res) => {
  const files = [req.file] || [];
  const { extensions } = req.body;

  const scanResult = await scanFiles(files, extensions);

  if (scanResult.results.length > 0) {
    scanResult.result = scanResult.results[0];
    scanResult.success = scanResult.result.success;
    delete scanResult.results;
  }

  res.status(scanResult.code).json(scanResult);
};

exports.scanFiles = async (req, res) => {
  const files = req.file || [];
  const { extensions } = req.body;

  const scanResult = await scanFiles(files, extensions);

  res.status(scanResult.code).json(scanResult);
};
