const express = require('express');
const scanController = require('../controllers/scanController');
const router = express.Router();
const upload = require('../middlewares/upload');

router.get('/', (req, res) => res.send('ClamAV API is running!'));

router.post('/scan', upload.single('files'), scanController.scanFile);
router.post('/scans', upload.array('files'), scanController.scanFiles);

module.exports = router;
