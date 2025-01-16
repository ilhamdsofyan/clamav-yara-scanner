const { exec } = require('child_process');
const path = require('path');

const yaraPath = process.env.YARA_COMMAND; // Pastikan 'yara' ada di PATH, atau kasih full path
const rulesFile = path.join(__dirname, '../../yara-rules/index.yar');

exports.scanWithYara = (filePath) => {
    return new Promise((resolve, reject) => {
        const cmd = `${yaraPath} "${rulesFile}" "${filePath}"`;
        console.log(cmd);
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                return reject(new Error(stderr || 'Error running Yara scan.'));
            }

            const result = stdout.trim();
            if (result) {
                resolve({ malicious: true, details: result });
            } else {
                resolve({ malicious: false });
            }
        });
    });
};
