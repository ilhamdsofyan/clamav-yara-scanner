const multer = require('multer');
const path = require('path');

// Setup storage
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, 'uploads/'); // Folder buat nyimpen file sementara
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Rename file biar unik
    }
});

// Filter file (opsional)
// const fileFilter = (req, file, cb) => {
//     if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/')) {
//         cb(null, true); // Accept file
//     } else {
//         cb(new Error('Invalid file type! Only images and PDFs are allowed.'), false);
//     }
// };

// Middleware multer
const upload = multer({
    storage: storage,
    // fileFilter: fileFilter,
    limits: {
        fileSize: 500 * 1024 * 1024 // Max 5MB
    }
});

module.exports = upload;
